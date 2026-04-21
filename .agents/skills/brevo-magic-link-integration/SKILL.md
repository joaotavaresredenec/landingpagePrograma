---
name: brevo-magic-link-integration
description: Implementa a integração completa com Brevo (criação de contato com atributos customizados, envio de e-mail transacional) e o fluxo de magic link para autenticação sem senha (geração de token criptograficamente seguro, armazenamento no Vercel KV com TTL, validação na rota protegida). Usar nos tickets T2.5, T2.6, T2.7 e T2.8 de integração, ou ao debugar problemas do fluxo de captação de leads.
---

# Skill: Brevo + Magic Link

Integração de captação e autenticação sem senha.

## Arquitetura do fluxo

```
[Formulário] → POST /api/lead
                ↓
           1. Valida dados
           2. Gera token criptográfico (UUID v4 + HMAC)
           3. Salva { token → { email, criadoEm, perfil, ... } } no Vercel KV (TTL 30 dias)
           4. Chama Brevo: cria/atualiza contato com atributos
           5. Chama Brevo: dispara e-mail transacional com link /materiais?token={token}
           6. Retorna 200 → frontend redireciona para /obrigado

[E-mail com magic link] → usuário clica
                ↓
           [/materiais?token=X] → GET /api/validar-token?token=X
                                    ↓
                              1. Lê { email, ... } do KV
                              2. Se não existe ou expirou: redireciona para /#formulario
                              3. Se válido: renderiza biblioteca
```

## Dependências

```bash
npm install @getbrevo/brevo @vercel/kv
npm install --save-dev @types/node
```

## Cliente Brevo — `lib/brevo.ts`

```typescript
import * as Brevo from '@getbrevo/brevo'

const apiInstance = new Brevo.ContactsApi()
apiInstance.setApiKey(
  Brevo.ContactsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
)

const emailInstance = new Brevo.TransactionalEmailsApi()
emailInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
)

export type LeadData = {
  nome: string
  email: string
  perfil: 'tecnico' | 'gestor' | 'professor' | 'estudante'
  uf: string
  municipio: string
  etapaEnsino: string
  consentimentoLgpd: boolean
  consentimentoTimestamp: string
  consentimentoIp: string
  consentimentoUserAgent: string
}

export async function criarOuAtualizarContato(lead: LeadData) {
  const contato = new Brevo.CreateContact()
  contato.email = lead.email
  contato.attributes = {
    NOME: lead.nome,
    PERFIL: lead.perfil,
    UF: lead.uf,
    MUNICIPIO: lead.municipio,
    ETAPA_ENSINO: lead.etapaEnsino,
    LGPD_CONSENTIMENTO: lead.consentimentoLgpd,
    LGPD_TIMESTAMP: lead.consentimentoTimestamp,
    LGPD_IP: lead.consentimentoIp,
    LGPD_USER_AGENT: lead.consentimentoUserAgent,
    FONTE: 'landing_programa_cidadania',
  }
  contato.listIds = [Number(process.env.BREVO_CONTACT_LIST_ID)]
  contato.updateEnabled = true  // se e-mail já existe, atualiza em vez de dar erro

  try {
    return await apiInstance.createContact(contato)
  } catch (err: any) {
    // Brevo retorna 400 "duplicate_parameter" quando o contato existe e updateEnabled=false
    // Com updateEnabled=true, atualiza silenciosamente
    throw new Error(`Erro ao criar contato no Brevo: ${err.message}`)
  }
}

export async function enviarMagicLink(params: {
  email: string
  nome: string
  magicLinkUrl: string
}) {
  const email = new Brevo.SendSmtpEmail()
  email.templateId = Number(process.env.BREVO_MAGIC_LINK_TEMPLATE_ID)
  email.to = [{ email: params.email, name: params.nome }]
  email.params = {
    NOME: params.nome.split(' ')[0], // primeiro nome
    MAGIC_LINK_URL: params.magicLinkUrl,
  }

  return await emailInstance.sendTransacEmail(email)
}
```

## Fluxo de magic link — `lib/magic-link.ts`

```typescript
import { kv } from '@vercel/kv'
import crypto from 'crypto'

const TTL_DIAS = 30
const TTL_SEGUNDOS = TTL_DIAS * 24 * 60 * 60

export type SessaoMagicLink = {
  email: string
  nome: string
  perfil: string
  criadoEm: string
}

export async function gerarMagicLinkToken(sessao: SessaoMagicLink): Promise<string> {
  // UUID v4 + HMAC para evitar adivinhação/brute-force
  const uuid = crypto.randomUUID()
  const hmac = crypto
    .createHmac('sha256', process.env.MAGIC_LINK_SECRET!)
    .update(uuid)
    .digest('hex')
    .slice(0, 16)

  const token = `${uuid}.${hmac}`

  await kv.set(`magic-link:${token}`, sessao, { ex: TTL_SEGUNDOS })

  return token
}

export async function validarMagicLinkToken(token: string): Promise<SessaoMagicLink | null> {
  // Valida formato
  const [uuid, hmac] = token.split('.')
  if (!uuid || !hmac) return null

  const hmacEsperado = crypto
    .createHmac('sha256', process.env.MAGIC_LINK_SECRET!)
    .update(uuid)
    .digest('hex')
    .slice(0, 16)

  if (hmac !== hmacEsperado) return null

  // Busca no KV
  const sessao = await kv.get<SessaoMagicLink>(`magic-link:${token}`)
  return sessao || null
}

export async function revogarToken(token: string): Promise<void> {
  await kv.del(`magic-link:${token}`)
}
```

## Route Handler — `app/api/lead/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { criarOuAtualizarContato, enviarMagicLink } from '@/lib/brevo'
import { gerarMagicLinkToken } from '@/lib/magic-link'

// Schema de validação (pode usar zod, aqui forma manual para clareza)
type PayloadLead = {
  nome: string
  email: string
  perfil: string
  uf: string
  municipio: string
  etapaEnsino: string
  consentimentoLgpd: boolean
}

export async function POST(req: NextRequest) {
  try {
    const payload: PayloadLead = await req.json()

    // Validações mínimas
    if (!payload.email || !payload.nome || !payload.consentimentoLgpd) {
      return NextResponse.json(
        { erro: 'Dados incompletos ou consentimento LGPD ausente' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return NextResponse.json(
        { erro: 'E-mail inválido' },
        { status: 400 }
      )
    }

    // Captura metadados LGPD
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const timestamp = new Date().toISOString()

    // 1. Criar/atualizar contato no Brevo
    await criarOuAtualizarContato({
      ...payload,
      perfil: payload.perfil as any,
      consentimentoTimestamp: timestamp,
      consentimentoIp: ip,
      consentimentoUserAgent: userAgent,
    })

    // 2. Gerar magic link token
    const token = await gerarMagicLinkToken({
      email: payload.email,
      nome: payload.nome,
      perfil: payload.perfil,
      criadoEm: timestamp,
    })

    // 3. Enviar e-mail com magic link
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/materiais?token=${token}`
    await enviarMagicLink({
      email: payload.email,
      nome: payload.nome,
      magicLinkUrl,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Erro no /api/lead:', err)
    return NextResponse.json(
      { erro: 'Erro ao processar cadastro' },
      { status: 500 }
    )
  }
}
```

## Route Handler — `app/api/validar-token/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { validarMagicLinkToken } from '@/lib/magic-link'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valido: false }, { status: 400 })
  }

  const sessao = await validarMagicLinkToken(token)

  if (!sessao) {
    return NextResponse.json({ valido: false }, { status: 404 })
  }

  return NextResponse.json({ valido: true, sessao })
}
```

## Página protegida — `app/materiais/page.tsx`

A página valida o token no servidor (Server Component) e renderiza o conteúdo ou redireciona.

```typescript
import { redirect } from 'next/navigation'
import { validarMagicLinkToken } from '@/lib/magic-link'
import { BibliotecaCompleta } from '@/components/sections/BibliotecaCompleta'

export default async function MateriaisPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  if (!token) {
    redirect('/#formulario')
  }

  const sessao = await validarMagicLinkToken(token)

  if (!sessao) {
    redirect('/?erro=token_invalido#formulario')
  }

  return <BibliotecaCompleta sessao={sessao} />
}
```

## Configuração no painel Brevo

No painel Brevo (app.brevo.com), configurar antes do primeiro deploy:

### 1. Criar atributos customizados
Contacts → Settings → Contact attributes → criar:
- `NOME` (texto)
- `PERFIL` (texto)
- `UF` (texto)
- `MUNICIPIO` (texto)
- `ETAPA_ENSINO` (texto)
- `LGPD_CONSENTIMENTO` (booleano)
- `LGPD_TIMESTAMP` (texto ou data)
- `LGPD_IP` (texto)
- `LGPD_USER_AGENT` (texto)
- `FONTE` (texto)

### 2. Criar lista de contatos
Contacts → Lists → criar "Programa Cidadania — Leads". Anotar o ID numérico.

### 3. Criar template de e-mail transacional
Templates → New template → modo HTML ou drag-and-drop. Body precisa usar as variáveis `{{ params.NOME }}` e `{{ params.MAGIC_LINK_URL }}`. Anotar o ID do template.

### 4. Obter API key
SMTP & API → API Keys → criar nova chave com permissão SMTP e Contacts.

## Testes básicos

```bash
# Testar endpoint localmente
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"seu@email.com","perfil":"tecnico","uf":"SP","municipio":"São Paulo","etapaEnsino":"Todas","consentimentoLgpd":true}'
```

Esperado: `{"ok":true}` e e-mail chegando na caixa em menos de 30 segundos.
