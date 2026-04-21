---
name: lgpd-consent-tracking
description: Implementa registro auditável de consentimento LGPD em cada captação de lead, armazenando timestamp, IP, user-agent e texto exato do termo aceito. Esta skill é usada em conjunto com brevo-magic-link-integration para garantir que a Redenec tenha prova de consentimento em caso de solicitação de revisão ou exclusão pelo titular dos dados. Usar ao implementar o POST /api/lead ou quando houver mudança no texto de consentimento.
---

# Skill: Tracking de consentimento LGPD

Garante conformidade com a Lei Geral de Proteção de Dados.

## Por que importa

A LGPD (Lei 13.709/2018) exige que o controlador dos dados tenha:
1. **Base legal clara** para o tratamento (no nosso caso, consentimento — Art. 7º, I)
2. **Registro de quando e como o consentimento foi dado** (auditabilidade)
3. **Facilidade para revogação** (titular pode revogar a qualquer momento)
4. **Finalidade específica e informada** (não coletar dados para "uso futuro genérico")

## O que armazenar no consentimento

Para cada lead captado, registrar no Brevo (como atributos customizados do contato):

| Campo | Conteúdo | Exemplo |
|---|---|---|
| `LGPD_CONSENTIMENTO` | Booleano confirmando aceite | `true` |
| `LGPD_TIMESTAMP` | ISO 8601 UTC | `2026-04-21T15:32:10.123Z` |
| `LGPD_IP` | IP do usuário (primeiro da X-Forwarded-For) | `201.89.12.34` |
| `LGPD_USER_AGENT` | User-agent do navegador | `Mozilla/5.0...` |
| `LGPD_VERSAO_TERMO` | Versão do texto aceito | `1.0` |
| `FONTE` | Origem do lead (útil para múltiplas landings futuras) | `landing_programa_cidadania` |

## Versionamento do texto de consentimento

O texto exato do checkbox deve ser versionado. Quando mudar, incrementar a versão.

Criar `config/lgpd.ts`:

```typescript
export const TERMO_CONSENTIMENTO = {
  versao: '1.0',
  texto: 'Concordo com a política de privacidade e autorizo o uso dos meus dados para recebimento de informações sobre o Programa e iniciativas relacionadas.',
  dataVersao: '2026-04-21',
}
```

O componente Checkbox lê essa constante. O endpoint `/api/lead` também lê e armazena a versão.

## Implementação no endpoint

No route handler `/api/lead` (já descrito na skill `brevo-magic-link-integration`), captura automática:

```typescript
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
const userAgent = req.headers.get('user-agent') || 'unknown'
const timestamp = new Date().toISOString()
```

Essas três informações são o "carimbo digital" do consentimento. No Brevo, ficam associadas ao contato.

## Rejeição de cadastro sem consentimento

Se `consentimentoLgpd: false` ou ausente no payload, o endpoint deve retornar 400 imediatamente:

```typescript
if (!payload.consentimentoLgpd) {
  return NextResponse.json(
    { erro: 'Consentimento LGPD obrigatório para prosseguir' },
    { status: 400 }
  )
}
```

O frontend também valida antes de submeter (o botão fica desabilitado enquanto o checkbox não estiver marcado), mas a validação server-side é a fonte de verdade.

## Revogação (direito do titular)

Conforme LGPD, o titular pode revogar o consentimento a qualquer momento. Implementação mínima:

1. **E-mail de contato** para solicitações — incluir na política de privacidade um e-mail específico ou genérico da Redenec
2. **Processo manual por enquanto:** ao receber solicitação, removeover o contato no Brevo (via painel ou API)
3. **Evolução futura:** endpoint `/api/lgpd/revogar?token=X` onde o próprio usuário pode revogar (fora do escopo desta primeira versão)

No footer do e-mail transacional, incluir:

> Você recebeu este e-mail porque se cadastrou em nosso site para acessar materiais do Programa. Para parar de receber comunicações ou solicitar exclusão dos seus dados, envie um e-mail para [contato LGPD].

## Política de privacidade — estrutura mínima

A página `/politica-de-privacidade` deve conter:

1. **Controlador dos dados:** Rede Nacional de Educação Cidadã (Redenec), com contato
2. **Dados coletados:** lista exata dos campos do formulário
3. **Finalidade:** envio dos materiais + comunicações sobre o Programa e iniciativas relacionadas (incluindo OBC)
4. **Base legal:** consentimento (Art. 7º, I da LGPD)
5. **Compartilhamento:** se os dados são ou não compartilhados (e com quem, se forem)
6. **Retenção:** por quanto tempo os dados ficam armazenados
7. **Direitos do titular:** visualizar, corrigir, excluir, portar, revogar consentimento
8. **Contato para solicitações:** e-mail específico LGPD
9. **Data de última atualização** da política

## Checklist de conformidade

- [ ] Checkbox LGPD é obrigatório no formulário
- [ ] Texto do checkbox é claro e específico sobre a finalidade
- [ ] Link para política de privacidade está visível no formulário e no rodapé
- [ ] IP, user-agent, timestamp e versão do termo são registrados no Brevo
- [ ] Política de privacidade tem todos os 9 elementos acima
- [ ] E-mail de contato para LGPD está disponível
- [ ] Dados coletados são estritamente os necessários (não perguntar telefone se não vai usar)
