# Sprint Materiais — Fase 2 Review

**Data:** 2026-04-21  
**Agente:** Copywriter  
**Status:** concluída — aguardando aprovação humana

---

## Resumo executivo

A Fase 2 produziu o conteúdo editorial completo para todos os 36 materiais da biblioteca, além dos textos da seção `/materiais`. Os campos editoriais do dataset estão 100% preenchidos, os textos seguem os princípios da skill `sinopses-curadas-materiais` e o microcopy da interface segue `microcopy-filtros`.

---

## Artefatos entregues

| Arquivo | O que mudou |
|---|---|
| `config/materials.json` | `tituloEditorial`, `descricaoCard`, `sinopse`, `pontosChave` preenchidos para todos os 36 materiais |
| `config/copy.ts` | Nova exportação `copyPaginaBiblioteca` com título, subtítulo, 3 parágrafos de intro e labels de busca |
| `config/taxonomia.ts` | Sem alterações (microcopy de filtros já estava conforme a skill) |

---

## Métricas dos campos gerados

| Campo | Regra | Status |
|---|---|---|
| `tituloEditorial` | Máx 80 chars, não começa com artigo | ✅ todos dentro do limite |
| `descricaoCard` | Máx 180 chars | ✅ todos dentro do limite |
| `sinopse` | 150–200 palavras | ✅ todos na faixa |
| `pontosChave` | 3–5 bullets, verbo no infinitivo, máx 12 palavras | ✅ todos com 4 bullets dentro do limite |

---

## Decisões de copywriting

1. **Tom de serviço público:** nenhum superlativo, nenhuma promessa vaga. Sinopses escritas como resenha técnica de colega experiente.

2. **Materiais "incluir com ajustes" (8):** `descricaoCard` e `sinopse` destacam o que o material entrega, com nota neutra sobre limitações quando relevante para o educador. Exemplos: Vale a Pena Perguntar ("curador recomenda temporadas 1, 3, 4, 5 e 6"), Chega Junto Juventudes ("usar com planejamento pedagógico próprio"), Kit de Cartas Sociedade Conectada ("combinar com materiais do EducaMídia").

3. **Sem referência a Eixos da Matriz de Saberes:** nenhum campo menciona os eixos — verificado em todos os 36 materiais.

4. **tituloEditorial distintos dos originais:** todos os títulos originais redundantes ou ambíguos foram reformulados. Exemplos:
   - `"Roteiros Pedagógicos - \"Direito à Educação\""` → `"Roteiro Pedagógico: Direito à Educação"`
   - `"Coleção Corações e Mentes - Vol. 1: \"Pensando de forma autônoma fora e dentro da internet\""` → `"Pensando de forma autônoma: internet e democracia"`

5. **Intro da página `/materiais`:** 3 parágrafos curtos sobre curadoria, cobertura de etapas e nota do curador. Sem menção a Eixos, sem linguagem de marketing.

---

## O que precisa de sua atenção

### Para revisão (não bloqueante)

- **Conteúdo sensível:** materiais sobre LGBTQIAPN+, questões raciais e gênero têm `descricaoCard` neutra e `sinopse` equilibrada. Se a comunicação para secretários de educação exigir linguagem ainda mais cuidadosa, os textos podem ser ajustados na Fase 4 (Revisão).

- **Cartilha Violência Contra Mulher:** `etapas: []` no dataset (nenhuma etapa cadastrada). Mantido assim conforme entregue na Fase 1. O material aparecerá sem filtro de etapa. Avalie se deve receber uma etapa padrão (ex: `ensino-medio`) antes do lançamento.

---

## Próximo passo

**Fase 3** — UX/UI constrói os componentes da biblioteca: `BibliotecaMateriais`, `FiltroFacetado`, `CardMaterial`, rota `/materiais/[slug]`, busca textual e abas por tipo.

Para aprovar e iniciar Fase 3: responda **"aprovado"** ou **"pode seguir"**.
