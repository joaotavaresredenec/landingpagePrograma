# Sprint Materiais — Fase 1 Review

**Data:** 2026-04-21  
**Agentes:** Data Analyst + Taxonomy (paralelo)  
**Status:** concluída — aguardando aprovação humana

---

## Resumo executivo

A Fase 1 entregou o dataset completo e a taxonomia controlada para a biblioteca. Os 36 materiais aprovados foram parseados da planilha, classificados e normalizados. O schema TypeScript compila sem erros. Nenhuma referência a Eixos da Matriz de Saberes nos artefatos.

---

## Artefatos entregues

| Arquivo | Descrição |
|---|---|
| `types/material.ts` | Schema TypeScript com todos os tipos exportados |
| `config/materials.json` | 36 materiais com dados da planilha |
| `config/taxonomia.ts` | Constantes de tipos, etapas, temas e regras de facetamento |

---

## Dados do dataset (config/materials.json)

| Item | Valor |
|---|---|
| Total de materiais | **36** |
| "Incluir" | 28 |
| "Incluir com ajustes" | 8 |
| TypeScript: erros de compilação | 0 |

**Por tipo de recurso:**

| Tipo | Label | Qtd |
|---|---|---|
| `planos-de-aula` | Planos de aula | 16 |
| `guias-e-cartilhas` | Guias e cartilhas | 10 |
| `videos-e-recursos-digitais` | Vídeos e recursos digitais | 6 |
| `jogos-e-atividades` | Jogos e atividades | 3 |
| `projetos-escolares` | Projetos escolares | 1 |

**Links:**
- 30 materiais com URL ativa (Google Drive ou link externo)
- 6 materiais com algum link `pendente` (botão "Em breve"):
  - 6 cadernos do professor dos Roteiros Pedagógicos (cols 5–10) — só o link do aluno disponível
  - Nenhum material completamente sem link

---

## Decisões autônomas

1. **Reclassificação de "Outro":**
   - Col 15 "Linhas do tempo" (website interativo, Fundação FHC) → `videos-e-recursos-digitais`
   - Col 16 "Infográficos" (infográfico digital, Fundação FHC) → `videos-e-recursos-digitais`

2. **Cadernos com dois arquivos (cols 5–10):** dois objetos `MaterialLink` por material — `Caderno do Aluno` com URL ativa e `Caderno do Professor` com `tipo: 'pendente'`. Não duplicou cards.

3. **Slugs:** gerados a partir do título normalizado (sem acentos, lowercase, hífens). Todos únicos.

4. **Campos editoriais vazios:** `tituloEditorial`, `descricaoCard`, `sinopse`, `pontosChave` deixados em branco para preenchimento pelo Copywriter na Fase 2.

5. **`observacoesCurador`** preservado integralmente no JSON — insumo direto para o Copywriter.

---

## O que precisa de sua atenção

### Para revisão (não bloqueante)

- **Links dos cadernos do professor** (6 Roteiros Pedagógicos): se você tiver os links dos cadernos do professor, pode compartilhá-los para completar os botões antes da Fase 3. Caso contrário, os botões ficam como "Em breve" no lançamento.

- **"Projetos escolares" tem apenas 1 material** (Futuro Ancestral na Escola). A categoria vai aparecer com `(1)` na aba. Se preferir, posso agregá-lo em "Guias e cartilhas".

---

## Próximo passo

**Fase 2** — Copywriter produz conteúdo editorial dos 36 materiais e textos da seção.

Para aprovar e iniciar Fase 2: responda **"aprovado"** ou **"pode seguir"**.
