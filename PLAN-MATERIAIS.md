# PLAN-MATERIAIS — Sprint Materiais v1

**Gerado em:** 2026-04-21  
**PM agent:** Claude (orquestrador)  
**Status:** aguardando aprovação humana

---

## Sumário executivo

A Sprint Materiais v1 substitui os 6 cards genéricos da seção "Biblioteca" por uma biblioteca filtrável real, construída a partir de 36 materiais aprovados na planilha de curadoria. A organização principal é por **Tipo de Recurso** (5 categorias), com filtros secundários por **Etapa de ensino** e **Tema BNCC**.

### O que encontrei na planilha

| Item | Dado |
|---|---|
| Total avaliados | 42 materiais |
| **Incluir** | 28 |
| **Incluir com ajustes** | 8 |
| **Não incluir** | 6 |
| **Total para o site** | **36** |

**Distribuição por tipo de recurso:**

| Tipo (planilha) | Qtd | Proposta de rótulo editorial |
|---|---|---|
| Planos de aula e sequências didáticas | 16 | "Planos de aula" |
| Cartilhas, guias ou manuais pedagógicos | 10 | "Guias e cartilhas" |
| Vídeos educativos, podcasts ou objetos digitais | 4 | "Vídeos e recursos digitais" |
| Jogos e materiais lúdicos | 3 | "Jogos e atividades" |
| Outro | 2 | a definir — ver perguntas |
| Projetos escolares e experiências | 1 | "Projetos escolares" ← agrupar em "Guias e cartilhas"? |

**Temas BNCC presentes (filtro principal):**
- Cidadania e Civismo
- Multiculturalismo
- Ciência e Tecnologia
- Meio Ambiente
- Saúde

**Etapas de ensino (filtro secundário):**
- Ensino Médio · Ensino Fundamental II · Ensino Fundamental I · Ensino Superior · Educação Infantil

**Situação dos links (crítico para hospedagem):**

| Tipo | Qtd | Situação |
|---|---|---|
| PDF (nome de arquivo local) | ~31 | ⚠️ arquivos não estão em `brief/materiais-redenec/` — ver pergunta 1 |
| URL externa (http) | 5 | precisa validação HEAD |
| Nome sem URL (playlist, biblioteca) | ~6 | ⚠️ URL desconhecida — ver pergunta 7 |

---

## Perguntas obrigatórias antes de iniciar

Antes de qualquer execução, preciso de resposta para estas perguntas:

### Bloqueantes para Fase 1

**P1 — PDFs fisicamente onde?**  
A planilha referencia ~31 PDFs por nome de arquivo (ex: `Coracoes_e_Mentes_Vol1.pdf`), mas a pasta `brief/materiais-redenec/` está vazia. Os arquivos existem localmente em outro lugar? Preciso saber antes de desenhar o fluxo de hospedagem.

**P2 — Hospedagem: Vercel Blob ou Google Drive?**  
Para PDFs hospedados por nós, duas opções:
- **Vercel Blob** (recomendado): URLs permanentes, integrado ao projeto, requer plano Vercel Pro (~$20/mês) ou verificar se o plano atual já inclui
- **Google Drive** (fallback): compartilhamento público, URLs funcionam mas menos elegantes; sem custo adicional  
Qual aprovo?

### Bloqueantes para Fase 2

**P3 — Confirmar exclusão dos 6 "Não incluir"?**  
Os 6 materiais excluídos são: "Compartilhando Direitos", "Formação Docente em Educação Midiática", "Os custos ocultos da IA generativa", "Kit retorno às aulas pós-pandemia", "Guia de Bolso Acolhimento humanizado" e "Curadoria de materiais". Confirmo exclusão sem revisão adicional?

**P4 — Links incompletos (6 materiais)?**  
Estes materiais têm apenas nomes no campo de link, sem URL real:
- Col 16: "Infográficos" (Fundação FHC)
- Col 27: "Biblioteca EducaMídia"
- Col 31: "Direitos e Cidadania" (cadernos do professor)
- Col 38: Playlists YouTube (formação para profissionais e adolescentes)
- Col 41: "Justiça Climática" (Futuro Ancestral)
- Col 42: Playlist "Semente do Amanhã"

Você tem as URLs desses materiais? Posso seguir em frente com `driveUrl: '#'` e botão "Em breve"?

**P5 — Materiais com múltiplos arquivos?**  
Vários materiais (Roteiros Pedagógicos, cols 5–13) têm dois PDFs: "caderno do aluno" + "caderno do professor". Como exibir? Sugestões:
- **A** — Card único com dois botões de download (aluno / professor)
- **B** — Card único com download do professor como principal (aluno como link secundário)
- **C** — Dois cards separados por material

### Decisões editoriais

**P6 — Rótulos de categoria aprovados?**  
Propostas de editorialização dos tipos:
- "Planos de aula" (era: "Planos de aula e sequências didáticas")
- "Guias e cartilhas" (era: "Cartilhas, guias ou manuais pedagógicos")
- "Vídeos e recursos digitais" (era: "Vídeos educativos, podcasts ou objetos digitais de aprendizagem")
- "Jogos e atividades" (era: "Jogos e materiais lúdicos")
- "Projetos escolares" (era: "Projetos escolares e experiências de gestão democrática") — 1 material, pode ser agrupado em outra categoria se parecer pouco

Os 2 materiais "Outro" (cols 19 e 30): são um podcast (Chega Junto Juventudes) e um caderno metodológico. Proposta: reclassificar um para "Vídeos e recursos digitais" e outro para "Guias e cartilhas". Confirma?

**P7 — Transição: fallback ou substituição direta?**  
Durante a sprint, mantendo os 6 cards genéricos como fallback (só substitui quando a nova seção estiver aprovada) ou substituo direto?

---

## Fase 1 — Dados e estrutura (paralela)

**Dependência:** respostas a P1, P3, P6 antes de iniciar.  
**Resultado esperado:** `config/materials.json`, `config/taxonomia.ts`, `types/material.ts`  
**Revisão humana obrigatória ao final.**

---

### T1.1 · Data Analyst — Parsear planilha e gerar dataset JSON

**Agente:** Data Analyst  
**Arquivos de saída:**
- `types/material.ts` — schema TypeScript
- `config/materials.json` — 36 materiais aprovados

**Schema proposto:**

```typescript
// types/material.ts
export type Material = {
  id: string                    // slug gerado do título
  titulo: string                // título original da planilha
  tituloEditorial: string       // gerado pelo Copywriter na Fase 2
  organizacao: string
  descricao: string             // descrição geral da planilha
  descricaoCard: string         // gerado pelo Copywriter na Fase 2 (máx 180 chars)
  sinopse: string               // gerado pelo Copywriter na Fase 2 (150-200 palavras)
  pontosChave: string[]         // gerado pelo Copywriter na Fase 2 (3-5 bullets)
  tipo: TipoRecurso             // categoria principal
  formato: string               // formato do recurso
  etapas: EtapaEnsino[]        // multivalorado
  temas: TemaBNCC[]             // multivalorado
  licenca: string
  links: MaterialLink[]         // pode ter múltiplos arquivos
  recomendacao: 'incluir' | 'incluir-com-ajustes'
  observacoesCurador: string    // linha 27, insumo para o Copywriter
}

export type MaterialLink = {
  rotulo: string                // ex: "Caderno do Professor", "Caderno do Aluno", "Acessar"
  url: string                   // '#' se ainda sem URL
  tipo: 'pdf' | 'url' | 'pendente'
}

export type TipoRecurso = 
  | 'planos-de-aula'
  | 'guias-e-cartilhas'
  | 'videos-e-recursos-digitais'
  | 'jogos-e-atividades'
  | 'projetos-escolares'

export type EtapaEnsino =
  | 'educacao-infantil'
  | 'ensino-fundamental-i'
  | 'ensino-fundamental-ii'
  | 'ensino-medio'
  | 'ensino-superior'

export type TemaBNCC =
  | 'cidadania-e-civismo'
  | 'multiculturalismo'
  | 'ciencia-e-tecnologia'
  | 'meio-ambiente'
  | 'saude'
```

**Regras do Data Analyst:**
- Ignorar completamente linha 13 da planilha (Eixos da Matriz de Saberes) — não incluir no schema nem no JSON
- Excluir os 6 "Não incluir"
- Para campos de texto dos cards/sinopses: deixar vazio string `""` (Copywriter preenche na Fase 2)
- Para links: montar array de `MaterialLink` com `tipo: 'pendente'` e `url: '#'` para PDFs sem URL confirmada
- Gerar `id` como slug do título (lowercase, sem acentos, hífens)
- Normalizar etapas e temas conforme taxonomia definida em T1.2

**Critérios de aceite:**
- 36 materiais no JSON (28 + 8)
- Zero referências a Eixos da Matriz de Saberes
- Schema TypeScript compilando sem erros
- Todos os `id` únicos

---

### T1.2 · Taxonomy agent — Definir taxonomia e vocabulário controlado

**Agente:** Taxonomy  
**Arquivos de saída:**
- `config/taxonomia.ts` — constantes, labels e regras de facetamento

**Responsabilidades:**
- Definir os 5 tipos de recurso como constantes com labels exibíveis
- Normalizar variações de etapa de ensino encontradas na planilha (ex: "EM", "Ensino Médio", "Médio" → `ensino-medio`)
- Extrair os Temas Contemporâneos Transversais da BNCC, ignorar fragmentos em parênteses
- Definir regras de facetamento: filtros combinados usam AND (ex: "EM" AND "Meio Ambiente" mostra apenas materiais que atendem ambos)
- Definir label para estado "sem resultados"

**Config esperada:**

```typescript
// config/taxonomia.ts
export const TIPOS_RECURSO = {
  'planos-de-aula': { label: 'Planos de aula', plural: 'Planos de aula' },
  'guias-e-cartilhas': { label: 'Guias e cartilhas', plural: 'Guias e cartilhas' },
  'videos-e-recursos-digitais': { label: 'Vídeos e recursos digitais', plural: 'Vídeos e recursos digitais' },
  'jogos-e-atividades': { label: 'Jogos e atividades', plural: 'Jogos e atividades' },
  'projetos-escolares': { label: 'Projetos escolares', plural: 'Projetos escolares' },
} as const

export const ETAPAS_ENSINO = {
  'educacao-infantil': { label: 'Ed. Infantil', labelCompleto: 'Educação Infantil' },
  'ensino-fundamental-i': { label: 'EF I', labelCompleto: 'Ensino Fundamental I' },
  'ensino-fundamental-ii': { label: 'EF II', labelCompleto: 'Ensino Fundamental II' },
  'ensino-medio': { label: 'Ensino Médio', labelCompleto: 'Ensino Médio' },
  'ensino-superior': { label: 'Ensino Superior', labelCompleto: 'Ensino Superior' },
} as const

export const TEMAS_BNCC = {
  'cidadania-e-civismo': { label: 'Cidadania e Civismo' },
  'multiculturalismo': { label: 'Multiculturalismo' },
  'ciencia-e-tecnologia': { label: 'Ciência e Tecnologia' },
  'meio-ambiente': { label: 'Meio Ambiente' },
  'saude': { label: 'Saúde' },
} as const

// Regra de facetamento: AND entre grupos diferentes, OR dentro do mesmo grupo
// Ex: (EM ou EF II) AND (Meio Ambiente ou Saúde)
export const FACETING_RULE = 'AND_between_groups_OR_within_group'
```

**Critérios de aceite:**
- Zero referências a Eixos da Matriz de Saberes
- Todos os valores de etapa e tema cobrem 100% dos materiais aprovados
- Labels curtos (para chip de filtro) e completos (para acessibilidade)
- Regra de facetamento documentada

---

## Fase 2 — Conteúdo e hospedagem (paralela)

**Dependência:** aprovação humana da Fase 1.  
**Dependência adicional de T2.2:** resposta a P1 e P2 (PDFs e hospedagem).  
**Resultado esperado:** conteúdo editorial de todos os materiais + URLs resolvidas  
**Revisão humana obrigatória ao final.**

---

### T2.1 · Copywriter — Produzir conteúdo editorial de todos os 36 materiais

**Agente:** Copywriter  
**Skills adicionadas:** `sinopses-curadas-materiais`, `microcopy-filtros`  
**Arquivos de saída:**
- `content/materials/[slug].md` — um arquivo por material
- Atualização de `config/materials.json` com campos preenchidos
- `config/copy.ts` atualizado — texto introdutório da seção Biblioteca

**Por material, produzir:**
1. **Título editorial** — pode diferir do original; máx 80 chars; deve ser compreensível fora de contexto
2. **Descrição do card** — 2 linhas, máx 180 chars; o que é + para quem / para quê
3. **Sinopse expandida** — 150-200 palavras; para modal ou página de detalhe; tom de serviço público
4. **3-5 pontos-chave** — bullets; o que o educador vai encontrar/conseguir fazer
5. **Prioridade adicional para "Incluir com ajustes"** — revisão textual mais cuidadosa nos 8 materiais

**Texto introdutório da seção (para `config/copy.ts`):**
- 2-3 parágrafos
- Explicar que a biblioteca foi curada pela Redenec
- Mencionar parceria com o MEC
- Mencionar aderência aos princípios do Programa
- **Não citar Eixos da Matriz nem competências específicas**
- Não mencionar "36 materiais" (número pode mudar)

**Insumo principal:** linha 27 da planilha (observações do curador) para cada material.  
**Tom:** `.agents/rules/tom-institucional.md` e skill `tom-institucional-redenec`.

**Critérios de aceite:**
- 36 materiais com todos os campos preenchidos
- Nenhum texto faz referência a Eixos da Matriz de Saberes
- Títulos editoriais únicos (sem repetição)
- Checklist de tom institucional aprovado em cada material

---

### T2.2 · Content Hosting — Resolver URLs e hospedar PDFs

**Agente:** Content Hosting  
**Dependência:** resposta humana a P1 (onde estão os PDFs) e P2 (Vercel Blob ou Google Drive)  
**Arquivo de saída:** `config/materials.json` com `links[].url` preenchidas

**Por material:**
1. **PDF local** → fazer upload para hospedagem aprovada (Vercel Blob ou Drive), registrar URL permanente
2. **URL externa** → validar com HEAD request; se 200, usar; se falha, registrar como `tipo: 'pendente'`
3. **Link incompleto** (nome sem URL) → registrar `url: '#'` e `tipo: 'pendente'`; listar para revisão humana

**Relatório de saída obrigatório:**
- Lista de PDFs hospedados com URL nova
- Lista de URLs externas validadas (status 200)
- Lista de materiais com `tipo: 'pendente'` que precisam de URL do usuário

**Critérios de aceite:**
- Todo material com link resolvido tem `tipo: 'pdf' | 'url'` (não `'pendente'`)
- PDFs hospedados têm URLs permanentes (não temporárias)
- Nenhuma URL 404 no JSON final

---

## Fase 3 — Interface (UX/UI)

**Dependência:** aprovação humana da Fase 2.  
**Agente:** UX/UI  
**Skills adicionadas:** `biblioteca-com-filtros-facetados`, `card-material-redenec`  
**Resultado esperado:** seção substituída, funcionando com dados reais  
**Revisão humana obrigatória ao final.**

---

### T3.1 · Substituir seção Biblioteca na home

Substituir a seção atual (6 cards genéricos) pelo componente `BibliotecaMateriais`:
- Texto introdutório (de `config/copy.ts`)
- Abas ou âncoras por tipo de recurso (navegação entre as 5 categorias)
- Grid de `CardMaterial` componíveis com os dados reais

### T3.2 · Componente `FiltroFacetado`

Chips clicáveis agrupados:
- **Etapa:** Educação Infantil · EF I · EF II · Ensino Médio · Ensino Superior
- **Tema:** Cidadania e Civismo · Multiculturalismo · Ciência e Tecnologia · Meio Ambiente · Saúde
- Comportamento: AND entre grupos, OR dentro do mesmo grupo (conforme `FACETING_RULE`)
- Botão "Limpar filtros" quando algum filtro estiver ativo
- Contagem dinâmica: "X materiais encontrados"

### T3.3 · Componente `CardMaterial`

```
[ícone do tipo]  [tag de etapa(s)]
[Título editorial]
[Descrição do card — 2 linhas]
[Organização autora]
[Botão "Acessar" → link do material]
```

- Se `tipo: 'pendente'`: botão "Em breve" (disabled, sem link)
- Sem tag de Eixo em lugar nenhum
- WCAG AA obrigatório

### T3.4 · Página `/materiais/[slug]`

Rota dinâmica para cada material:
- Título editorial, organização, etapas e temas como tags
- Sinopse expandida
- Pontos-chave (lista)
- Botão(ões) de acesso ao(s) arquivo(s)
- Breadcrumb: Início → Biblioteca → [título]
- `metadata` com title, description e og:title únicos por material
- `robots: { index: false }` (conteúdo só para leads cadastrados)

### T3.5 · Busca textual client-side

Campo de busca sobre os 36 materiais:
- Busca em título + descrição do card + organização
- Resultado instantâneo (sem debounce necessário — são só 36 itens)
- Estado vazio com mensagem amigável e sugestão de limpar filtros

### T3.6 · Navegação por tipo (abas ou âncoras)

Tabs ou âncoras entre as 5 categorias:
- Tab ativa destacada com cor da marca
- Contagem de materiais por categoria entre parênteses: "Planos de aula (16)"
- Mobile: scroll horizontal nas tabs

### T3.7 · Contagem e estado vazio

- "X materiais encontrados" atualizado dinamicamente
- Quando combinação de filtros não retornar resultados: mensagem + botão "Limpar filtros"

**Critérios de aceite:**
- Zero referências a Eixos da Matriz no código ou no HTML renderizado
- WCAG AA: contraste ≥ 4.5:1 em todos os textos, foco visível, ARIA em filtros
- Mobile-first em 320px, 768px, 1024px, 1440px
- Todos os tokens de cor e tipografia do `guia-de-marca-redenec/SKILL.md`

---

## Fase 4 — Revisão crítica (Critic/Reviewer)

**Dependência:** aprovação humana da Fase 3.  
**Agente:** Critic/Reviewer  
**Arquivo de saída:** `REVISAO-MATERIAIS.md`  
**Revisão humana + aprovação de deploy ao final.**

---

### T4.1 · Revisão editorial
- Tom institucional em cada sinopse e descrição
- Ausência total de referências a Eixos da Matriz de Saberes
- Qualidade e unicidade dos títulos editoriais
- Texto introdutório da seção está correto e sem riscos institucionais

### T4.2 · Revisão técnica
- Links funcionais (nenhum 404 nas URLs resolvidas)
- Schema JSON consistente (zero campos obrigatórios vazios nos 36 materiais)
- Sem materiais duplicados (mesmo id)
- Build Next.js sem erros de TypeScript

### T4.3 · Revisão UX/UI
- Contraste WCAG em todos os componentes novos
- Responsividade em 4 breakpoints
- Filtros navegáveis por teclado
- Estados de hover/focus/active visíveis

### T4.4 · Revisão taxonômica
- 100% dos materiais corretamente classificados por tipo
- Filtros de etapa e tema retornam resultados coerentes
- Vocabulário normalizado (sem variações soltas)

### T4.5 · Gerar `REVISAO-MATERIAIS.md`
Categorias de severidade:
- 🔴 **Bloqueador** — impede deploy
- 🟠 **Alto** — corrigir antes do deploy (não impede tecnicamente, mas é risco)
- 🟡 **Médio** — próxima iteração
- ⚪ **Baixo** — backlog

### T4.6 · Loop de correção
Para cada item 🔴 ou 🟠:
1. Ticket de correção despachado ao agente responsável
2. Correção aplicada
3. Revisão parcial do item corrigido
4. Repetir até zero 🔴/🟠

**Critérios de aprovação de deploy:**
- Zero itens 🔴
- Zero itens 🟠
- `REVISAO-MATERIAIS.md` com status "Deploy aprovado"
- Aprovação explícita do usuário humano

---

## Novas skills a criar

Durante a execução, o PM criará os seguintes arquivos de skill antes de despachar os agentes que os utilizam:

| Skill | Agente | Fase |
|---|---|---|
| `.agents/skills/sinopses-curadas-materiais/SKILL.md` | Copywriter | Fase 2 |
| `.agents/skills/microcopy-filtros/SKILL.md` | Copywriter | Fase 2 |
| `.agents/skills/biblioteca-com-filtros-facetados/SKILL.md` | UX/UI | Fase 3 |
| `.agents/skills/card-material-redenec/SKILL.md` | UX/UI | Fase 3 |

---

## Dependências entre fases

```
Fase 1 (T1.1 Data Analyst ‖ T1.2 Taxonomy)
         ↓ [aprovação humana]
Fase 2 (T2.1 Copywriter ‖ T2.2 Content Hosting)
         ↓ [aprovação humana]
Fase 3 (T3.1 → T3.2 → T3.3 → T3.4 → T3.5 → T3.6 → T3.7 em sequência ou paralelo conforme dependências)
         ↓ [aprovação humana]
Fase 4 (T4.1 → T4.2 → T4.3 → T4.4 → T4.5 → T4.6 loop)
         ↓ [aprovação humana final]
         Deploy
```

Dentro de cada fase paralela (1 e 2): tickets rodam em paralelo sem espera entre si.

---

## Riscos identificados

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| PDFs não disponíveis localmente | Alta | Alto | Perguntar P1 antes de iniciar |
| Vercel Blob requer plano pago | Média | Médio | Fallback Google Drive (P2) |
| 6 materiais com URLs incompletas | Certa | Baixo | Botão "Em breve" como placeholder |
| "Incluir com ajustes" sem especificação dos ajustes | Média | Médio | Copywriter usa obs. do curador como guia |
| Build quebra pela mudança de schema | Baixa | Alto | Manter `config/materials.ts` original até nova versão aprovada |

---

*Aguardando aprovação humana para iniciar Fase 1.*
