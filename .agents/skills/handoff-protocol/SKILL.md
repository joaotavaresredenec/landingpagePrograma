---
name: handoff-protocol
description: Define o formato obrigatório de entrega entre subagentes e o PM, incluindo estrutura do arquivo de handoff, localização, e como o PM deve validar cada artefato recebido. Usar sempre que um subagente concluir um ticket, ou quando o PM for consolidar múltiplos handoffs ao final de uma sprint.
---

# Skill: Protocolo de handoff

Padroniza a comunicação entre subagentes e o PM.

## Princípio

Subagentes nunca conversam entre si. Toda entrega é feita ao PM em formato padronizado. O PM valida, consolida e, se necessário, redistribui.

## Formato obrigatório do handoff

Cada subagente, ao concluir um ticket, cria um arquivo em `.agents/handoffs/sprint-N/` com o nome no padrão `T[id]-[agente].md`:

```
.agents/handoffs/sprint-1/T1.1-copywriter.md
.agents/handoffs/sprint-1/T1.6-uxui.md
```

Conteúdo do arquivo:

```markdown
# Handoff: [agente] → PM

**Ticket:** [T1.1]
**Sprint:** [1]
**Status:** [concluído | bloqueado | parcial]
**Data:** [YYYY-MM-DD]

## Resumo em uma frase
[O que foi feito, em uma única frase]

## Artefatos entregues
- `path/para/arquivo1.ext` — [o que é]
- `path/para/arquivo2.ext` — [o que é]

## Decisões tomadas autonomamente
- [Decisão 1 que fugiu do brief literal, com justificativa]
- [Decisão 2]

## Desvios do brief
- [Se algo foi feito diferente do briefado, explicar por quê]

## Dependências ou bloqueios
- [Se o ticket está bloqueado ou tem dependência não resolvida]

## Checklist de critérios de aceite
- [x] Critério 1 do PLAN.md
- [x] Critério 2
- [ ] Critério 3 — pendente porque [motivo]

## Próximo passo sugerido
- [O que o PM deve fazer com este artefato]
```

## Validação pelo PM

Ao receber um handoff, o PM executa o seguinte checklist antes de aceitar:

1. **Critérios de aceite:** todos marcados? Se não, o ticket retorna com tag "revisão necessária"
2. **Artefatos existem:** os arquivos citados estão de fato no filesystem?
3. **Decisões autônomas são razoáveis:** alguma decisão tomada pelo subagente contraria explicitamente o BRIEF ou uma rule? Se sim, retornar para correção.
4. **Tom institucional respeitado:** se for artefato textual (copy, copy de e-mail, FAQ), aplicar o checklist da rule `tom-institucional.md`

Se aprovado, o PM move ou renomeia o arquivo para `.agents/handoffs/sprint-N/aprovados/` e inclui uma linha de confirmação no próprio arquivo:

```markdown
---
**Validação PM:** aprovado em [data]
```

## Consolidação em SPRINT-N-REVIEW.md

Ao final de cada sprint, o PM gera um arquivo consolidado na raiz do projeto: `SPRINT-1-REVIEW.md`, `SPRINT-2-REVIEW.md`, etc.

Formato:

```markdown
# Review Sprint 1 — Conteúdo e forma

## Resumo executivo
[3-5 linhas: o que foi entregue, highlights, riscos identificados]

## Entregas
### Copywriter
- [lista dos tickets concluídos, com links para os handoffs]

### UX/UI
- [idem]

## Decisões que precisam de aprovação humana
- [Lista de decisões autônomas significativas que o PM quer chancelar explicitamente antes de seguir]

## Pendências carregadas para a próxima sprint
- [Se alguma coisa ficou inacabada]

## Próximo passo
Aguardando aprovação do usuário para iniciar Sprint 2.

Para aprovar: responda com "aprovado"
Para ajustar: descreva os ajustes necessários
```

O PM então pausa e aguarda input humano.
