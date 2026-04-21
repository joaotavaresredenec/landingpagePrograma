---
name: registro-br-dominio-ptbr
description: Orienta o registro de domínios .com.br no Registro.br (único registrador oficial brasileiro) e o apontamento DNS para a Vercel. O Registro.br tem particularidades diferentes de registradores internacionais (GoDaddy, Namecheap). Usar no ticket T2.4 de registro de domínio ou sempre que houver mudança de apontamento DNS.
---

# Skill: Domínio .com.br no Registro.br

Guia específico para domínios brasileiros.

## Por que Registro.br especificamente

O Registro.br (NIC.br) é o **único registrador oficial** para domínios `.br`. Não é possível registrar `.com.br` em GoDaddy, Namecheap ou outros. Tentativas de "revenda" por outros serviços no final sempre passam pelo Registro.br.

## Particularidades

- **Preço baixo:** R$ 40/ano aproximadamente (custo direto, sem intermediário)
- **Pagamento apenas em BRL** via boleto, PIX ou cartão brasileiro
- **CPF ou CNPJ obrigatório** no cadastro
- **Confirmação de e-mail obrigatória** em 14 dias, senão o domínio é bloqueado
- **Painel em português**, com termos diferentes do padrão internacional

## Passo a passo — instruções para o usuário humano

Este passo exige autenticação e pagamento. O DevOps agent **não executa**; ele gera as instruções no `SETUP.md` para o usuário executar. O agente pausa e aguarda confirmação.

### 1. Criar conta no Registro.br

Acessar https://registro.br e criar uma conta com:
- CPF (pessoa física) ou CNPJ (pessoa jurídica — **preferido para organizações**)
- E-mail que será usado para todas as comunicações oficiais do domínio
- Senha forte

### 2. Buscar e registrar o domínio

- Na home, usar a busca: `programacidadaniaesustentabilidade.com.br`
- Se disponível, clicar em "Registrar"
- Escolher período (1, 3, 5 ou 10 anos). Para projeto institucional, **recomendado 3 anos** para evitar esquecimento.
- Pagar via boleto, PIX ou cartão

### 3. Confirmar o e-mail em 14 dias

O Registro.br envia um e-mail de verificação. Sem essa confirmação, o domínio é bloqueado mesmo com pagamento feito. Checar pasta de spam se não chegar.

## Apontamento DNS para a Vercel

Após o registro confirmado:

### Opção A — Usar nameservers da Vercel (recomendado)

1. No Registro.br: painel → lista de domínios → editar `programacidadaniaesustentabilidade.com.br` → "DNS" → "Usar outros servidores DNS"
2. Colocar os nameservers da Vercel:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. Salvar. Propagação em até 24h (geralmente 1-2h).
4. Na Vercel: projeto → Settings → Domains → adicionar `programacidadaniaesustentabilidade.com.br` → Vercel configura automaticamente o SSL e redireciona.

### Opção B — Manter DNS do Registro.br e apontar registros A/CNAME

Só usar se houver motivo específico para manter DNS externo. Padrão:

- Registro A: `@` → `76.76.21.21` (IP da Vercel)
- Registro CNAME: `www` → `cname.vercel-dns.com.`

Na Vercel, adicionar o domínio e aguardar validação via DNS.

## SSL/HTTPS

A Vercel emite certificado Let's Encrypt automaticamente após o domínio ser validado. Não é necessário configurar nada manualmente.

## Checklist do ticket T2.4

Este é um ticket **colaborativo humano + agente**. O fluxo é:

1. [ ] DevOps agent gera seção do SETUP.md com instruções detalhadas (esta skill)
2. [ ] Usuário humano registra o domínio no Registro.br
3. [ ] Usuário confirma o e-mail
4. [ ] Usuário configura nameservers da Vercel (ou registros A/CNAME)
5. [ ] Usuário adiciona o domínio no painel da Vercel
6. [ ] Usuário avisa o PM que está feito
7. [ ] DevOps agent valida: `curl -I https://programacidadaniaesustentabilidade.com.br` retorna 200 e certificado válido
8. [ ] Handoff em `.agents/handoffs/sprint-2/T2.4-devops.md` com prints da Vercel mostrando domínio ativo

## Alternativa temporária

Enquanto o domínio `.com.br` não estiver ativo (pode levar até 48h no pior caso), o site fica acessível em `programa-cidadania.vercel.app` — esse URL já funciona desde o primeiro deploy.
