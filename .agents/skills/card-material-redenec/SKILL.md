---
name: card-material-redenec
description: Anatomia, variantes e regras de comportamento do CardMaterial na biblioteca Redenec. Usar ao construir ou modificar o componente CardMaterial ou a página de detalhe /materiais/[slug].
---

# Skill: Card de material Redenec

## Anatomia do card (biblioteca)

```
[ícone do tipo]              [badge de tipo]
[tituloEditorial]
[descricaoCard — 2 linhas]
[organizacao]
[botão(ões) de acesso]
```

## Ícones por tipo de recurso

| tipo | ícone Lucide |
|---|---|
| planos-de-aula | FileText |
| guias-e-cartilhas | BookOpen |
| videos-e-recursos-digitais | Play |
| jogos-e-atividades | Gamepad2 |

Ícone dentro de container: `h-12 w-12 rounded-xl bg-redenec-cinza` com `text-redenec-petroleo`

## Badge de tipo

`text-micro font-bold text-redenec-petroleo bg-redenec-cinza rounded-pill px-3 py-1`  
Label vem de `TIPOS_RECURSO[material.tipo].label`

## Botões de acesso

Cada `material.links[]` vira um botão. Regras:

| link.tipo | link.rotulo | Comportamento |
|---|---|---|
| `url` | conforme rotulo (ex: "Acessar", "Caderno do Aluno") | `<a target="_blank">` com ícone ExternalLink |
| `pendente` | — | botão "Em breve" disabled |

Botão ativo: `bg-black text-white rounded-pill px-4 py-2 text-sm font-bold hover:bg-gray-800`  
Botão Em breve: `bg-gray-100 text-gray-400 rounded-pill px-4 py-2 text-sm font-bold cursor-not-allowed` + `aria-disabled="true"`

Quando há múltiplos links ativos: exibir em linha (`flex gap-2 flex-wrap`)

## Página de detalhe /materiais/[slug]

Slug = `material.id`

Seções da página:
1. **Breadcrumb**: Início → Biblioteca → [tituloEditorial]
2. **Header**: tituloEditorial + badge tipo + organizacao
3. **Tags**: etapas (chips) + temas (chips)
4. **Sinopse**: parágrafo expandido de 150–200 palavras
5. **Pontos-chave**: lista com ícone de check para cada bullet
6. **Botões de acesso**: mesmo padrão do card
7. **Observações do curador**: collapsible/accordion (opcional para MVP)

Metadata:
```typescript
export const metadata = {
  title: `${material.tituloEditorial} — Biblioteca Redenec`,
  description: material.descricaoCard,
  robots: { index: false, follow: false },
}
```

## Restrições

- Nenhum campo deve exibir `material.observacoesCurador` diretamente em texto público
- Nenhum campo deve mencionar Eixos da Matriz de Saberes
- `material.titulo` (original) não aparece no UI — usar sempre `tituloEditorial`
- `material.descricao` (original) não aparece no UI — usar sempre `descricaoCard` / `sinopse`
