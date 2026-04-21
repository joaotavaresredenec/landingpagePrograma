# PLAN — Landing page do Programa Educação para a Cidadania e Sustentabilidade

**Versão:** 1.0 — gerado em 2026-04-21  
**Status:** aguardando aprovação humana

---

## Visão geral

Este plano descreve a construção completa da landing page de captação de leads da Redenec no domínio `cidadaniaesustentabilidade.com.br`. O produto é uma aplicação Next.js 14+ com App Router, TypeScript e Tailwind CSS, deployed na Vercel, integrando Brevo (CRM e e-mail transacional) e Vercel KV (magic link / Redis).

O objetivo central é captar leads qualificados — técnicos de secretarias, gestores escolares, professores e estudantes — oferecendo acesso imediato a materiais práticos de implementação do Programa. Esses leads serão posteriormente acionados para a Olimpíada Brasileira de Cidadania (OBC) e outras iniciativas da Redenec.

O projeto está organizado em três sprints. A Sprint 1 é a mais densa e envolve trabalho paralelo do Copywriter e do UX/UI; a Sprint 2 cobre infraestrutura e integrações (DevOps e Integrations em paralelo); a Sprint 3 é sequencial e valida o produto completo antes do deploy em produção.

Nenhuma sprint inicia sem aprovação explícita do usuário humano ao final da sprint anterior.

---

## Sprint 1 — Conteúdo e forma

**Objetivo:** produzir todos os textos do site e todos os componentes visuais.  
**Agentes:** Copywriter e UX/UI em paralelo.  
**Estimativa:** 2 ciclos de trabalho.

---

### SP1-01 · Copy — Hero e faixa de parceiros

**Agente:** Copywriter  
**Entregáveis:**
- Headline, subheadline e label do CTA primário
- Texto alternativo para logo de cada parceiro (MEC, Redenec, CNJ, CNMP, CGU, UNESCO, Undime, Consed)

**Critérios de aceite:**
- Headline: "Sua rede aderiu ao Programa. E agora?" (conforme BRIEF, não alterar)
- Subheadline: até 30 palavras, tom institucional e empático
- CTA: "Quero acesso aos materiais" (não alterar)
- Alt texts: descritivos, sem adjetivos de marketing

---

### SP1-02 · Copy — Seção de desafios (4 cards)

**Agente:** Copywriter  
**Entregáveis:**
- Título da seção
- 4 cards: título (até 8 palavras) + corpo (2-3 linhas) para cada desafio:
  1. Indicar e orientar o ponto focal
  2. Elaborar um plano de ação eficaz
  3. Encontrar materiais prontos para sala de aula
  4. Monitorar a execução na rede

**Critérios de aceite:**
- Nenhum card pode soar como crítica institucional
- Tom empático com o gestor: reconhece complexidade, propõe apoio

---

### SP1-03 · Copy — Biblioteca de materiais (6 cards de prévia)

**Agente:** Copywriter  
**Entregáveis:**
- Título da seção
- 6 cards: título editorial + descrição (2 linhas) para cada item:
  1. Guia do Ponto Focal
  2. Modelo de Plano de Ação
  3. Trilhas Pedagógicas
  4. Recursos Didáticos
  5. Jogos e Dinâmicas
  6. Banco de Boas Práticas

**Critérios de aceite:**
- Descrições claras, sem jargão técnico
- Tom de serviço público, não de produto

---

### SP1-04 · Copy — Orientações práticas (6 itens do accordion)

**Agente:** Copywriter  
**Entregáveis:**
- Título da seção ("O que fazer depois da adesão")
- 6 textos completos para o accordion:
  1. Passo a passo pós-adesão
  2. Como elaborar o plano de ação
  3. Como escolher o ponto focal
  4. Como monitorar a execução
  5. Integração com a BNCC
  6. Perguntas frequentes

**Critérios de aceite:**
- Cada item: entre 80 e 200 palavras
- Linguagem acessível para gestor não-especialista
- Checklist de tom-institucional aprovado

---

### SP1-05 · Copy — Sobre o Programa e rodapé

**Agente:** Copywriter  
**Entregáveis:**
- Síntese institucional do Programa (3-4 linhas)
- Microcopy do rodapé: contato MEC, links Redenec, texto LGPD discreto, tagline OBC
- Microcopy do formulário: labels, placeholders, mensagem de validação, texto do checkbox LGPD
- Textos das páginas `/obrigado` e `/politica-de-privacidade`
- Microcopy de erros do formulário

**Critérios de aceite:**
- Política de privacidade alinhada à LGPD (coleta mínima, finalidade declarada, canal de contato)
- `/obrigado` instrui o usuário a checar o e-mail de forma clara

---

### SP1-06 · Copy — E-mail transacional (magic link)

**Agente:** Copywriter  
**Entregáveis:**
- Assunto do e-mail (até 60 caracteres)
- Pré-cabeçalho (até 100 caracteres)
- Corpo em HTML (estrutura para template Brevo): saudação, instrução, botão CTA com magic link, aviso de expiração (30 dias), assinatura Redenec

**Critérios de aceite:**
- Tom institucional, sem urgência artificial
- Botão CTA com texto claro ("Acessar meus materiais" ou similar)
- Aviso de expiração presente e claro

---

### SP1-07 · UX/UI — Tokens de design e tema Tailwind

**Agente:** UX/UI  
**Entregáveis:**
- `tailwind.config.ts` com tema customizado: paleta da Redenec, tipografia Figtree, espaçamentos base
- `app/globals.css` com CSS custom properties derivadas do manual de marca
- Documento interno `design-tokens.md` mapeando cores, tipografia e breakpoints do manual para tokens Tailwind

**Critérios de aceite:**
- Paleta e tipografia extraídas do `brief/Manual_de_Marca_-_Redenec.pdf`
- Sem cores, fontes ou tamanhos fora do manual de marca

---

### SP1-08 · UX/UI — Componentes primitivos

**Agente:** UX/UI  
**Entregáveis:**
- `components/ui/Button.tsx` — variantes: primary, secondary, ghost
- `components/ui/Card.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Accordion.tsx` (acessível, navegável por teclado)
- `components/ui/Select.tsx` (acessível, ARIA)
- `components/ui/Input.tsx`
- `components/ui/Checkbox.tsx`

**Critérios de aceite:**
- WCAG AA: contraste 4.5:1, foco visível, ARIA labels
- Props tipadas em TypeScript
- Sem lógica de negócio nos primitivos

---

### SP1-09 · UX/UI — Componentes de seção (organismos)

**Agente:** UX/UI  
**Entregáveis:**
- `components/sections/Hero.tsx` — com grafismos modulares (círculos + linhas SVG)
- `components/sections/ChallengeCards.tsx` — grid 2×2 responsivo
- `components/sections/MaterialsGrid.tsx` — grid 3×2 (desktop) / 1 col (mobile)
- `components/sections/Accordion.tsx` (instância da seção Orientações)
- `components/sections/About.tsx`
- `components/sections/LeadForm.tsx` — formulário com todos os 6 campos + checkbox LGPD
- `components/sections/Footer.tsx`

**Critérios de aceite:**
- Mobile-first com breakpoints sm/md/lg/xl
- LeadForm ainda sem integração real (só estrutura e validação client-side)
- Grafismos do Hero baseados no manual de marca

---

### SP1-10 · UX/UI — Páginas e layout

**Agente:** UX/UI  
**Entregáveis:**
- `app/layout.tsx` — fonte Figtree, metadata base, ThemeProvider se necessário
- `app/page.tsx` — compõe todas as seções na ordem do BRIEF
- `app/obrigado/page.tsx`
- `app/materiais/page.tsx` — estrutura da biblioteca com skeleton (lógica de token vem na Sprint 2)
- `app/politica-de-privacidade/page.tsx`

**Critérios de aceite:**
- Estrutura de rota correta para Next.js App Router
- SEO: `<title>` e `<meta description>` em cada página
- Open Graph básico na página principal

---

## Sprint 2 — Infra e dados

**Objetivo:** configurar toda a infraestrutura de deploy e implementar as integrações de backend.  
**Agentes:** DevOps e Integrations em paralelo.  
**Estimativa:** 2 ciclos de trabalho.

---

### SP2-01 · DevOps — Inicialização do projeto Next.js

**Agente:** DevOps  
**Entregáveis:**
- Repositório GitHub privado criado e inicializado
- `package.json` com todas as dependências da stack obrigatória
- `tsconfig.json`, `.eslintrc.json`, `.prettierrc`, `.gitignore`
- Estrutura de pastas conforme `projeto-contexto.md`
- `SETUP.md` v1 com instruções para criar contas Brevo, GitHub e Vercel

**Critérios de aceite:**
- `npm run dev` funciona sem erros
- Branch `main` protegida (require PR)
- Nenhuma secret hardcoded no repositório

---

### SP2-02 · DevOps — Deploy na Vercel e variáveis de ambiente

**Agente:** DevOps  
**Entregáveis:**
- Projeto conectado ao Vercel via GitHub
- Preview deploys ativos para todas as branches
- `.env.example` com todas as variáveis necessárias (sem valores reais)
- `SETUP.md` atualizado com instruções para preencher as env vars no painel Vercel

**Critérios de aceite:**
- Deploy de preview funciona ao abrir PR
- Variáveis de ambiente: `BREVO_API_KEY`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `NEXT_PUBLIC_BASE_URL`, `CONTACT_EMAIL_LGPD`
- Nenhum segredo exposto no repositório

---

### SP2-03 · DevOps — Vercel KV e domínio

**Agente:** DevOps  
**Entregáveis:**
- Vercel KV ativado e conectado ao projeto
- Instruções para configuração de DNS no Registro.br: `A record` ou `CNAME` apontando para Vercel
- `SETUP.md` atualizado com passo-a-passo para o usuário configurar o DNS

**Critérios de aceite:**
- `SETUP.md` cobre todo o passo-a-passo de DNS com screenshots ou links da documentação Vercel
- O registro KV está disponível como variável de ambiente no projeto

---

### SP2-04 · Integrations — Cliente Brevo

**Agente:** Integrations  
**Entregáveis:**
- `lib/brevo.ts` — funções:
  - `createOrUpdateContact(data)`: cria ou atualiza contato com atributos (nome, perfil, UF, município, etapa, consentimento LGPD com timestamp/IP/user-agent)
  - `sendTransactionalEmail(to, magicLink)`: dispara o template de e-mail do magic link

**Critérios de aceite:**
- Usa Brevo API v3 (não SDK desatualizado)
- Atributos customizados pensados para segmentação OBC: `PERFIL`, `UF`, `MUNICIPIO`, `ETAPA_ENSINO`, `LGPD_CONSENT`, `LGPD_TIMESTAMP`, `LGPD_IP`
- Sem secrets hardcoded; usa `process.env.BREVO_API_KEY`

---

### SP2-05 · Integrations — Magic link e Vercel KV

**Agente:** Integrations  
**Entregáveis:**
- `lib/magic-link.ts`:
  - `generateToken()`: gera token criptograficamente seguro (crypto.randomBytes)
  - `storeToken(token, email)`: salva no Vercel KV com TTL de 30 dias
  - `validateToken(token)`: retorna email associado ou null
- `lib/kv.ts`: cliente KV configurado via env vars

**Critérios de aceite:**
- Token: 32 bytes, hex-encoded (64 caracteres)
- TTL: 2592000 segundos (30 dias exatos)
- `validateToken` retorna `null` para tokens expirados ou inexistentes (nunca lança exceção)

---

### SP2-06 · Integrations — Route handlers

**Agente:** Integrations  
**Entregáveis:**
- `app/api/lead/route.ts` — `POST /api/lead`:
  1. Valida campos obrigatórios e checkbox LGPD
  2. Chama `createOrUpdateContact` no Brevo
  3. Chama `generateToken` e `storeToken`
  4. Chama `sendTransactionalEmail`
  5. Retorna `{ success: true }` ou erros estruturados
- `app/api/validar-token/route.ts` — `GET /api/validar-token?token=X`:
  1. Chama `validateToken`
  2. Retorna `{ valid: true, email }` ou `{ valid: false }`

**Critérios de aceite:**
- Rate limiting básico (não implementar redis-rate-limit completo, mas rejeitar requests sem campos obrigatórios)
- Nunca expor o email do usuário em URL pública
- Resposta de erro não vaza detalhes internos (stack trace, nome de variável, etc.)

---

### SP2-07 · Integrations — Página /materiais com validação de token

**Agente:** Integrations  
**Entregáveis:**
- `app/materiais/page.tsx` atualizado: lê `?token=` do URL, chama `/api/validar-token`, redireciona para `/#formulario` se inválido, exibe biblioteca se válido
- `config/materials.ts`: array de objetos `{ id, title, summary, keyPoints, thumbnailSrc, driveUrl }`

**Critérios de aceite:**
- Redirecionamento server-side (não client-side) para token inválido
- Grid de materiais usa os cards do UX/UI (SP1-09)
- `config/materials.ts` populado com os 6 materiais da biblioteca (dados provisórios até o Copywriter processar os PDFs)

---

### SP2-08 · Integrations — Conectar formulário ao backend

**Agente:** Integrations  
**Entregáveis:**
- `LeadForm.tsx` atualizado: ao submeter, chama `POST /api/lead`, trata loading/erro/sucesso, redireciona para `/obrigado` em caso de sucesso

**Critérios de aceite:**
- Estado de loading visível (botão desabilitado + spinner)
- Mensagem de erro amigável (sem texto técnico exposto ao usuário)
- Redirecionamento para `/obrigado` após sucesso

---

## Sprint 3 — Validação

**Objetivo:** garantir que o produto está completo, acessível, performático e em conformidade com a LGPD antes do deploy em produção.  
**Agente:** QA (sequencial — depende das entregas das Sprints 1 e 2).  
**Estimativa:** 1 ciclo de trabalho.

---

### SP3-01 · QA — Teste ponta-a-ponta do fluxo do formulário

**Agente:** QA  
**Entregáveis:**
- Script de teste manual documentado em `RELATORIO-QA.md`:
  1. Preenchimento completo do formulário
  2. Verificação de criação do contato no Brevo
  3. Recebimento do e-mail com magic link
  4. Acesso à `/materiais?token=TOKEN`
  5. Teste com token expirado (redireciona para `/#formulario`?)
  6. Teste com token ausente

**Critérios de aceite:**
- Fluxo completo em menos de 5 segundos (do submit à chegada do e-mail)
- Todos os 6 cenários documentados com status Pass/Fail

---

### SP3-02 · QA — Responsividade

**Agente:** QA  
**Entregáveis:**
- Capturas de tela (ou descrição detalhada) em 320px, 768px, 1024px e 1440px
- Lista de pendências de layout (bloqueantes ou não)

**Critérios de aceite:**
- Nenhum overflow horizontal em nenhum breakpoint
- Formulário utilizável em 320px (teclado virtual não cobre campos)
- Faixa de logos dos parceiros legível em mobile

---

### SP3-03 · QA — Lighthouse e performance

**Agente:** QA  
**Entregáveis:**
- Relatório Lighthouse completo no `RELATORIO-QA.md`
- Lista de otimizações aplicadas (se scores abaixo do alvo)

**Critérios de aceite:**
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO ≥ 95

---

### SP3-04 · QA — Conformidade LGPD

**Agente:** QA  
**Entregáveis:**
- Checklist LGPD no `RELATORIO-QA.md`:
  - Checkbox obrigatório (formulário não submete sem marcar)
  - Política de privacidade acessível e com link visível
  - Dados mínimos coletados (sem campos desnecessários)
  - Consentimento registrado com timestamp, IP e user-agent no Brevo
  - Canal de contato para direito de exclusão documentado

**Critérios de aceite:**
- Zero pendências bloqueantes de LGPD antes do deploy

---

### SP3-05 · QA — Compatibilidade cross-browser e SEO on-page

**Agente:** QA  
**Entregáveis:**
- Resultado de testes em Chrome, Firefox e Safari (desktop + mobile)
- Checklist SEO: title único por página, meta description, Open Graph, favicon, robots.txt

**Critérios de aceite:**
- Sem regressões visuais entre navegadores
- Nenhum erro de console em produção (0 warnings de React em strict mode)
- Open Graph válido (testado via ferramenta de debug do Facebook ou similar)

---

### SP3-06 · QA — Relatório final e aprovação de deploy

**Agente:** QA  
**Entregáveis:**
- `RELATORIO-QA.md` completo com:
  - Sumário executivo (pass/fail por área)
  - Lista de pendências bloqueantes (impedem deploy)
  - Lista de pendências não-bloqueantes (podem ir para próxima versão)
  - Recomendação: **deploy aprovado** ou **bloqueado até correção de X**

**Critérios de aceite:**
- Zero pendências bloqueantes para aprovação de deploy em produção
- Usuário humano revisa e aprova o relatório antes do deploy final

---

## Dependências entre sprints

```
Sprint 1 (Copywriter + UX/UI) ──────┐
                                     ├──► Sprint 2 (DevOps + Integrations) ──► Sprint 3 (QA)
                                     │
                         (SP1-09 LeadForm structure necessária para SP2-08)
                         (SP1-10 páginas necessárias para SP2-07 token logic)
```

---

## Decisões abertas (a confirmar antes da Sprint 1)

1. **E-mail de contato LGPD:** `contato@redenec.org` ✓ confirmado
2. **Template de e-mail Brevo:** painel do Brevo (não API dinâmica) ✓ confirmado
3. **Conta Brevo:** existe, associada a `joao.tavares@redenec.org`. `BREVO_API_KEY` a ser fornecida em breve ✓ confirmado
4. **Repositório GitHub:** DevOps cria do zero ✓ confirmado
5. **Vercel:** conta criada e conectada ao GitHub ✓ confirmado
6. **Domínio:** pedido solicitado e pendente no Registro.br. Domínio alterado para `cidadaniaesustentabilidade.com.br` (limite de caracteres) ✓ confirmado
7. **Materiais brutos:** chegam depois da Sprint 1 — biblioteca de prévia usa dados provisórios ✓ confirmado
8. **Logos dos parceiros:** disponíveis em `/logos/`. Logos presentes: Redenec, UNESCO, Undime. **Logos ainda ausentes: MEC, CNJ, CNMP, CGU, Consed** — necessário obter antes de finalizar o Hero (SP1-07 / SP1-10)
