---
name: auditoria-lgpd-performance
description: Executa auditoria completa do site antes do deploy de produção, cobrindo conformidade LGPD, performance via Lighthouse, acessibilidade, SEO on-page e compatibilidade cross-browser. Usar na Sprint 3 como validação final antes do /ship, ou quando houver mudanças significativas em CSS, JS ou estrutura de página.
---

# Skill: Auditoria LGPD, performance e cross-browser

Validação final antes do deploy de produção.

## Parte 1 — Checklist LGPD

Usar este checklist em todas as páginas:

### Formulário
- [ ] Checkbox LGPD existe e é obrigatório
- [ ] Texto do checkbox é claro sobre finalidade
- [ ] Link para política de privacidade é clicável e abre em nova aba
- [ ] Campo "consentimentoLgpd" é enviado no payload ao submeter

### Política de privacidade
- [ ] Página `/politica-de-privacidade` existe e é acessível via rodapé
- [ ] Identifica controlador dos dados (Redenec)
- [ ] Lista todos os dados coletados
- [ ] Explica finalidade específica
- [ ] Cita base legal (consentimento — Art. 7º, I LGPD)
- [ ] Explica retenção e compartilhamento
- [ ] Lista direitos do titular
- [ ] Fornece contato para solicitações LGPD
- [ ] Tem data de última atualização

### Backend
- [ ] Endpoint `/api/lead` rejeita requests sem consentimento (400)
- [ ] IP, user-agent e timestamp são registrados no Brevo
- [ ] Versão do termo aceito é registrada
- [ ] Nenhum dado coletado além do estritamente necessário

### Cookies e tracking
- [ ] Não usa Google Analytics, Facebook Pixel ou similares sem banner de cookies
- [ ] Se usar analytics: Plausible ou Umami (privacy-friendly, sem banner obrigatório) ou banner de cookies adequado
- [ ] Sem cookies de terceiros não-essenciais

## Parte 2 — Lighthouse

Rodar em modo production (não dev) via:

```bash
# Com Chrome DevTools
# DevTools → Lighthouse → analisar cada página
```

Ou via CLI:

```bash
npx lighthouse https://programa-cidadania.vercel.app --view
```

### Metas obrigatórias
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 95

### Páginas a auditar
- `/` (landing principal)
- `/materiais?token=valido` (biblioteca autenticada)
- `/obrigado`
- `/politica-de-privacidade`

### Problemas comuns e fixes

| Problema | Fix |
|---|---|
| LCP alto por imagens grandes | Usar `next/image` com `priority` e formatos modernos (WebP, AVIF) |
| CLS por fontes piscando | Usar `next/font` com `display: 'swap'` — já feito |
| TBT alto por JS pesado | Code splitting com `dynamic()`, remover bibliotecas desnecessárias |
| Contraste insuficiente | Revisar pares de cor contra a tabela em `acessibilidade-wcag-aa` |
| Missing alt texts | Adicionar `alt` ou `alt=""` + `role="presentation"` |
| Meta description ausente | Adicionar em `generateMetadata()` de cada page |

## Parte 3 — SEO on-page

Validar em cada página:

### Metadata
- [ ] `<title>` presente, único, descritivo, até 60 caracteres
- [ ] `<meta name="description">` presente, até 160 caracteres
- [ ] `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- [ ] `<meta name="twitter:card" content="summary_large_image">`
- [ ] Favicon: `/favicon.ico` + versões 16x16, 32x32, 180x180 (apple-touch-icon)

### Estrutura
- [ ] H1 único por página
- [ ] Hierarquia de headings sem pular níveis
- [ ] URLs semânticas (`/materiais`, não `/page-42`)
- [ ] Texto interno > imagens de texto

### Sitemap e robots
- [ ] `public/robots.txt` permite indexação da home e bloqueia `/materiais` e `/api/*`
- [ ] `app/sitemap.ts` gera sitemap dinâmico para a home e política de privacidade

Exemplo de `robots.txt`:

```
User-agent: *
Allow: /
Disallow: /materiais
Disallow: /api/
Sitemap: https://programacidadaniaesustentabilidade.com.br/sitemap.xml
```

## Parte 4 — Cross-browser

Testar em:

### Desktop
- Chrome (última versão)
- Firefox (última versão)
- Safari (última versão — via Mac ou BrowserStack)
- Edge (última versão)

### Mobile
- Chrome Android
- Safari iOS

### Focos de teste
- Formulário submete corretamente
- Fontes renderizam (Figtree carrega)
- Layout não quebra
- Animações e transições funcionam
- Magic link abre da inbox e entra no site

## Parte 5 — Testes de resiliência

### Rede lenta
DevTools → Network → Slow 3G. Site usável em 5 segundos?

### Offline
DevTools → Network → Offline. Mensagem adequada em vez de tela em branco?

### Sem JavaScript
`<noscript>` opcional explicando que o formulário precisa de JS. Mínimo: página ainda mostra conteúdo essencial (hero, informações sobre o programa, contato).

## Parte 6 — Relatório final

Gerar `RELATORIO-AUDITORIA.md` consolidando:

```markdown
# Auditoria final — [data]

## Pontuações Lighthouse

| Página | Performance | Acessibilidade | Best Practices | SEO |
|---|---|---|---|---|
| / | 92 | 98 | 92 | 100 |
| /materiais | 95 | 96 | 92 | 100 |
| /obrigado | 98 | 100 | 92 | 100 |
| /politica-de-privacidade | 97 | 100 | 92 | 100 |

## Conformidade LGPD
✅ Aprovada — [ou lista de pendências]

## Cross-browser
✅ Testado em Chrome, Firefox, Safari, Edge, Chrome Android, Safari iOS
Problemas encontrados: [lista]

## Pendências bloqueadoras
[lista]

## Pendências não-bloqueadoras
[lista]

## Recomendação
[✅ aprovar | ⚠️ aprovar com ressalvas | ❌ não aprovar]
```
