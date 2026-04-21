---
name: e2e-form-testing
description: Executa teste ponta-a-ponta do fluxo completo de captação de leads, desde o preenchimento do formulário até o acesso à biblioteca de materiais via magic link. Inclui casos de sucesso, casos de erro e casos de borda (token expirado, dados inválidos, Brevo offline). Usar na Sprint 3 para validar o fluxo antes do deploy de produção, ou sempre que houver mudança no endpoint /api/lead.
---

# Skill: Teste E2E do formulário

Protocolo de teste do fluxo completo de captação.

## Cenários obrigatórios

### Cenário 1 — Fluxo feliz

**Pré-condições:**
- Site rodando em preview deploy na Vercel
- Brevo configurado com template e lista
- E-mail de teste do QA acessível

**Passos:**
1. Acessar a landing page
2. Clicar em qualquer CTA ("Quero acesso aos materiais")
3. Verificar scroll até o formulário
4. Preencher todos os campos:
   - Nome: "Teste QA"
   - E-mail: e-mail real do testador
   - Perfil: Técnico de secretaria
   - UF: selecionar qualquer
   - Município: digitar qualquer
   - Etapa: Todas
5. Marcar checkbox LGPD
6. Clicar em "Quero acesso aos materiais e orientações"
7. Observar redirecionamento para `/obrigado`
8. Verificar recebimento do e-mail em até 2 minutos
9. Clicar no magic link do e-mail
10. Verificar acesso à página `/materiais` com biblioteca visível

**Resultado esperado:** fluxo completo sem erros, biblioteca acessível no final.

### Cenário 2 — Campos obrigatórios

Tentar submeter com:
- Apenas nome e e-mail (sem perfil) → formulário não submete, mensagem de erro visível
- Sem e-mail → erro visível
- Sem checkbox LGPD → botão de submit desabilitado ou erro ao tentar

**Resultado esperado:** validação client-side impede submit; server retorna 400 se request manual bypass.

### Cenário 3 — E-mail inválido

Submeter com `email: "naovaleemail"`.

**Resultado esperado:** validação impede submit com mensagem "E-mail inválido".

### Cenário 4 — Token inválido

Acessar `/materiais?token=tokenfalso12345`.

**Resultado esperado:** redirecionamento para `/?erro=token_invalido#formulario` com mensagem de erro opcional.

### Cenário 5 — Token expirado

Para testar, inserir manualmente um token expirado no Vercel KV (ou aguardar 30 dias — impraticável, então simular reduzindo TTL em ambiente de teste para 10 segundos).

**Resultado esperado:** mesma resposta de token inválido.

### Cenário 6 — Sem token

Acessar `/materiais` diretamente.

**Resultado esperado:** redirecionamento para `/#formulario`.

### Cenário 7 — Segundo cadastro com mesmo e-mail

Cadastrar mesmo e-mail duas vezes.

**Resultado esperado:** atualização do contato existente no Brevo (`updateEnabled: true`), novo token gerado, novo e-mail disparado. Primeiro token continua válido até expirar.

### Cenário 8 — Brevo indisponível

Simular falha no Brevo (desligar temporariamente a API key ou mockar erro 500).

**Resultado esperado:** frontend exibe mensagem de erro amigável ("Erro ao processar. Tente novamente em alguns minutos."). Nada é salvo no KV (transação atômica).

### Cenário 9 — Responsividade

Repetir Cenário 1 em:
- 320px (mobile pequeno — iPhone SE)
- 768px (tablet)
- 1024px (desktop médio)
- 1440px (desktop grande)

**Resultado esperado:** formulário usável em todos os tamanhos, sem quebras de layout, texto legível sem zoom manual.

### Cenário 10 — Acessibilidade do formulário

Usar apenas teclado:
1. `Tab` do topo da página até o formulário
2. Preencher todos os campos usando apenas teclado
3. Marcar checkbox com `Space`
4. Submeter com `Enter` no botão

**Resultado esperado:** fluxo completo sem mouse, foco sempre visível, tab order lógico.

## Ferramentas

### Para testes manuais
- Navegador em modo anônimo (sem cache de sessão anterior)
- Cliente SMTP temporário se necessário (temp-mail.org, mailinator.com)
- DevTools → Network (para verificar requests)
- DevTools → Console (para capturar erros JS)

### Para testes automatizados (opcional, recomendado para CI futuro)
- Playwright: `npm install --save-dev @playwright/test`
- Suite básica em `tests/e2e/formulario.spec.ts`

## Relatório de teste

Gerar `RELATORIO-QA.md` com:

```markdown
# Relatório QA — Sprint 3

**Data:** [data]
**Ambiente:** [preview URL]
**Testador:** QA agent

## Resumo
- Total de cenários: 10
- Passaram: X
- Falharam: Y
- Bloqueadores: Z

## Resultados por cenário

### Cenário 1 — Fluxo feliz
**Status:** ✅ passou
**Tempo total:** 1min 42s
**Observações:** [se houver]
**Screenshots:** [links para screenshots em .agents/qa/screenshots/]

### Cenário 2 — Campos obrigatórios
**Status:** ❌ falhou
**Problema:** [descrição]
**Severidade:** [bloqueador | alto | médio | baixo]
**Artefato relacionado:** [ticket original]

[...]

## Pendências bloqueadoras (impedem deploy de produção)
- [lista]

## Pendências não-bloqueadoras (podem ser ajustadas pós-deploy)
- [lista]

## Recomendação
[✅ aprovar para produção | ⚠️ aprovar com ressalvas | ❌ não aprovar]
```
