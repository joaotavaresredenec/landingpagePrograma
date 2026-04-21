---
description: Apresenta o último artefato entregue por um agente específico, sem reexecutar nada. Uso /review copywriter, /review uxui, /review devops, /review integrations ou /review qa.
---

# Workflow: /review [agente]

Quando o usuário digita `/review copywriter`, `/review uxui`, `/review devops`, `/review integrations` ou `/review qa`, execute como **PM agent**.

## Objetivo

Permitir que o usuário revise artefatos produzidos por um agente específico sem gastar tokens reexecutando o trabalho.

## Sequência

### 1. Identificar o agente

Mapear o argumento para o agente correto:
- `copywriter` → Copywriter agent
- `uxui` ou `ui` → UX/UI agent
- `devops` → DevOps agent
- `integrations` ou `integ` → Integrations agent
- `qa` → QA agent

Se o argumento não for reconhecido, responder com a lista de opções.

### 2. Localizar artefatos

Buscar em:
- `.agents/handoffs/*/T*-[agente].md` — todos os handoffs do agente
- Pastas específicas:
  - Copywriter: `content/copy/`, `content/materials/`
  - UX/UI: `components/`
  - DevOps: arquivos de configuração (next.config.js, tailwind.config.ts, .env.local.example, package.json)
  - Integrations: `lib/`, `app/api/`
  - QA: `.agents/qa/`, `RELATORIO-QA.md`

### 3. Resumir e apresentar

Responder no chat com:

```
Revisão: [agente]

## Artefatos entregues até agora
- [lista cronológica dos handoffs, com sprint e ticket]

## Arquivos principais
- [caminhos dos arquivos-chave com descrição de uma linha]

## Decisões autônomas registradas
- [lista consolidada das decisões que o agente tomou]

## Status atual
[em andamento | concluído para a sprint atual | aguardando próxima sprint]

## Como revisar em profundidade
- Abra [arquivos específicos] para ver o trabalho completo
- Ou rode /review [agente] detalhado para um dump completo (opcional)
```

### 4. Não fazer

- **Não reexecutar o agente.** Apenas apresentar o que já foi produzido.
- **Não criar novos artefatos.** Este workflow é apenas de leitura.
- **Não despachar correções.** Se o usuário quer mudar algo, orientá-lo a usar `/fix` em seguida.

## Variação `/review sprint N`

Se o argumento for `sprint 1`, `sprint 2` ou `sprint 3`:
- Abrir `SPRINT-N-REVIEW.md`
- Apresentar resumo executivo no chat
- Apontar arquivos-chave para leitura aprofundada
