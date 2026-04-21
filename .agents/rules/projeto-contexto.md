# Rule: contexto do projeto Redenec

Esta rule fica sempre ativa no contexto de qualquer agente do projeto.

## Quem somos

Este workspace pertence à **Rede Nacional de Educação Cidadã (Redenec)**, uma coalizão brasileira cujo objetivo é fortalecer a cultura democrática no Brasil conectando o ecossistema de educação cidadã.

A Redenec é **parceira institucional do Ministério da Educação (MEC)** no Programa Educação para a Cidadania e Sustentabilidade, ao lado de: CNJ, CNMP, CGU, UNESCO, Undime, Consed, Associação Brasileira de Escolas Legislativas.

## O que estamos construindo

Uma **landing page de captação de leads** no domínio `programacidadaniaesustentabilidade.com.br`. O objetivo é oferecer suporte prático a técnicos de secretarias, gestores escolares e professores que precisam implementar o Programa em suas redes.

Os leads captados serão acionados posteriormente para divulgação da **Olimpíada Brasileira de Cidadania (OBC)**.

## Stack obrigatória

- Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- Deploy na Vercel
- Brevo para captação de contatos e e-mail transacional
- Vercel KV para tokens de magic link
- Figtree como fonte principal (via `next/font/google`)
- Lucide React para ícones
- GitHub privado para versionamento

## Idioma

- Código e nomes de arquivos/variáveis: **inglês**
- Interface do site, copy, e-mails, documentação interna (PLAN.md, RELATORIO-QA.md, SPRINT-*-REVIEW.md) e comunicação com o usuário humano: **português do Brasil**

## Estrutura do workspace

```
programa-cidadania/
├── BRIEF.md                      ← especificação-mãe
├── SETUP.md                      ← instruções para o usuário humano
├── .agents/                      ← rules, skills, workflows, agents.md
├── brief/                        ← guia de marca, materiais brutos
├── app/                          ← rotas Next.js
├── components/                   ← componentes React
├── lib/                          ← integrações (brevo, kv, magic-link)
├── config/                       ← dados (materiais, parceiros)
└── public/                       ← assets estáticos (logos, thumbnails)
```

## Fluxo de trabalho

1. O usuário aciona workflows via slash commands (`/kickoff`, `/sprint 1`, etc.)
2. O PM agent coordena e delega
3. Subagentes produzem artefatos em paralelo quando possível
4. Ao final de cada sprint, o PM consolida e pede aprovação humana
5. Nada avança para a sprint seguinte sem aprovação explícita

## Princípio editorial

Qualquer agente que estiver em dúvida entre duas abordagens deve escolher a **mais institucional, sóbria e colaborativa** — nunca a mais edgy, provocativa ou disruptiva. Este é um projeto de política pública educacional, não um produto de startup.
