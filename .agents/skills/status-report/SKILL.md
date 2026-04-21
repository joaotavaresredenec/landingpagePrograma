---
name: status-report
description: Gera relatórios de progresso do projeto em formato markdown, consolidando o estado atual das sprints, tickets concluídos, pendências e riscos. Usar quando o PM precisa dar visibilidade ao usuário humano sobre o andamento, ou quando o usuário pede explicitamente um status.
---

# Skill: Status report

Produz relatórios consolidados do projeto.

## Quando usar

- Ao final de cada sprint (combinado com `handoff-protocol` para gerar SPRINT-N-REVIEW.md)
- Quando o usuário pede "status" ou "como está o projeto"
- Antes de pausar o projeto por mais de um ciclo (para registrar estado atual)
- Após `/fix` ser executado (para consolidar o que foi corrigido)

## Formato do STATUS.md

Salvar sempre em `STATUS.md` na raiz (sobrescrever a cada atualização):

```markdown
# Status do projeto — [data atualizada]

## Resumo executivo
Uma frase sobre onde estamos: "Sprint 2 em andamento, 3 de 9 tickets concluídos, sem bloqueios."

## Progresso por sprint

### Sprint 1 — Conteúdo e forma
**Status:** [não iniciada | em andamento | concluída | aprovada]
**Tickets:** [X de Y concluídos]
- [x] T1.1 — [título]
- [x] T1.2 — [título]
- [ ] T1.3 — [título] ← em andamento

### Sprint 2 — Infra e dados
[...]

### Sprint 3 — Validação
[...]

## Riscos ativos
- [Risco identificado com impacto e mitigação proposta]

## Decisões pendentes de aprovação humana
- [Lista do que está travado aguardando decisão do usuário]

## Próximo passo
[O que acontece a seguir: "aguardando aprovação da Sprint 1 para iniciar Sprint 2"]
```

## Regras

1. **Sempre em português.** Artefatos internos do projeto são em PT-BR por decisão do usuário.
2. **Honestidade radical sobre o progresso.** Não inflar entregas nem minimizar bloqueios.
3. **Cada item concluído tem checkbox marcado.** Facilita leitura visual.
4. **Riscos vêm com mitigação.** Não basta apontar um risco; propor o que fazer.
5. **O próximo passo é sempre explícito.** O usuário nunca deve ter que adivinhar o que fazer depois de ler o status.

## Relatório verbal (quando o usuário pede status em conversa)

Se o usuário pergunta status em conversa, o PM não precisa gerar o arquivo completo. Responde em 3-5 linhas com:

1. Onde estamos (sprint atual, progresso)
2. O que foi entregue desde a última interação
3. O que está sendo feito agora
4. O que precisa de aprovação ou decisão do usuário
5. Próximo marco

Se o usuário quiser detalhes, aponta para o STATUS.md.
