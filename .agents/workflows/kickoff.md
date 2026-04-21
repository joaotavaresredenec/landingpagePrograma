---
description: Inicia o projeto lendo o BRIEF.md e gerando o PLAN.md com todas as sprints e tickets detalhados
---

# Workflow: /kickoff

Quando o usuário digita `/kickoff` no Agent Manager do Antigravity, execute esta sequência como **PM agent**.

## Pré-condições

- Arquivo `BRIEF.md` existe na raiz do workspace
- Arquivo `brief/Manual_de_Marca_-_Redenec.pdf` existe em `/brief/`
- Pasta `brief/materiais-redenec/` pode estar vazia ou conter materiais (tudo bem se vazia no kickoff — esses materiais chegam ao longo da Sprint 1)
- Nenhum `PLAN.md` aprovado existe ainda (se existir, perguntar ao usuário antes de sobrescrever)

## Sequência

### 1. Ler todo o contexto do projeto

- `BRIEF.md` na íntegra
- `.agents/agents.md` para conhecer a equipe
- `.agents/rules/projeto-contexto.md` e `.agents/rules/tom-institucional.md`

### 2. Aplicar a skill `breakdown-de-tarefas`

Gerar um `PLAN.md` completo na raiz do projeto com:
- Visão geral (3-4 parágrafos)
- Sprint 1 (Conteúdo e forma) com todos os tickets detalhados
- Sprint 2 (Infra e dados) com todos os tickets detalhados
- Sprint 3 (Validação) com todos os tickets detalhados

### 3. Aplicar a skill `status-report`

Gerar um `STATUS.md` inicial marcando o projeto como "aguardando aprovação do plano".

### 4. Apresentar ao usuário

Responder no chat com:

```
Plano gerado. Antes de seguir, revise os arquivos:

- PLAN.md — plano completo com todas as sprints e tickets
- STATUS.md — status inicial do projeto

Resumo:
- Sprint 1 (Copywriter + UX/UI em paralelo): X tickets, estimativa [N] ciclos
- Sprint 2 (DevOps + Integrations em paralelo): Y tickets, estimativa [M] ciclos
- Sprint 3 (QA sequencial): Z tickets, estimativa [K] ciclos

Decisões que preciso confirmar antes de iniciar a Sprint 1:
- [listar decisões que dependem do usuário, como: qual e-mail vai ser o contato LGPD, se o Brevo e GitHub já estão criados, etc.]

Para aprovar e iniciar a Sprint 1: responda "aprovado" ou rode `/sprint 1`
Para ajustar: descreva as mudanças e eu atualizo o PLAN.md
```

### 5. Pausar

Aguardar input humano. **Não iniciar nenhuma sprint automaticamente.**

## Cuidados

- **Nunca prosseguir sem aprovação explícita.** O usuário tem autonomia sobre cada fase crítica.
- Se o BRIEF.md estiver ausente ou incompleto, perguntar ao usuário antes de gerar PLAN.md baseado em suposições.
- Se o usuário pedir ajustes no plano, gerar novo PLAN.md e apresentar novamente (não editar in-place sem avisar).
