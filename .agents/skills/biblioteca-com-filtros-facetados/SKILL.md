---
name: biblioteca-com-filtros-facetados
description: Padrões de UX, comportamento de filtragem facetada e estrutura de componentes para a biblioteca de materiais Redenec. Usar quando estiver construindo ou modificando a página /materiais ou seus componentes de filtro.
---

# Skill: Biblioteca com filtros facetados

## Estrutura de dados

Fonte: `config/materials.json` (36 materiais) + tipos em `types/material.ts`  
Taxonomia: `config/taxonomia.ts` — TIPOS_RECURSO, ETAPAS_ENSINO, TEMAS_BNCC, COPY_BIBLIOTECA

## Arquitetura de filtros

### Regra de facetamento

```
AND entre grupos diferentes × OR dentro do mesmo grupo
```

Exemplo: usuário seleciona [EF II, EM] + [Meio Ambiente]  
→ mostra materiais que atendem (EF II OU EM) E (Meio Ambiente)

### Grupos de filtro

1. **Tipo de recurso** — implementado como abas (tab navigation), seleção única
   - Todos | Planos de aula (N) | Guias e cartilhas (N) | Vídeos e recursos digitais (N) | Jogos e atividades (N)
   - Contagem entre parênteses reflete filtros ativos de etapa/tema

2. **Etapa de ensino** — chips multisseleção, OR dentro do grupo
   - Ed. Infantil · EF I · EF II · Ensino Médio · Ensino Superior

3. **Tema BNCC** — chips multisseleção, OR dentro do grupo
   - Cidadania e Civismo · Multiculturalismo · Ciência e Tecnologia · Meio Ambiente · Saúde

4. **Busca textual** — campo livre, client-side
   - Busca em: tituloEditorial + descricaoCard + organizacao
   - Resultado instantâneo (36 itens, sem debounce necessário)

## Comportamento dos filtros

- Filtros de etapa + tema se aplicam DENTRO da aba ativa
- "Limpar filtros" aparece apenas quando etapa ou tema estiver ativo (não para busca ou aba)
- Tab "Todos" → sem filtro de tipo
- Trocar de aba NÃO limpa filtros de etapa/tema

## Microcopy (conforme `config/taxonomia.ts` COPY_BIBLIOTECA)

| Situação | Texto |
|---|---|
| 1 resultado | `1 material encontrado` |
| N resultados | `36 materiais encontrados` |
| 0 resultados | `Nenhum material encontrado` |

Estado vazio (filtros sem resultado):
```
Nenhum material encontrado com os filtros selecionados.
Tente remover alguns filtros para ampliar a busca.
[Limpar filtros]
```

## Acessibilidade obrigatória

- `role="group"` + `aria-label` em cada grupo de chips
- `aria-pressed={active}` em cada chip/botão de filtro
- `aria-selected` nas tabs
- `role="tablist"` + `role="tab"` + `role="tabpanel"` para as abas de tipo
- Focus ring visível em todos os controles interativos: `focus-visible:ring-2 focus-visible:ring-redenec-verde`
- Campo de busca: `aria-label` definido em `copyPaginaBiblioteca.buscaAriaLabel`

## Layout responsivo

- Mobile (< 640px): filtros empilhados, grid 1 col, tabs com scroll horizontal
- Tablet (640–1024px): grid 2 cols
- Desktop (≥ 1024px): grid 3 cols

## Tokens de design

Usar exclusivamente: `redenec-verde`, `redenec-azul`, `redenec-petroleo`, `redenec-cinza`, `redenec-escuro`, `redenec-coral`  
Chip ativo: `bg-redenec-petroleo text-white`  
Chip inativo: `bg-white border border-gray-200 text-gray-600 hover:border-redenec-petroleo`  
Tab ativa: `border-b-2 border-redenec-petroleo text-redenec-petroleo font-bold`  
Tab inativa: `text-gray-500 hover:text-redenec-petroleo`
