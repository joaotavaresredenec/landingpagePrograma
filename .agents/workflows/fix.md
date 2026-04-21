---
description: Cria e despacha um ticket de correção para o agente responsável, baseado em uma descrição livre do problema. Uso /fix [descrição do problema em linguagem natural].
---

# Workflow: /fix [descrição]

Quando o usuário digita `/fix seguido de uma descrição em linguagem natural`, execute como **PM agent**.

## Exemplos de uso

- `/fix o CTA do hero está pouco destacado no mobile`
- `/fix a cor de fundo da seção de desafios está cinza em vez de branca`
- `/fix o e-mail de magic link não está chegando quando o perfil é "estudante"`
- `/fix o link "política de privacidade" no rodapé está quebrado`

## Sequência

### 1. Interpretar o problema

Analisar a descrição e identificar:
- **Natureza do problema:** visual? textual? funcional? de infra? de integração?
- **Agente responsável:**
  - Visual/layout/mobile → UX/UI
  - Texto/copy/tom → Copywriter
  - Build/deploy/env/domínio → DevOps
  - Brevo/magic link/API → Integrations
  - Se ambíguo, perguntar ao usuário antes de prosseguir

### 2. Criar ticket de correção

Salvar em `.agents/fixes/FIX-[timestamp]-[slug].md`:

```markdown
# Ticket de correção: [título curto]

**Criado em:** [timestamp ISO]
**Reportado por:** usuário humano via /fix
**Agente designado:** [nome]
**Severidade:** [bloqueador | alto | médio | baixo]
**Relacionado a:** [ticket original, se identificado]

## Descrição do problema
[descrição do usuário, literalmente]

## Interpretação do PM
[1-2 parágrafos traduzindo o problema para termos técnicos]

## Critérios de aceite da correção
- [critério 1 verificável]
- [critério 2]

## Artefatos provavelmente impactados
- [arquivos que o agente deve revisar]

## Instruções para o agente
[orientações específicas se houver]
```

### 3. Despachar

Iniciar conversa com o agente designado no Agent Manager, apontando para o ticket de correção e pedindo:
- Leitura do ticket
- Investigação do problema
- Aplicação da correção
- Handoff usando o formato padrão em `.agents/fixes/aprovados/`

### 4. Responder ao usuário

```
Ticket de correção criado: FIX-[timestamp]-[slug]
Designado para: [agente]
Severidade: [nível]

Investigação iniciada. Devolvo quando houver artefato para sua revisão.
```

### 5. Acompanhar e apresentar

Quando o agente terminar a correção:
- Validar o handoff
- Apresentar ao usuário com antes/depois (ou descrição do fix + arquivos alterados)
- Perguntar se o fix está aprovado

## Cuidados

- **Fixes não param a sprint atual.** Se uma sprint está em andamento, o fix vira parte da próxima revisão do agente ou entra em paralelo, dependendo da severidade.
- **Fixes bloqueadores (impedem deploy)** pausam tudo e têm prioridade máxima.
- **Fixes cosméticos** podem ser agrupados em batch antes de serem aplicados, para economizar ciclos.
