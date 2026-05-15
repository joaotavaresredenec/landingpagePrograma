# Prompt URGENTE: Restaurar autenticação da biblioteca + 2 ajustes visuais

Cole este prompt no Claude Code em nova sessão limpa. O ajuste 1 é **crítico** — acesso à biblioteca está desprotegido e vazando conversões de leads.

---

## Contexto inicial — para o agente

Projeto: Landing page da Redenec para o Programa PECS do MEC.
Domínio: https://www.cidadaniaesustentabilidade.com.br
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Brevo, Redis, Vercel.
Repo: joaotavaresredenec/landingpagePrograma, branch main.

Leia antes: `BRIEF.md`, `.agents/rules/projeto-contexto.md`, `.agents/skills/brevo-magic-link-integration/SKILL.md`.

**IMPORTANTE:** o ajuste 1 é crítico de negócio. A biblioteca está acessível publicamente sem o formulário e está causando perda de captação de leads. Priorize esse ajuste e me avise assim que estiver resolvido — posso validar antes dos outros ajustes.

---

## AJUSTE 1 (URGENTE) — Restaurar autenticação obrigatória da biblioteca

### Contexto do problema

Antes da última rodada de mudanças (implementação do /mapa com senha + ajustes visuais), a página `/biblioteca` exigia:
- Preenchimento do formulário de cadastro (nome, e-mail, perfil, UF, município, LGPD)
- Criação de cookie de sessão após submissão
- Acesso via magic link enviado por e-mail (como alternativa/backup)

Agora, `/biblioteca` está abrindo direto, sem pedir nada. Isso quebrou a captação de leads, que é o principal objetivo de negócio do site.

### Diagnóstico esperado

Executar estes passos de investigação primeiro:

1. **Verificar o estado atual do `app/biblioteca/page.tsx`:**
   - A página está checando `obterSessao()` ou `temSessao()` no início?
   - Está renderizando condicionalmente o componente `<AreaRestrita>` quando não há sessão?
   - Ou está renderizando a biblioteca direto?

2. **Verificar o estado de `lib/sessao.ts`:**
   - O arquivo ainda existe?
   - As funções `criarSessao`, `obterSessao`, `encerrarSessao` continuam exportadas?
   - Foi renomeado ou substituído por `lib/sessao-mapa.ts` erroneamente?

3. **Verificar `app/api/lead/route.ts`:**
   - O endpoint do formulário ainda está criando a sessão após cadastro?
   - A chamada `await criarSessao({...})` está presente?

4. **Verificar se existe componente `<AreaRestrita>`:**
   - Em `components/auth/AreaRestrita.tsx` ou similar
   - Se foi removido, precisa ser recriado

5. **Verificar o fluxo do magic link:**
   - `app/api/validar-token/route.ts` ou rota equivalente ainda valida o token do e-mail?
   - A página `/biblioteca?token=X` ainda aceita o parâmetro e cria cookie?

### Reportar o diagnóstico antes de consertar

Antes de fazer qualquer mudança, **reportar ao usuário humano o que encontrou**:
- Quais arquivos estão faltando/quebrados?
- O que parece ter sido removido ou renomeado?
- Qual sua hipótese do que causou o problema?

Aguardar minha confirmação antes de implementar a correção. Isso evita sobrescrever mais coisa.

### Correção esperada (depois de eu aprovar)

Restaurar o comportamento original da biblioteca:

**`app/biblioteca/page.tsx`:**

```tsx
import { redirect } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { validarMagicLinkToken } from '@/lib/magic-link'
import { criarSessao, obterSessao } from '@/lib/sessao'
import { BibliotecaCompleta } from '@/components/sections/BibliotecaCompleta'
import { AreaRestrita } from '@/components/auth/AreaRestrita'

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  // 1. Se veio via magic link (?token=X), validar e criar sessão
  if (searchParams.token) {
    const sessao = await validarMagicLinkToken(searchParams.token)
    if (sessao) {
      await criarSessao({
        email: sessao.email,
        nome: sessao.nome,
        perfil: sessao.perfil,
        criadoEm: sessao.criadoEm,
      })
      redirect('/biblioteca')  // URL limpa
    }
  }
  
  // 2. Verificar cookie de sessão
  const sessao = await obterSessao()
  
  // 3. Se não autenticado, mostrar área restrita com formulário inline
  if (!sessao) {
    return (
      <AreaRestrita
        titulo="Para acessar a Biblioteca"
        descricao="36 recursos pedagógicos curados pela Redenec para apoiar a implementação do Programa Educação para a Cidadania e Sustentabilidade em redes de ensino."
        icone={BookOpen}
        origem="biblioteca"
      />
    )
  }
  
  // 4. Autenticado: mostra biblioteca
  return <BibliotecaCompleta sessao={sessao} />
}
```

Mesmo padrão aplicado em `app/materiais/[slug]/page.tsx`.

### Se `lib/sessao.ts` foi removido/corrompido, recriar:

```typescript
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'redenec_sessao'
const TTL_DIAS = 30
const TTL_SEGUNDOS = TTL_DIAS * 24 * 60 * 60

export type DadosSessao = {
  email: string
  nome: string
  perfil: string
  criadoEm: string
}

const getSecret = () => new TextEncoder().encode(process.env.MAGIC_LINK_SECRET!)

export async function criarSessao(dados: DadosSessao): Promise<void> {
  const token = await new SignJWT(dados as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_DIAS}d`)
    .sign(getSecret())
  
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TTL_SEGUNDOS,
    path: '/',
  })
}

export async function obterSessao(): Promise<DadosSessao | null> {
  const cookie = cookies().get(COOKIE_NAME)
  if (!cookie) return null
  
  try {
    const { payload } = await jwtVerify(cookie.value, getSecret())
    return payload as unknown as DadosSessao
  } catch {
    return null
  }
}

export async function encerrarSessao(): Promise<void> {
  cookies().delete(COOKIE_NAME)
}
```

**IMPORTANTE:** o sistema da biblioteca (`sessao.ts`) e o sistema do mapa (`sessao-mapa.ts`) são **independentes**. Devem coexistir. Cada um tem seu próprio cookie (`redenec_sessao` vs `redenec_mapa`), seu próprio TTL (30 dias persistente vs sessão do browser) e seu próprio tipo de token.

### Se `<AreaRestrita>` foi removido, recriar em `components/auth/AreaRestrita.tsx`:

```tsx
'use client'

import type { LucideIcon } from 'lucide-react'
import { Formulario } from '@/components/sections/Formulario'

type AreaRestritaProps = {
  titulo: string
  descricao: string
  icone?: LucideIcon
  origem: 'mapa' | 'biblioteca' | 'materiais'
}

export function AreaRestrita({ titulo, descricao, icone: Icone, origem }: AreaRestritaProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-[#1b415e] text-white rounded-xl p-8 md:p-12 mb-8">
        <div className="flex items-start gap-6">
          {Icone && (
            <div className="shrink-0">
              <Icone size={48} strokeWidth={1.5} className="text-[#1cff9e]" />
            </div>
          )}
          <div>
            <p className="text-sm uppercase tracking-widest text-[#1cff9e] mb-2">
              Acesso restrito
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {titulo}
            </h1>
            <p className="text-lg opacity-85">
              {descricao}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 mb-8 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Por que pedimos seus dados?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          A Redenec organiza materiais em parceria com o Ministério da Educação. 
          Ao se cadastrar, você tem acesso imediato e permanente por 30 dias à 
          biblioteca completa e atualizações futuras do Programa.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
          <li>Acesso imediato após o cadastro — sem precisar checar e-mail</li>
          <li>Válido por 30 dias sem precisar recadastrar</li>
          <li>Seus dados são tratados conforme a LGPD</li>
          <li>Você também recebe um link por e-mail como backup</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Cadastre-se para continuar</h2>
        <Formulario origem={origem} redirectAposLogin={true} />
      </div>
    </main>
  )
}
```

### Verificar que `/api/lead/route.ts` ainda cria a sessão

O endpoint do formulário precisa, após validar e salvar no Brevo, chamar `criarSessao()`:

```typescript
await criarSessao({
  email: payload.email,
  nome: payload.nome,
  perfil: payload.perfil,
  criadoEm: timestamp,
})
```

Se essa linha foi removida, adicionar de volta.

### Validação da correção

Depois de implementar:

1. Rodar `npm run build` — deve compilar sem erros
2. Rodar `npm run dev`
3. Testar em modo anônimo (aba anônima do browser):
   - Abrir `http://localhost:3000/biblioteca` → **deve mostrar a tela de formulário**, não a biblioteca
   - Preencher formulário com dados reais → submeter
   - Deve redirecionar para `/biblioteca` **autenticado** (mostra os materiais)
   - Abrir nova aba normal em `/biblioteca` → deve continuar dentro (cookie ativo)
   - Usar `/api/logout` → sai, pede formulário de novo
4. Testar magic link:
   - Pegar um link do e-mail que chegou anteriormente (ou simular com token válido)
   - Abrir em aba anônima → deve entrar na biblioteca e criar cookie
5. Commit: `fix: restaurar autenticacao obrigatoria da biblioteca`
6. Push para `main`
7. **Avisar para o usuário validar em produção ANTES de continuar com os outros ajustes**

---

## AJUSTE 2 — Grafismos sem fundo branco em todo o site

O usuário removeu manualmente o fundo do arquivo de grafismos e renomeou para `grafismosredenec.png` (ou extensão similar — confirmar com `ls public/`).

Tarefa: encontrar TODAS as ocorrências de grafismos no site e garantir que:

1. O `src` aponta para o novo arquivo `grafismosredenec.[extensao]` em vez do arquivo antigo
2. Os containers que envolvem os grafismos não têm `bg-white` ou fundos que interfiram na transparência

### Processo de busca

1. Rodar `ls public/` para confirmar o nome exato do arquivo (pode ser `grafismosredenec.png`, `.svg`, `.webp`)
2. Buscar no código com grep por:
   - `grafismo` (variações: Grafismo, grafismos, GRAFISMOS)
   - Nome de componentes existentes: `GrafismoFundoSecao`, `GrafismoHero`, etc.
   - Qualquer referência ao arquivo antigo (pode ser `grafismo.png`, `grafismos-redenec.png`, etc.)

### Locais prováveis onde os grafismos aparecem

- Hero da home (direita, grande)
- Hero da biblioteca (`HeroBiblioteca.tsx`)
- Hero do mapa (`TelaSenhaMapa.tsx`)
- Seção de FAQ (fundo decorativo)
- Seção "O que você encontra aqui" ou similar
- Possivelmente em outros locais

### Ação em cada ocorrência

Para cada `<img>` ou background-image que usa grafismo:

1. **Atualizar o src** para `grafismosredenec.[extensao]`
2. **Remover qualquer `bg-white`** do container wrapper
3. **Não aplicar** `mix-blend-mode: multiply` (o arquivo já está transparente)
4. **Manter** qualquer opacidade ou blend mode que seja parte do design original

Se o agente encontrar um grafismo usando SVG inline (não `<img>`), deixar como está — SVGs inline não têm fundo por padrão.

### Teste visual

Rodar `npm run dev` e conferir:
- Grafismos aparecem com fundo transparente (cor da seção aparece atrás)
- Nenhum "retângulo branco" visível atrás de círculos coloridos
- Em mobile, grafismos não quebram o layout

Reportar ao final a lista dos componentes alterados.

---

## AJUSTE 3 — Substituir logo do MEC

O usuário atualizou o arquivo `MEC2025.png` em `/public/logos/` substituindo pela versão sem fundo.

Tarefa: confirmar que o arquivo está sendo usado corretamente em todos os locais.

### Processo

1. Rodar `ls public/logos/` e confirmar que `MEC2025.png` está lá com tamanho maior que 0 bytes
2. Buscar no código por referências ao logo do MEC: grep por `mec` (case insensitive)
3. Para cada `<img>` que aponta para logo do MEC, garantir que:
   - `src="/logos/MEC2025.png"` (exatamente assim, com M maiúsculo)
   - `alt="Ministério da Educação (MEC)"`
   - O container wrapper **não tem** `bg-white` ou `bg-gray`
   - **Não aplicar** `mix-blend-mode: multiply`

### Locais prováveis

- Seção "Realização do Programa" na home (ParceirosStrip.tsx ou equivalente)
- Rodapé (se MEC aparecer)
- Qualquer outro lugar

Nota: o logo MEC é clicável (link externo para gov.br/mec/...) conforme AJUSTE 2 da rodada anterior. Preservar esse comportamento.

### Teste visual

- MEC aparece com fundo totalmente transparente (cor da seção atrás)
- Clicar no logo ainda leva ao site oficial em nova aba
- Em mobile, o logo mantém proporção correta

---

## Validação final e deploy

Depois dos 3 ajustes:

1. Rodar `npm run build` — deve compilar sem erros
2. Testar em modo anônimo:
   - `/biblioteca` pede formulário (ajuste 1 crítico)
   - Grafismos sem fundo branco em toda navegação
   - Logo MEC sem fundo
3. Commit único (se todos os ajustes foram feitos na mesma sessão): 
   `fix: restaurar autenticacao biblioteca + grafismos e logo mec sem fundo`
4. Push para `main`
5. Me avisar quando deploy terminar para validação em produção

---

## Não fazer

- Não remover o sistema de senha do mapa (ajuste 1 é sobre biblioteca, não mapa)
- Não alterar outros componentes visuais sem necessidade
- Não mexer no formulário, integração com Brevo ou magic link
- Não fazer redesign — é só corrigir o que quebrou e atualizar arquivos

---

## Reportar ao final

1. **Ajuste 1:** o que estava quebrado exatamente? (arquivo removido? lógica alterada? middleware removido?)
2. **Ajuste 2:** lista dos componentes que foram atualizados com o novo arquivo de grafismo
3. **Ajuste 3:** confirmação de que o MEC está referenciado corretamente em todos os lugares
4. TODOs restantes (se algum arquivo não foi encontrado, se precisa de ação do usuário)

Comece pelo AJUSTE 1 (urgente). Faça o diagnóstico antes da correção. Pause para eu aprovar depois do diagnóstico.
