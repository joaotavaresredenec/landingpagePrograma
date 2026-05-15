# Revisão de Materiais — Sprint Materiais v1

**Data:** 2026-04-21  
**Status: Deploy aprovado ✓**

---

## Resumo

Foram identificados e corrigidos 7 itens durante a revisão. Nenhum item bloqueador permanece. O build final compila sem erros TypeScript e gera 45 páginas estáticas.

---

## Itens revisados e corrigidos

### 🟠 Alto — Corrigidos antes do deploy

| # | Item | Severidade | Ação |
|---|---|---|---|
| 1 | `baralho-outras-historias-novas-identidades`: `descricaoCard` com 189 chars (limite: 180) | 🟠 | Reduzido para 140 chars |
| 2 | `futuro-ancestral-na-escola`: `descricaoCard` com 188 chars (limite: 180) | 🟠 | Reduzido para 167 chars |
| 3 | `direitos-e-cidadania-cadernos-do-professor`: bullet com 13 palavras (limite: 12) | 🟠 | Reduzido para 11 palavras |
| 4 | `cartilha-violencia-contra-mulher-nao-e-normal`: `etapas: []` — material não aparecia em nenhum filtro de etapa | 🟠 | Adicionado `ensino-fundamental-ii` + `ensino-medio` |
| 5 | Tema `saude` sem nenhum material — filtro BNCC retornava 0 resultados | 🟠 | Adicionado `saude` em 2 materiais pertinentes: Saúde para Todos e Trilhas Formativas |
| 6 | Tema `meio-ambiente` sem nenhum material — filtro BNCC retornava 0 resultados | 🟠 | Adicionado `meio-ambiente` em 2 materiais pertinentes: Caminhos Sustentáveis e Futuro Ancestral |

### ⚪ Baixo — Backlog (não impedem deploy)

| # | Item | Severidade | Recomendação |
|---|---|---|---|
| 7 | `config/materials.ts` (legado com 6 materiais fictícios) ainda existe no projeto; `BibliotecaPreview.tsx` na homepage ainda usa esses dados antigos | ⚪ | Atualizar `BibliotecaPreview.tsx` para usar cards dos 36 materiais reais em sprint posterior |

---

## Resultado final por dimensão

### T4.1 — Editorial ✓
- Zero referências a Eixos da Matriz de Saberes
- Todos os `tituloEditorial` únicos (36/36)
- Nenhum título começa com artigo
- Todos dentro de 80 chars
- Todos os `descricaoCard` dentro de 180 chars
- Todos com 4 `pontosChave` dentro de 12 palavras
- Tom de serviço público verificado nos 36 materiais

### T4.2 — Técnico ✓
- Zero campos obrigatórios vazios
- Zero IDs duplicados
- Zero links `pendente` (todos os 36 materiais têm URLs ativas)
- Build: 0 erros TypeScript, 45 páginas geradas
- `robots: { index: false }` em `/materiais` e `/materiais/[slug]`

### T4.3 — UX/UI ✓
- Filtros com `aria-pressed`, `role="group"`, `aria-label`
- Abas com `role="tablist"`, `role="tab"`, `aria-selected`
- Campo de busca com `aria-label`
- Contagem com `aria-live="polite"`
- Botões "Em breve" com `aria-disabled="true"`
- Focus ring `focus-visible:ring-2 focus-visible:ring-redenec-verde` em todos os controles
- Breadcrumb com `aria-label` e `aria-current="page"`
- Grid responsivo: 1 col (mobile) / 2 cols (tablet) / 3 cols (desktop)

### T4.4 — Taxonômico ✓
- Todos os 36 materiais com `tipo` válido (4 categorias)
- Todos os valores de `etapas` e `temas` dentro do vocabulário controlado
- Distribuição: planos-de-aula (16) · guias-e-cartilhas (11) · videos-e-recursos-digitais (6) · jogos-e-atividades (3)
- Todos os 5 temas BNCC agora têm pelo menos 1 material
- Todos os 5 etapas de ensino agora têm cobertura

---

## Status: Deploy aprovado ✓

Zero itens 🔴. Zero itens 🟠. Sprint Materiais v1 pronta para deploy.
