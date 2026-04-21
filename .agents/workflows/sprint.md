---
description: Executa uma sprint do PLAN.md, coordenando subagentes em paralelo quando possível. Uso /sprint 1, /sprint 2 ou /sprint 3.
---

# Workflow: /sprint N

Quando o usuário digita `/sprint 1`, `/sprint 2` ou `/sprint 3`, execute como **PM agent** a orquestração da sprint especificada.

## Pré-condições

- `PLAN.md` existe e está aprovado
- Sprints anteriores foram aprovadas pelo usuário (exceto na primeira execução)
- `SPRINT-(N-1)-REVIEW.md` existe com marca "aprovado" se N > 1

## Sequência

### 1. Carregar contexto

- Ler a seção correspondente à sprint N no `PLAN.md`
- Identificar todos os tickets e suas dependências
- Identificar os agentes envolvidos

### 2. Determinar paralelização

Baseado nas dependências dos tickets, identificar quais podem rodar simultaneamente.

**Sprint 1:** Copywriter e UX/UI trabalham em paralelo. Tickets de copy e tickets de componentes são independentes.

**Sprint 2:** DevOps e Integrations trabalham em paralelo. DevOps precisa terminar T2.1 (setup do projeto) antes de Integrations poder começar, mas T2.4 (domínio) e os tickets de Integrations são paralelos a T2.2/T2.3.

**Sprint 3:** QA roda sequencialmente (testes seguem ordem fixa).

### 3. Despachar subagentes

Para cada subagente envolvido, iniciar uma conversa dedicada dando:
- Contexto do projeto (rules sempre ativas serão carregadas automaticamente)
- Tickets da sprint atribuídos a esse agente
- Localização onde salvar artefatos
- Formato esperado do handoff (skill `handoff-protocol`)
- Prazo sugerido (opcional)

Quando dois subagentes trabalham em paralelo, o Antigravity permite **spawnar múltiplas instâncias simultâneas via Agent Manager**. Cada instância é independente e escreve seus artefatos em pastas separadas:
- Copywriter → `content/copy/` e `content/materials/`
- UX/UI → `components/`
- DevOps → raiz do projeto + `.env.local.example`
- Integrations → `lib/` e `app/api/`
- QA → `.agents/qa/`

### 4. Monitorar progresso

O PM acompanha via leitura periódica de:
- Arquivos em `.agents/handoffs/sprint-N/`
- Status de cada instância de subagente no Agent Manager

Se um subagente reportar bloqueio, o PM decide entre:
- Redistribuir a tarefa para outro agente
- Escalar para o usuário humano
- Criar ticket de workaround temporário

### 5. Validar entregas

Conforme subagentes concluem tickets:
- Aplicar a skill `handoff-protocol` → validação
- Se aprovado: mover handoff para `.agents/handoffs/sprint-N/aprovados/`
- Se reprovado: devolver ao subagente com feedback específico

### 6. Consolidar ao final

Quando todos os tickets da sprint foram concluídos e validados:
- Aplicar a skill `status-report` → gerar `SPRINT-N-REVIEW.md`
- Atualizar `STATUS.md`
- Fazer commit no git com mensagem descritiva

### 7. Pausar para aprovação humana

Responder no chat:

```
Sprint N concluída. Artefatos consolidados em SPRINT-N-REVIEW.md.

Highlights:
- [2-3 pontos principais da entrega]

Decisões que tomei autonomamente (para sua ciência):
- [lista curta]

Pendências carregadas para a próxima sprint:
- [se houver]

Para aprovar e iniciar Sprint (N+1): responda "aprovado" ou rode /sprint (N+1)
Para ajustar algo: descreva e eu redireciono para o agente responsável
Para ver detalhes: abra SPRINT-N-REVIEW.md
```

Pausar e aguardar.

## Cuidados

- **Nunca iniciar a sprint seguinte automaticamente.** Aprovação humana é obrigatória entre sprints.
- **Não aceitar entregas incompletas.** Se um ticket da sprint está com critérios de aceite não atendidos, reportar transparentemente — não marcar como concluído "para avançar".
- **Se paralelização criar conflitos** (ex: dois agentes editando o mesmo arquivo), serializar e reportar ao usuário.
