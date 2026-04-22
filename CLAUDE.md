# CLAUDE.md — Contexto do Projeto

## Visão geral

Landing page + biblioteca de materiais autenticada para a **Rede Nacional de Educação Cidadã (Redenec)**, organização parceira do MEC no âmbito do **Programa Educação para a Cidadania e Sustentabilidade (PECS)** — Portaria MEC nº 642/2025.

URL de produção: **cidadaniaesustentabilidade.com.br** (Vercel)
Dev server: `npm run dev` → `http://localhost:3000`

## Stack

- **Next.js 14** App Router, TypeScript
- **Tailwind CSS** com tema customizado (ver `tailwind.config.ts`)
- **Font**: Figtree (Google Fonts, 400/700) via `next/font/google`
- **Brevo** (`@getbrevo/brevo`): CRM de contatos + e-mail transacional por template
- **Redis** (`ioredis` via `lib/kv.ts`): sessões de magic link com TTL de 30 dias
- **lucide-react**: ícones

## Cores (design system)

| Token                  | Hex       | Uso principal                        |
|------------------------|-----------|--------------------------------------|
| `redenec-verde`        | `#1cff9e` | CTA primário, ring de foco, acentos  |
| `redenec-petroleo`     | `#1b415e` | Texto de marca, botões secundários   |
| `redenec-escuro`       | `#243837` | Fundo do rodapé                      |
| `redenec-coral`        | `#ff8b80` | Accent decorativo                    |
| `redenec-cinza`        | `#e5e4e9` | Fundo de seções (página de materiais)|
| `redenec-azul`         | `#0086ff` | Destaque informativo                 |

Classes utilitárias globais definidas em `app/globals.css`: `container-site`, `section-spacing`, `btn-primary`.

## Estrutura de rotas

```
/                    → Landing page (pública)
/materiais           → Biblioteca de materiais (requer token ou NODE_ENV=development)
/materiais/[slug]    → Página individual de cada material (36 páginas estáticas)
/plano-de-acao       → Template imprimível de Plano de Ação (público, print-friendly)
/obrigado            → Página pós-cadastro
/politica-de-privacidade
/api/lead            → POST: cadastro de lead + magic link
/api/validar-token   → GET: valida token sem redirecionar
```

## Autenticação (magic link)

Fluxo completo:
1. Usuário preenche formulário (`/api/lead` POST)
2. API cria contato no Brevo CRM, gera token (`uuid.hmac16`) e armazena no Redis
3. E-mail com magic link enviado via template Brevo (`BREVO_MAGIC_LINK_TEMPLATE_ID`)
4. Magic link: `{NEXT_PUBLIC_BASE_URL}/materiais?token={token}`
5. `/materiais/page.tsx` valida token no Redis → renderiza `<BibliotecaCompleta>`

Em `NODE_ENV=development` a autenticação é bypassada (acesso direto com nome "Visualização local").

**Variáveis de ambiente obrigatórias** (`.env.local` + Vercel):
```
REDIS_URL=                        # Upstash ou Redis interno
MAGIC_LINK_SECRET=                # 64-char hex aleatório
BREVO_API_KEY=                    # Chave da API Brevo
BREVO_CONTACT_LIST_ID=            # ID numérico da lista no Brevo
BREVO_MAGIC_LINK_TEMPLATE_ID=     # ID numérico do template no Brevo (DEVE ser número, não string vazia)
NEXT_PUBLIC_BASE_URL=             # Ex: https://cidadaniaesustentabilidade.com.br
```

**Bug conhecido**: se `BREVO_MAGIC_LINK_TEMPLATE_ID` for string vazia, `Number("")` → `0` e o envio falha silenciosamente (inner try/catch em `app/api/lead/route.ts:80`).

## Biblioteca de materiais

- **Dados**: `config/materials.json` — 36 materiais curados pela Redenec
- **Tipos**: `types/material.ts` (`Material`, `TipoRecurso`, `EtapaEnsino`, `TemaBNCC`)
- **Taxonomia**: `config/taxonomia.ts` — `TIPOS_RECURSO`, `ETAPAS_ENSINO`, `TEMAS_BNCC`, `COPY_BIBLIOTECA`
- **Thumbnails**: `config/thumbnails.ts` — mapa `id → Unsplash photo ID`; overlay da cor da organização em 72% de opacidade
- **Filtragem facetada**: AND entre grupos (etapa + tema), OR dentro do grupo — regra documentada em `taxonomia.ts`
- **Disclaimer**: `CuradoriaDisclaimer` aparece na primeira visita por sessão (`sessionStorage`)

Tipos de recurso (ordem de exibição):
1. `planos-de-aula`
2. `guias-e-cartilhas`
3. `videos-e-recursos-digitais`
4. `jogos-e-atividades`

## Recursos públicos relevantes

- `/public/logos/rede_nec_vetor-01.png` — logo principal Redenec
- `/public/portaria-642-2025-pecs.pdf` — documento oficial do programa (copiado de Desktop)
- Rota `/plano-de-acao` — template A4 imprimível com `window.print()` + `@media print`

## Componentes-chave

| Arquivo | Responsabilidade |
|---------|-----------------|
| `components/sections/BibliotecaCompleta.tsx` | Biblioteca completa com filtros facetados, abas por tipo, busca, disclaimer, links de download |
| `components/sections/FAQ.tsx` | 10 perguntas sobre o PECS + download da portaria |
| `components/ui/CuradoriaDisclaimer.tsx` | Modal one-shot (sessionStorage) avisando que curadoria é Redenec, não MEC |
| `components/ui/CardMaterial.tsx` | Card de material com thumbnail, badge de tipo, etapas |
| `components/ui/MaterialThumbnail.tsx` | Thumbnail com foto Unsplash + overlay da cor da organização |
| `components/ui/Accordion.tsx` | Accordion com `RichText` — renderiza `**bold**` e listas sem dependências externas |
| `lib/magic-link.ts` | Geração (`uuid.hmac16`) e validação de tokens |
| `lib/brevo.ts` | `criarOuAtualizarContato()` + `enviarEmailMagicLink()` |
| `lib/kv.ts` | Wrapper ioredis/Redis |
| `config/copy.ts` | Todos os textos da UI centralizados |
| `config/lgpd.ts` | Versão e texto do termo de consentimento LGPD |

## Convenções

- Textos da UI em `config/copy.ts` — nunca hardcoded nos componentes
- Sem dependências de markdown (Accordion usa parser interno `renderInline()`)
- `next/image` com `remotePatterns` para `images.unsplash.com` (configurado em `next.config.mjs`)
- Páginas de materiais pré-renderizadas via `generateStaticParams` em `app/materiais/[slug]/page.tsx`
- LGPD: rastreabilidade completa (IP, user-agent, timestamp, versão do termo) salva no Brevo

## Backlog conhecido

- `BibliotecaPreview.tsx` ainda usa 6 materiais fictícios de `config/materials.ts` (arquivo legado) — baixa prioridade, apenas para o preview da landing page
- E-mail: template HTML em `email-templates/magic-link.html` deve ser configurado no Brevo e o ID numérico definido em `BREVO_MAGIC_LINK_TEMPLATE_ID`
- `NEXT_PUBLIC_BASE_URL` deve ser atualizado para o domínio de produção nas variáveis Vercel
