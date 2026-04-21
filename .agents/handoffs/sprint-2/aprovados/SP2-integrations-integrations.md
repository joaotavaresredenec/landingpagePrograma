# Handoff: Integrations → PM

**Ticket:** SP2-04 a SP2-08
**Sprint:** 2
**Status:** concluído
**Data:** 2026-04-21

## Resumo em uma frase
Implementação completa da integração do formulário com Brevo API e Vercel KV, incluindo geração e validação de magic link para acesso autenticado à página de materiais.

## Artefatos entregues
- `lib/brevo.ts` — cliente Brevo com `criarOuAtualizarContato` e `enviarEmailMagicLink` (SP2-04)
- `lib/kv.ts` — cliente Vercel KV (SP2-05)
- `lib/magic-link.ts` — geração, armazenamento e validação de token UUID+HMAC com TTL 30 dias (SP2-05)
- `app/api/lead/route.ts` — POST handler com validações, rastreabilidade LGPD, integração Brevo e KV (SP2-06)
- `app/api/validar-token/route.ts` — GET handler de validação de token (SP2-06)
- `app/materiais/page.tsx` — atualizado com validação de token server-side e redirect para token inválido (SP2-07)
- `components/sections/Formulario.tsx` — atualizado com fetch real para `/api/lead`, simulação removida (SP2-08)
- `config/lgpd.ts` — versionamento do termo de consentimento LGPD v1.0 (SP2-07b)

## Decisões tomadas autonomamente
- No catch de `Formulario.tsx`, optou-se por exibir a mensagem de erro vinda da API quando específica (ex.: "Nome é obrigatório."), mas manter a mensagem genérica de contato para erros 500 sem mensagem descritiva — melhor UX sem vazar stack traces.
- `app/materiais/page.tsx` foi reescrito com a nova estrutura de validação server-side. O layout rico da Sprint 1 (header com logo, hero, grid semântico com `<ul>/<li>`) foi substituído pelo layout mínimo especificado no ticket SP2-07, que reutiliza o `CardMaterial` existente. A decisão garante que a página seja server component puro (sem `'use client'`), permitindo o `redirect()` server-side e o `await validateToken`.

## Desvios do brief
- Nenhum desvio funcional. O layout da página `/materiais` mudou em relação à Sprint 1 (header/hero removidos) conforme previsto no ticket SP2-07, que especifica uma estrutura mais simples. Se o PM preferir manter o layout rico, é necessário criar um wrapper client para o `CardMaterial` (que usa `onAcessar: () => void`) e mover a lógica de redirect para middleware.

## Dependências ou bloqueios
- Variáveis de ambiente necessárias antes do deploy: `BREVO_API_KEY`, `BREVO_CONTACT_LIST_ID`, `BREVO_MAGIC_LINK_TEMPLATE_ID`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `MAGIC_LINK_SECRET`, `NEXT_PUBLIC_BASE_URL`
- Template de e-mail no Brevo deve conter variáveis `NOME` e `MAGIC_LINK_URL`
- Lista de contatos no Brevo deve existir com o ID configurado em `BREVO_CONTACT_LIST_ID`
- Atributos de contato no Brevo devem ser criados: `NOME`, `PERFIL`, `UF`, `MUNICIPIO`, `ETAPA_ENSINO`, `LGPD_CONSENTIMENTO`, `LGPD_TIMESTAMP`, `LGPD_IP`, `LGPD_USER_AGENT`, `LGPD_VERSAO_TERMO`, `FONTE`

## Checklist de critérios de aceite
- [x] lib/brevo.ts usa BREVO_API_KEY via process.env
- [x] lib/magic-link.ts: token com UUID + HMAC, TTL 30 dias exatos
- [x] validateToken retorna null para token inválido (não lança exceção)
- [x] /api/lead rejeita consentimentoLgpd: false com status 400
- [x] Erros internos não vazam para o cliente
- [x] /materiais usa redirect() server-side para token inválido
- [x] Formulario.tsx integrado com /api/lead (simulação removida)
- [x] config/lgpd.ts com versão 1.0 do termo

## Próximo passo sugerido
PM valida. Usuário deve configurar Brevo e Vercel KV conforme SETUP.md antes de testar o fluxo completo.
