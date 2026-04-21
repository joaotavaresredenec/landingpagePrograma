# Review Sprint 2 — Infra e dados

**Data:** 2026-04-21  
**Agentes:** DevOps + Integrations (paralelo)  
**Status:** concluída — aguardando aprovação humana

---

## Resumo executivo

A Sprint 2 entregou toda a infraestrutura do projeto e as integrações de backend. O DevOps produziu os arquivos de configuração do projeto Next.js (package.json, tsconfig, ESLint, Prettier, .gitignore, postcss), o `.env.example` documentado e um `SETUP.md` completo cobrindo Brevo, Vercel KV, GitHub e DNS. O Integrations implementou o cliente Brevo, o fluxo de magic link com token UUID+HMAC armazenado no Vercel KV (TTL 30 dias), os dois route handlers (`/api/lead` e `/api/validar-token`), a página `/materiais` com validação server-side e o `Formulario.tsx` integrado ao backend real. O projeto está tecnicamente completo e pronto para deploy após configuração das variáveis de ambiente.

---

## Entregas

### DevOps (SP2-01, SP2-02, SP2-03)
- `package.json` — Next.js 14.2.29, Brevo SDK, Vercel KV, Lucide, clsx + devDeps completas
- `tsconfig.json` — strict mode, paths `@/*`, plugin next
- `.eslintrc.json` — next/core-web-vitals + prettier
- `.prettierrc` — semi false, singleQuote, prettier-plugin-tailwindcss
- `.gitignore` — node_modules, .next, .env*.local, .vercel
- `postcss.config.js` — tailwindcss + autoprefixer
- `README.md` — guia de desenvolvedor com comandos e estrutura
- `.env.example` — 8 variáveis documentadas sem valores reais
- `SETUP.md` — guia completo de 7 passos para configuração manual

### Integrations (SP2-04 a SP2-08)
- `lib/brevo.ts` — `criarOuAtualizarContato` + `enviarEmailMagicLink`, BREVO_API_KEY via env
- `lib/kv.ts` — cliente Vercel KV via `createClient`
- `lib/magic-link.ts` — `generateToken` (UUID + HMAC-SHA256), `storeToken` (TTL 2.592.000s), `validateToken` (null-safe)
- `app/api/lead/route.ts` — validação de todos os campos, LGPD obrigatório, rastreabilidade (IP, user-agent, timestamp, versão do termo), integração Brevo + KV + e-mail, erros genéricos ao cliente
- `app/api/validar-token/route.ts` — sem exposição de dados da sessão
- `app/materiais/page.tsx` — `redirect()` server-side para token ausente/inválido, grid com `CardMaterial`
- `components/sections/Formulario.tsx` — simulação removida, fetch real para `/api/lead`
- `config/lgpd.ts` — versionamento v1.0 do termo de consentimento

---

## Decisões autônomas para sua ciência

1. **Email normalizado para lowercase** em `/api/lead` antes de enviar ao Brevo e ao KV — evita duplicatas por capitalização diferente.
2. **Mensagem de erro da API exposta parcialmente** no formulário: erros de validação (400) mostram a mensagem da API; erros de servidor (500) mostram mensagem genérica de contato — equilíbrio entre UX e segurança.
3. **`validateToken` null-safe por design** — qualquer erro de formato ou token expirado retorna `null` silenciosamente; exceções de rede são propagadas para o caller tratar.
4. **`/api/validar-token` não expõe a sessão** — retorna apenas `{ valido: true }`, sem email ou nome, evitando vazamento via GET público.
5. **`searchParams` em `/materiais`** tratado com duck-typing para compatibilidade com Next.js 14 e 15 (async vs sync).

---

## Ações que requerem execução manual (antes do deploy)

Todas detalhadas no `SETUP.md`. Resumo:

| # | Ação | Bloqueante para deploy? |
|---|---|---|
| 1 | Configurar atributos customizados no Brevo | Sim |
| 2 | Criar lista "Programa Cidadania — Leads" no Brevo e anotar ID | Sim |
| 3 | Criar template de e-mail transacional no Brevo e anotar ID | Sim |
| 4 | Obter BREVO_API_KEY e adicionar nas env vars da Vercel | Sim |
| 5 | Ativar Vercel KV e adicionar as 3 vars KV_* na Vercel | Sim |
| 6 | Gerar MAGIC_LINK_SECRET e adicionar na Vercel | Sim |
| 7 | Inicializar repositório GitHub e fazer push | Sim |
| 8 | DNS no Registro.br — aguardando aprovação do domínio | Não (pode deployar em *.vercel.app) |

---

## Pendências carregadas para a Sprint 3

| # | Item | Bloqueante? |
|---|---|---|
| 1 | Links Google Drive dos materiais (`driveUrl: '#'` em `config/materials.ts`) | Não (botões "Em breve") |
| 2 | Logos ausentes: MEC, CNMP, CGU — ainda placeholders | Não (visual apenas) |
| 3 | Número exato de municípios/estados aderidos — confirmar amanhã | Não |
| 4 | Revisão jurídica da política de privacidade | Não (recomendada antes do lançamento) |

---

## Próximo passo

Sprint 3: **QA** — teste ponta-a-ponta, responsividade, Lighthouse, conformidade LGPD, cross-browser.

**Antes de iniciar a Sprint 3**, é necessário que você execute pelo menos os passos 1–7 do `SETUP.md` para que o QA possa testar o fluxo completo (formulário → Brevo → e-mail → magic link → `/materiais`).

Para aprovar e iniciar Sprint 3: responda **"aprovado"** ou rode `/sprint 3`  
Para ajustar algo: descreva e direciono para o agente responsável  
Para ver detalhes: `.agents/handoffs/sprint-2/aprovados/`
