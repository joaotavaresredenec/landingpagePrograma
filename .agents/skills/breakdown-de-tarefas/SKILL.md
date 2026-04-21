---
name: breakdown-de-tarefas
description: Quebra um brief de projeto em lista estruturada de tarefas com agente responsável, dependências, estimativa e critérios de aceite. Usar quando o PM agent precisa criar um PLAN.md inicial a partir do BRIEF.md, ou quando precisa detalhar uma sprint específica em tickets menores.
---

# Skill: Breakdown de tarefas

Transforma um brief em plano de execução estruturado.

## Quando usar

- Ao rodar `/kickoff`: gerar PLAN.md a partir do BRIEF.md
- Ao iniciar uma sprint: detalhar os tickets da sprint em subtarefas
- Quando o usuário pede replanejamento após feedback

## Estrutura do PLAN.md

O arquivo PLAN.md deve ter esta estrutura:

```markdown
# Plano de execução — Landing page Redenec

## Visão geral
[2-3 parágrafos resumindo o projeto e o sequenciamento de sprints]

## Sprint 1 — Conteúdo e forma
**Duração estimada:** [X ciclos de trabalho]
**Agentes:** Copywriter + UX/UI (em paralelo)
**Objetivo:** ter todo o conteúdo escrito e todos os componentes visuais implementados

### Tickets

#### T1.1 — [Título do ticket]
- **Agente:** Copywriter
- **Depende de:** nenhum
- **Critérios de aceite:**
  - [critério 1 verificável]
  - [critério 2 verificável]
- **Artefatos esperados:**
  - [arquivo ou entrega]

[...demais tickets da sprint 1]

## Sprint 2 — Infra e dados
[mesma estrutura]

## Sprint 3 — Validação
[mesma estrutura]
```

## Regras do breakdown

1. **Todo ticket tem um único agente responsável.** Se duas pessoas precisam trabalhar juntas, divida em dois tickets com dependência.
2. **Critérios de aceite são verificáveis.** "Fazer um bom hero" não é verificável. "Hero contém headline, subheadline, CTA âncora e faixa de parceiros, responsivo em 4 breakpoints" é.
3. **Dependências são explícitas.** Use IDs dos tickets (T1.1, T1.2, T2.1) para mapear o grafo de dependências.
4. **Cada ticket entrega no máximo 3 artefatos.** Se entrega mais, divida.
5. **Tickets em paralelo são marcados claramente.** Dois tickets podem ir em paralelo apenas se nenhum depende do outro.

## Tickets mínimos esperados para este projeto

### Sprint 1 (Copywriter + UX/UI)
- T1.1 Copy do hero, seção de desafios e sobre o programa (Copywriter)
- T1.2 Copy do formulário e microcopy (Copywriter)
- T1.3 Copy do FAQ/orientações práticas (Copywriter)
- T1.4 Processamento dos 6 materiais brutos em descrições de vitrine e biblioteca (Copywriter)
- T1.5 Template do e-mail de magic link (Copywriter)
- T1.6 Setup do Tailwind com tokens da marca Redenec (UX/UI)
- T1.7 Componentes primitivos: Button, Input, Select, Checkbox, Card (UX/UI)
- T1.8 Organismos: Hero, DesafiosGrid, BibliotecaPreview, Accordion, Formulario, Rodape (UX/UI)
- T1.9 Grafismos modulares (círculos + linhas) como componente reutilizável (UX/UI)
- T1.10 Página / com todas as seções montadas (UX/UI)
- T1.11 Páginas /obrigado, /materiais, /politica-de-privacidade (UX/UI)

### Sprint 2 (DevOps + Integrations)
- T2.1 Inicialização do projeto Next.js + repositório GitHub privado (DevOps)
- T2.2 Setup da Vercel com preview deploys (DevOps)
- T2.3 Ativação do Vercel KV e env vars (DevOps)
- T2.4 Registro do domínio no Registro.br e apontamento DNS (DevOps)
- T2.5 Cliente Brevo em lib/brevo.ts com createContact e sendMagicLinkEmail (Integrations)
- T2.6 Fluxo de magic link: geração, armazenamento no KV, validação (Integrations)
- T2.7 Route handler POST /api/lead (Integrations)
- T2.8 Route handler GET /api/validar-token (Integrations)
- T2.9 Tracking LGPD: atributos customizados no Brevo com timestamp, IP, user-agent (Integrations)

### Sprint 3 (QA)
- T3.1 Teste ponta-a-ponta do formulário
- T3.2 Auditoria Lighthouse em 4 páginas
- T3.3 Teste cross-browser e cross-device
- T3.4 Checklist LGPD
- T3.5 Relatório final RELATORIO-QA.md

## Output

Sempre entregue o PLAN.md em português, salvo na raiz do projeto, com tickets numerados e critérios claros.
