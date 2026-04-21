# Handoff: UX/UI → PM

**Ticket:** SP1-07 a SP1-10
**Sprint:** 1
**Status:** concluído
**Data:** 2026-04-21

## Resumo em uma frase
Todos os tokens de design, componentes primitivos, visuais e de seção, e páginas da Sprint 1 foram implementados com Tailwind customizado, WCAG AA, Figtree via next/font e copy vinda de @/config/copy.

## Artefatos entregues

### Configuração (SP1-07)
- `tailwind.config.ts` — tema completo com cores redenec.*, fontFamily Figtree, borderRadius pill
- `app/globals.css` — CSS custom properties, reset, utilitários de layout e section spacing
- `next.config.ts` — configuração base do Next.js com otimização de imagens

### Componentes primitivos (SP1-08)
- `components/primitives/Button.tsx` — variantes primary/secondary/ghost, tamanhos sm/md/lg, suporte a asLink, aria-label
- `components/primitives/Input.tsx` — label, required, error, helperText, foco verde
- `components/primitives/Select.tsx` — mesmo padrão do Input + ícone ChevronDown, appearance-none
- `components/primitives/Checkbox.tsx` — label como ReactNode (suporta links), accent-color verde
- `components/primitives/Card.tsx` — wrapper genérico com padding variável e tag semântica configurável

### Componentes UI (SP1-08)
- `components/ui/Accordion.tsx` — aria-expanded, aria-controls, role="region", toggle Enter/Space, useId para IDs únicos
- `components/ui/CardMaterial.tsx` — titulo, descricao, icone: LucideIcon, onAcessar callback
- `components/ui/CardDesafio.tsx` — titulo, corpo, icone: LucideIcon
- `components/ui/CampoFormulario.tsx` — wrapper com label + cloneElement para injeção de aria props

### Componentes visuais (SP1-09)
- `components/visual/GrafismoModular.tsx` — 4 variantes SVG inline (hero, secao, cta, denso), 6 paletas de círculos, 2 cores de linhas
- `components/visual/Logo.tsx` — variant principal/mono-preto/mono-branco via CSS filter
- `components/visual/ParceirosStrip.tsx` — logos reais + placeholders retangulares para logos ausentes

### Seções (SP1-09)
- `components/sections/Hero.tsx` — grafismo hero no canto direito, CTA ancora #formulario, faixa parceiros
- `components/sections/Desafios.tsx` — grid 2×2 desktop / 1col mobile, ícones Lucide
- `components/sections/BibliotecaPreview.tsx` — grid 3col desktop / 1col mobile, cada card ancora #formulario
- `components/sections/Orientacoes.tsx` — Accordion acessível com 6 itens
- `components/sections/SobrePrograma.tsx` — fundo petroleo, texto branco, link MEC externo, ParceirosStrip invertida
- `components/sections/Formulario.tsx` — 6 campos + LGPD, validação client-side, estado loading/erro, TODO Sprint 2
- `components/sections/Rodape.tsx` — fundo escuro, logo mono-branco, contato MEC, redes sociais com aria-label

### Páginas (SP1-10)
- `app/layout.tsx` — Figtree next/font, metadata base, Open Graph
- `app/page.tsx` — composição das 7 seções na ordem correta
- `app/obrigado/page.tsx` — metadata específica, robots noindex, UI de confirmação
- `app/materiais/page.tsx` — grid materiais, TODO Sprint 2 para validação de token
- `app/politica-de-privacidade/page.tsx` — renderização formatada do copyPoliticaPrivacidade.conteudo

### Config
- `config/materials.ts` — tipo Material + array materials com 6 itens e driveUrl '#'
- `config/copy.ts` — já existia (criado pelo Copywriter); **não foi sobrescrito**; exportações usadas: copyHero, copyDesafios, copyBiblioteca, copyOrientacoes, copySobre, copyFormulario, copyRodape, copyObrigado, copyPoliticaPrivacidade

## Decisões tomadas autonomamente

1. **copy.ts já existia** — O Copywriter já havia criado o arquivo com todas as exportações necessárias. Os componentes foram adaptados ao schema real encontrado (ex: `copyHero.ctaLabel` em vez de `copyHero.ctaPrimario`, `copyFormulario.campos.uf` para o campo de UF).

2. **UF_OPTIONS hardcoded no Formulario.tsx** — O `config/copy.ts` existente define as opções de UF como `placeholder` sem listar os 27 estados. As opções completas foram incluídas diretamente no componente para garantir funcionalidade.

3. **GrafismoModular como SVG inline puro** — Implementado com 4 variantes SVG parametrizadas (não como arquivo externo) para máxima flexibilidade e sem dependência de assets.

4. **Logo variant mono-branco/mono-preto via CSS filter** — Evita duplicar assets. Usa `brightness-0 invert` (branco) e `brightness-0` (preto) sobre a imagem original.

5. **next.config.ts criado** — Arquivo não existia; criado com configuração mínima para otimização de imagens.

6. **Accordion com `hidden` nativo** — Usa `hidden` (display:none) em vez de `max-height` para melhor compatibilidade com leitores de tela.

## Desvios do brief

- O campo `copyFormulario.campos.uf` no copy.ts existente não lista os 27 estados (apenas `placeholder` e `erro`). As opções foram adicionadas como constante local em `Formulario.tsx`. Recomenda-se mover para `config/copy.ts` na Sprint 2.
- O `copyHero` existente usa `ctaLabel` (não `ctaPrimario` como no brief). Componente adaptado ao real.
- `copyBiblioteca.cards` usa `descricao` (não `corpo` como no brief para CardDesafio). Seções usam as props corretas de cada copy.

## Dependências ou bloqueios

1. **Logos ausentes de MEC, CNJ, CNMP, CGU, Consed** — ParceirosStrip usa placeholders retangulares com o nome do parceiro. Adicionar os arquivos em `public/logos/` quando disponíveis e passar `src` nas props de `DEFAULT_PARCEIROS`.

2. **Logos existentes precisam ser copiados para /public/logos/** — Os arquivos estão em `/logos/` na raiz do projeto, mas Next.js serve estáticos apenas de `/public/`. Executar manualmente:
   ```
   cp logos/* public/logos/
   ```
   ou mover via explorador de arquivos.

3. **Integração /api/lead (Sprint 2)** — `Formulario.tsx` tem comentário `// TODO Sprint 2: integrar com /api/lead`. Atualmente simula delay e redireciona para /obrigado.

4. **Validação de token em /materiais (Sprint 2)** — `app/materiais/page.tsx` tem comentário `// TODO Sprint 2: validar token via /api/validar-token`.

5. **driveUrl em materials.ts** — Todos os materiais têm `driveUrl: '#'`. Substituir pelos links reais do Google Drive na Sprint 2.

## Checklist de critérios de aceite

- [x] Apenas cores da paleta oficial (hex exatos) — verde #1cff9e, azul #0086ff, petroleo #1b415e, escuro #243837, coral #ff8b80, cinza #e5e4e9
- [x] Figtree em Regular (400) e Bold (700) apenas — next/font/google com weight: ['400', '700']
- [x] Todos os componentes mobile-first (sm/md/lg/xl) — grid e tipografia responsivos
- [x] WCAG AA: labels, aria, foco visível — htmlFor em todos os inputs, aria-expanded no Accordion, focus-visible ring com redenec-verde
- [x] Heading hierárquico sem pular níveis — h1 nas pages, h2 nas sections, h3 nos cards
- [x] Formulário com id="formulario" para ancoragem — section com id="formulario" em Formulario.tsx
- [x] Copy vem de @/config/copy, não hardcoded — todos os textos importados
- [ ] Logos ausentes: MEC, CNJ, CNMP, CGU, Consed — placeholders usados
- [ ] Logos presentes ainda não estão em /public/logos/ — mover manualmente de /logos/ para /public/logos/

## Próximo passo sugerido

1. **Imediato:** Mover arquivos de `/logos/` para `/public/logos/` para que as imagens sirvam corretamente.
2. **Sprint 2 (DevOps + Integrations):** Implementar `/api/lead` (Brevo + Vercel KV + magic link), `/api/validar-token`, substituir driveUrls.
3. **PM:** Validar grid responsivo, contraste de cores e fluxo de adesão no browser antes de aprovar para deploy.

---
**Validação PM:** aprovado em 2026-04-21

Logos copiados para `/public/logos/` pelo PM. Novos logos identificados durante a sprint: `cnj.png` (CNJ confirmado). Dois arquivos com nome genérico (`images.png`, `zqzdNqwJE7j7P2a31F46pVp8Ku0pmKzRjorRzrS9.png`) — identificação e wiring em `ParceirosStrip.tsx` carregados para Sprint 2.
