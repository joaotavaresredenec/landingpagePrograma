---
name: sinopses-curadas-materiais
description: Produz títulos editoriais, descrições de card, sinopses expandidas e pontos-chave para materiais pedagógicos da biblioteca Redenec, usando as observações do curador como insumo principal. Aplicar sempre que o Copywriter estiver escrevendo conteúdo para um card ou página de detalhe de material.
---

# Skill: Sinopses curadas de materiais

## Princípio

Cada material da biblioteca é uma porta de entrada para um educador ocupado. O texto precisa responder em 2 segundos: "é para mim? vale abrir?". Sem marketing, sem promessas vagas.

## Insumo obrigatório

Antes de escrever qualquer campo, leia:
1. `observacoesCurador` do material — é a análise do especialista que avaliou o recurso. É o insumo mais rico.
2. `descricao` — descrição original enviada pela organização.
3. `tipo`, `etapas`, `temas` — contexto de uso.

## Campos a produzir

### 1. tituloEditorial (máx 80 chars)

Pode diferir do título original. Critérios:
- Compreensível fora de contexto (sem "Vol. 3" solto)
- Não começa com "O", "A", "Os", "As" (dificulta escaneamento em lista)
- Não usa aspas nem sublinhado
- Para coleções com volumes: incluir o tema do volume, não o número

Exemplos:
- ❌ `Coleção Corações e Mentes - Vol. 1: "Pensando de forma autônoma fora e dentro da internet"`
- ✅ `Pensando de forma autônoma: internet e democracia`

- ❌ `Roteiros Pedagógicos - "Direito à Educação"`
- ✅ `Roteiro Pedagógico: Direito à Educação`

### 2. descricaoCard (máx 180 chars, ~2 linhas)

Fórmula: **[O que é]** + **[para quem / para quê]**

Estrutura recomendada:
```
[Tipo de material] com [conteúdo central]. Indicado para [perfil/etapa] que [objetivo prático].
```

Exemplos:
- ✅ `Guia com roteiro de 6 aulas sobre direito à educação. Indicado para professores do Ensino Médio que trabalham com participação cidadã.`
- ✅ `Jogo de cartas que estimula reflexão sobre identidade e representatividade. Adequado para EF II e Ensino Médio.`
- ❌ `Material incrível que vai transformar sua sala de aula com atividades inovadoras sobre cidadania.`

### 3. sinopse (150–200 palavras)

Para a página de detalhe `/materiais/[slug]`. Tom de serviço público, como uma resenha técnica feita por colega experiente.

Estrutura:
1. **Abertura** (1 frase): situa o recurso no contexto do Programa
2. **O que é** (2-3 frases): descreve o conteúdo sem jargão
3. **Como usar** (2-3 frases): para qual etapa, perfil, momento de uso
4. **Destaque** (1-2 frases): o que o distingue — baseado nas observações do curador
5. **Chamada** (1 frase): convite simples ao acesso

Não citar Eixos da Matriz de Saberes. Não usar superlativos.

### 4. pontosChave (3–5 bullets)

O que o educador vai encontrar ou conseguir fazer com o material.
- Começa com verbo no infinitivo: "Aplicar", "Desenvolver", "Adaptar", "Identificar"
- Máx 12 palavras por bullet
- Concretos, não genéricos

Exemplos:
- ✅ `Aplicar sequência de 3 aulas sobre direitos indígenas com roteiro completo`
- ✅ `Adaptar atividades para EF II e Ensino Médio com orientações diferenciadas`
- ❌ `Trabalhar temas importantes de cidadania de forma inovadora`

## Materiais "Incluir com ajustes"

Para os 8 materiais marcados como `recomendacao: 'incluir-com-ajustes'`, atenção extra:
- Leia as `observacoesCurador` com mais cuidado — geralmente indicam o que precisa de ajuste editorial
- O título e a descrição do card devem destacar o que o material tem de útil, sem prometer o que ele não entrega
- Se a limitação for relevante para o usuário, mencione de forma neutra: "Atividade focada no contexto brasileiro de 2022"

## Checklist por material

- [ ] tituloEditorial único (não repete outro título da biblioteca)
- [ ] descricaoCard dentro de 180 chars
- [ ] sinopse entre 150 e 200 palavras
- [ ] 3 a 5 pontosChave começando com verbo no infinitivo
- [ ] Nenhuma referência a Eixos da Matriz de Saberes
- [ ] Tom de serviço público (não de infoproduto)
