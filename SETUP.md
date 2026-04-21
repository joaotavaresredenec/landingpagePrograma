# SETUP — Configuração do ambiente

Este arquivo descreve os passos que precisam ser executados manualmente antes do primeiro deploy em produção.

---

## 1. Instalar dependências localmente

```bash
npm install
```

---

## 2. Configurar o Brevo

Acesse app.brevo.com com a conta joao.tavares@redenec.org.

### 2a. Criar atributos customizados de contato

Em **Contacts → Settings → Contact attributes**, criar os seguintes atributos (se ainda não existirem):

| Atributo | Tipo |
|---|---|
| NOME | Texto |
| PERFIL | Texto |
| UF | Texto |
| MUNICIPIO | Texto |
| ETAPA_ENSINO | Texto |
| LGPD_CONSENTIMENTO | Booleano |
| LGPD_TIMESTAMP | Texto |
| LGPD_IP | Texto |
| LGPD_USER_AGENT | Texto |
| LGPD_VERSAO_TERMO | Texto |
| FONTE | Texto |

### 2b. Criar lista de contatos

Em **Contacts → Lists**, criar uma lista chamada **"Programa Cidadania — Leads"**.
Anote o **ID numérico** da lista (será usado em `BREVO_CONTACT_LIST_ID`).

### 2c. Criar template de e-mail transacional

Em **Email → Templates → New Template**:
- Nome: "Magic Link — Programa Cidadania"
- Modo: HTML ou drag-and-drop
- As variáveis a usar no corpo do e-mail:
  - `{{ params.NOME }}` → primeiro nome do destinatário
  - `{{ params.MAGIC_LINK_URL }}` → URL completa do magic link

Conteúdo sugerido do e-mail (já produzido pelo Copywriter — ver `config/copy.ts → copyEmailMagicLink`):
- Assunto: "Seu acesso aos materiais do Programa está pronto"
- Pré-cabeçalho: "Clique no botão abaixo para acessar guias, modelos e recursos pedagógicos do Programa."

Após salvar, anote o **ID numérico** do template (será usado em `BREVO_MAGIC_LINK_TEMPLATE_ID`).

### 2d. Obter a API key

Em **SMTP & API → API Keys**, criar uma nova chave com permissões:
- Contacts (leitura e escrita)
- Transactional emails (envio)

Copie a chave (começa com `xkeysib-`). Será usada em `BREVO_API_KEY`.

---

## 3. Configurar variáveis de ambiente na Vercel

Acesse o painel da Vercel → seu projeto → **Settings → Environment Variables**.

Para cada variável abaixo, adicionar marcando os ambientes **Production**, **Preview** e **Development**:

| Variável | Valor | Onde obter |
|---|---|---|
| `BREVO_API_KEY` | `xkeysib-...` | Passo 2d |
| `BREVO_CONTACT_LIST_ID` | ID numérico | Passo 2b |
| `BREVO_MAGIC_LINK_TEMPLATE_ID` | ID numérico | Passo 2c |
| `KV_REST_API_URL` | gerado automaticamente | Vercel → Storage → KV |
| `KV_REST_API_TOKEN` | gerado automaticamente | Vercel → Storage → KV |
| `KV_REST_API_READ_ONLY_TOKEN` | gerado automaticamente | Vercel → Storage → KV |
| `NEXT_PUBLIC_BASE_URL` | `https://cidadaniaesustentabilidade.com.br` | — |
| `MAGIC_LINK_SECRET` | string aleatória de 64 chars | ver comando abaixo |

Para gerar o `MAGIC_LINK_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4. Ativar Vercel KV

No painel Vercel → **Storage → Create Database → KV (Redis)**.
Após criar, as variáveis `KV_REST_API_URL`, `KV_REST_API_TOKEN` e `KV_REST_API_READ_ONLY_TOKEN` são geradas automaticamente e ficam disponíveis no projeto.

---

## 5. Inicializar o repositório GitHub

```bash
# Na raiz do projeto
git init
git add .
git commit -m "chore: initial project setup — Sprint 1 + Sprint 2"

# Criar repositório privado (requer GitHub CLI autenticado)
gh repo create redenec/programa-cidadania --private --source=. --remote=origin --push

# Se não tiver gh CLI, criar o repo manualmente em github.com e rodar:
# git remote add origin https://github.com/[sua-org]/programa-cidadania.git
# git branch -M main
# git push -u origin main
```

### Proteção de branch

No GitHub → repositório → **Settings → Branches → Add rule**:
- Branch name pattern: `main`
- Marcar: "Require a pull request before merging"
- Desmarcar: "Allow force pushes"

---

## 6. Configurar DNS no Registro.br (quando o domínio for aprovado)

Quando o domínio `cidadaniaesustentabilidade.com.br` for aprovado no Registro.br:

1. Acesse registro.br → seu domínio → **DNS**
2. Adicionar os seguintes registros (obter os valores no painel Vercel → seu projeto → **Settings → Domains → Add**):

| Tipo | Nome | Valor |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

3. No painel Vercel → Settings → Domains, adicionar `cidadaniaesustentabilidade.com.br` e `www.cidadaniaesustentabilidade.com.br`.

O certificado HTTPS é emitido automaticamente pela Vercel (Let's Encrypt) após a propagação do DNS (pode levar até 48h).

---

## 7. Primeiro deploy

Após configurar as variáveis de ambiente e fazer o push para o GitHub:

```bash
# O deploy acontece automaticamente via GitHub → Vercel
# Para forçar manualmente:
npx vercel --prod
```

O site estará disponível em `https://[seu-projeto].vercel.app` até o DNS do domínio próprio propagar.
