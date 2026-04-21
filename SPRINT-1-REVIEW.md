# Review Sprint 1 — Conteúdo e forma

**Data:** 2026-04-21  
**Agentes:** Copywriter + UX/UI (paralelo)  
**Status:** concluída — aguardando aprovação humana

---

## Resumo executivo

A Sprint 1 entregou a camada completa de conteúdo e componentes visuais da landing page. O Copywriter produziu todo o conteúdo textual em `config/copy.ts` (hero, desafios, biblioteca, accordion, microcopy do formulário, política de privacidade e e-mail transacional). O UX/UI implementou 30 arquivos: configuração Tailwind com tokens da marca Redenec, componentes primitivos WCAG AA, seções completas e todas as rotas Next.js — tudo importando copy de `@/config/copy`. Os dois agentes trabalharam em paralelo sem conflitos de arquivo.

---

## Entregas

### Copywriter (SP1-01 a SP1-06)
- `config/copy.ts` — 10 constantes exportadas cobrindo 100% do conteúdo textual do site

### UX/UI (SP1-07 a SP1-10)
- `tailwind.config.ts` — paleta Redenec, Figtree, borderRadius pill, escala tipográfica
- `app/globals.css` — CSS custom properties, container-site, section-spacing
- `next.config.ts` — configuração base com otimização de imagens
- **7 componentes primitivos:** Button (3 variantes), Input, Select, Checkbox, Card
- **4 componentes UI:** Accordion (WCAG AA), CardMaterial, CardDesafio, CampoFormulario
- **3 componentes visuais:** GrafismoModular (4 variantes SVG), Logo (3 variantes), ParceirosStrip
- **7 seções:** Hero, Desafios, BibliotecaPreview, Orientacoes, SobrePrograma, Formulario, Rodape
- **5 páginas:** `/`, `/obrigado`, `/materiais`, `/politica-de-privacidade`, layout raiz
- `config/materials.ts` — tipo Material + 6 itens com driveUrl placeholder

---

## Decisões autônomas para sua ciência

1. **Dado numérico em copySobre:** o Copywriter usou "mais de 1.200 municípios" (dado estimado). O PM atualizou para "mais de 2.500 municípios e 20 estados" conforme informação do usuário. Número exato a confirmar amanhã.
2. **UF_OPTIONS no Formulario.tsx:** lista dos 27 estados hardcoded no componente (o copy.ts não lista UFs individualmente — apenas label/placeholder/erro do campo). Decisão razoável; pode ser movida para `config/copy.ts` futuramente se necessário.
3. **GrafismoModular como SVG inline:** implementado sem assets externos para máxima flexibilidade e sem dependência de arquivos de imagem.
4. **Logo variant via CSS filter:** `brightness-0 invert` para versão branca, `brightness-0` para preta. Evita duplicar assets de logo.
5. **Accordion com `hidden` nativo:** `display:none` em vez de `max-height` — melhor compatibilidade com leitores de tela.
6. **Formulario.tsx:** submit simulado com `setTimeout` (800ms) em Sprint 1. TODOs Sprint 2 claramente marcados em comentários.

---

## Pendências carregadas para a Sprint 2

| # | Item | Bloqueante? |
|---|---|---|
| 1 | Logos ausentes: MEC, CNMP, CGU, Consed — placeholders em uso | Não (visual apenas) |
| 2 | Logos `images.png` e `zqzdN...png` com nomes genéricos — identificar a qual parceiro correspondem e atualizar `ParceirosStrip.tsx` | Não |
| 3 | `driveUrl: '#'` em todos os materiais — substituir pelos links reais do Google Drive | Não (funcional apenas em produção) |
| 4 | Dado exato de municípios/estados aderidos — a confirmar amanhã | Não |
| 5 | Revisão jurídica da política de privacidade — recomendada antes do deploy | Não |

---

## Próximo passo

Sprint 2: **DevOps** (setup GitHub, Vercel, Vercel KV) + **Integrations** (Brevo, magic link, route handlers) em paralelo.

Para aprovar e iniciar Sprint 2: responda **"aprovado"** ou rode `/sprint 2`  
Para ajustar algo: descreva e direciono para o agente responsável  
Para ver detalhes: abra os handoffs em `.agents/handoffs/sprint-1/aprovados/`
