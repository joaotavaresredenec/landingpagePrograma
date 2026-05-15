---
name: microcopy-filtros
description: Define o microcopy de interfaces de filtragem e busca — labels de chips, mensagens de estado vazio, contagens, placeholders e textos de transição. Usar quando o Copywriter estiver escrevendo qualquer texto visível na interface de filtros da biblioteca.
---

# Skill: Microcopy de filtros

## Princípio

O microcopy dos filtros é invisível quando funciona. O usuário não deve precisar ler para entender — mas quando lê, o texto deve confirmar o que ele já esperava.

## Labels de chips de filtro

### Grupo Etapa de ensino
Usar os labels curtos definidos em `config/taxonomia.ts`:
- Ed. Infantil · EF I · EF II · Ensino Médio · Ensino Superior

No tooltip/aria-label, usar o label completo:
- "Educação Infantil" · "Ensino Fundamental I (1º ao 5º ano)" · etc.

### Grupo Tema BNCC
Usar os labels de `config/taxonomia.ts`:
- Cidadania e Civismo · Multiculturalismo · Ciência e Tecnologia · Meio Ambiente · Saúde

Não usar siglas (não "C&C", não "TCT").

## Contagens

| Situação | Texto |
|---|---|
| 1 resultado | `1 material encontrado` |
| N resultados | `36 materiais encontrados` |
| 0 resultados | `Nenhum material encontrado` |

## Estado vazio

Quando filtros combinados retornam 0 resultados:

```
Nenhum material encontrado com os filtros selecionados.
Tente remover alguns filtros para ampliar a busca.
[Limpar filtros]
```

Não usar: "Ops!", "Que pena!", "Não encontramos nada" (tom informal demais para contexto institucional).

## Botão limpar filtros

- Label: `Limpar filtros`
- Só aparece quando pelo menos 1 filtro está ativo
- Não usar: "Remover todos", "Resetar", "Limpar tudo"

## Campo de busca

- Placeholder: `Buscar por título ou organização...`
- Sem botão "Buscar" — resultado instantâneo
- Aria-label: `Buscar materiais na biblioteca`

## Tabs de tipo de recurso

Formato: `[Label] (N)`
- `Planos de aula (16)` · `Guias e cartilhas (11)` · etc.
- Quando filtros ativos alteram a contagem: atualizar o número entre parênteses
- Tab "Todos" mostra total de resultados com filtros ativos

## Botões de acesso ao material

| Situação | Texto do botão |
|---|---|
| Link disponível, arquivo único | `Acessar` |
| Link disponível, caderno do aluno | `Caderno do Aluno` |
| Link pendente | `Em breve` (disabled) |

Não usar: "Download", "Baixar", "Ver material", "Clique aqui".
