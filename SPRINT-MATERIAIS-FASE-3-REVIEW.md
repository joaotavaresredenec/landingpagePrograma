# Sprint Materiais — Fase 3 Review

**Data:** 2026-04-21  
**Agente:** UX/UI  
**Status:** concluída — aguardando aprovação humana

---

## Resumo executivo

A Fase 3 entregou a biblioteca filtrável completa com dados reais. O build compila sem erros TypeScript, gera 45 páginas estáticas (incluindo 36 rotas `/materiais/[slug]`) e não há referências a Eixos da Matriz de Saberes em nenhum componente.

---

## Artefatos entregues

| Arquivo | O que mudou |
|---|---|
| `components/sections/BibliotecaCompleta.tsx` | Reescrito: dados reais, abas por tipo, filtros facetados, busca textual, estado vazio, contagem dinâmica |
| `components/ui/CardMaterial.tsx` | Reescrito: usa `Material` type, múltiplos links, tituloEditorial + organizacao + descricaoCard |
| `app/materiais/[slug]/page.tsx` | Novo: 36 páginas de detalhe estáticas com sinopse, pontos-chave, botões e breadcrumb |
| `.agents/skills/biblioteca-com-filtros-facetados/SKILL.md` | Novo skill criado |
| `.agents/skills/card-material-redenec/SKILL.md` | Novo skill criado |

---

## Funcionalidades implementadas

### T3.1–T3.7 — Checklist

- [x] **Abas por tipo:** Todos | Planos de aula (16) | Guias e cartilhas (11) | Vídeos e recursos digitais (6) | Jogos e atividades (3)
- [x] **Contagem nas abas:** atualizada dinamicamente com filtros ativos
- [x] **Filtros facetados:** etapa (chips multisseleção OR) + tema BNCC (chips multisseleção OR), AND entre grupos
- [x] **Botão "Limpar filtros":** aparece apenas quando etapa ou tema estiver ativo
- [x] **Campo de busca:** tempo real, sem debounce, busca em tituloEditorial + descricaoCard + organizacao
- [x] **Contagem dinâmica:** "1 material encontrado" / "N materiais encontrados" / "Nenhum material encontrado"
- [x] **Estado vazio:** mensagem + sugestão + botão "Limpar filtros"
- [x] **Página /materiais/[slug]:** breadcrumb, sinopse, pontos-chave, botões de acesso, tags de etapa/tema, licença
- [x] **robots: noindex** em `/materiais` e `/materiais/[slug]`
- [x] **generateStaticParams:** 36 páginas pré-geradas no build

### Acessibilidade

- [x] `role="tablist"` + `role="tab"` + `aria-selected` nas abas de tipo
- [x] `role="group"` + `aria-label` nos grupos de chips
- [x] `aria-pressed` em cada chip de filtro
- [x] `aria-live="polite"` na contagem de resultados
- [x] `aria-label` no campo de busca (via `copyPaginaBiblioteca.buscaAriaLabel`)
- [x] `aria-disabled` nos botões "Em breve"
- [x] Focus ring `focus-visible:ring-2 focus-visible:ring-redenec-verde` em todos os controles
- [x] `aria-current="page"` no breadcrumb
- [x] `aria-label` no breadcrumb nav

---

## Build

```
✓ Compiled without errors
✓ TypeScript: 0 erros
✓ 45 páginas geradas (incluindo 36 × /materiais/[slug])
```

---

## O que precisa de sua atenção

### Para revisão (não bloqueante)

- **`config/materials.ts` (arquivo legado):** ainda existe no projeto e define os 6 materiais fictícios antigos. Não é mais usado pelos componentes novos — pode ser deletado após aprovação do deploy, ou mantido como referência enquanto a seção de homepage preview ainda usa `BibliotecaPreview.tsx`.

- **`BibliotecaPreview.tsx` (homepage):** a seção de prévia na página inicial ainda usa os dados antigos de `config/materials.ts`. Se quiser substituir pelo preview real dos materiais (ex: 3–6 cards de destaque dos 36), isso pode ser feito na Fase 4 ou em sprint separado.

- **Cartilha sem etapas:** `cartilha-violencia-contra-mulher-nao-e-normal` tem `etapas: []`. O card aparece normalmente mas não é retornado em nenhum filtro de etapa. Avaliar se deve receber uma etapa padrão.

---

## Próximo passo

**Fase 4** — Critic/Reviewer faz revisão editorial, técnica, UX/UI e taxonômica → `REVISAO-MATERIAIS.md`.

Para aprovar e iniciar Fase 4: responda **"aprovado"** ou **"pode seguir"**.
