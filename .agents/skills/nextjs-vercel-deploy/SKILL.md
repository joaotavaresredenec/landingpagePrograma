---
name: nextjs-vercel-deploy
description: Setup completo de projeto Next.js 14+ com TypeScript, Tailwind CSS, ESLint, Prettier, repositório GitHub privado e deploy na Vercel com preview deploys. Inclui configuração de variáveis de ambiente, estrutura de pastas e boas práticas. Usar ao iniciar o projeto pela primeira vez (ticket T2.1) ou ao recriar ambiente.
---

# Skill: Next.js + Vercel deploy

Setup de projeto do zero até preview deploy funcionando.

## Sequência de comandos

### 1. Criar projeto

```bash
npx create-next-app@latest programa-cidadania \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd programa-cidadania
```

### 2. Configurar Prettier e ESLint

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss eslint-config-prettier
```

Criar `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Adicionar ao `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

### 3. Instalar dependências do projeto

```bash
npm install lucide-react clsx
npm install --save-dev @types/node
```

(Brevo e Vercel KV instalados pelo Integrations agent em tickets próprios.)

### 4. Configurar Figtree via next/font

Editar `app/layout.tsx`:

```typescript
import { Figtree } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-figtree',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={figtree.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### 5. Configurar Tailwind com tokens da marca

Editar `tailwind.config.ts` conforme a skill `guia-de-marca-redenec`.

### 6. Estrutura de pastas inicial

Criar a estrutura que os outros agentes vão preencher:

```bash
mkdir -p app/materiais app/obrigado app/politica-de-privacidade
mkdir -p app/api/lead app/api/validar-token
mkdir -p components/primitives components/visual components/sections components/ui
mkdir -p lib config content/materials public/logo public/thumbnails
```

### 7. Criar `.env.local.example`

```bash
# Brevo
BREVO_API_KEY=xkeysib-...
BREVO_CONTACT_LIST_ID=1
BREVO_MAGIC_LINK_TEMPLATE_ID=1

# Vercel KV (gerado automaticamente ao ativar KV na Vercel)
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MAGIC_LINK_SECRET=gerar-string-aleatoria-de-32-chars
```

Adicionar ao `.gitignore`:

```
.env.local
.env*.local
.vercel
.next
node_modules
```

### 8. Inicializar git e GitHub

```bash
git init
git add .
git commit -m "chore: initial project setup"

# Criar repositório privado via GitHub CLI
gh repo create redenec/programa-cidadania --private --source=. --remote=origin
git push -u origin main
```

Se `gh` não estiver configurado: criar o repositório manualmente em github.com, copiar a URL e rodar:

```bash
git remote add origin https://github.com/[org]/programa-cidadania.git
git branch -M main
git push -u origin main
```

### 9. Conectar à Vercel

```bash
npm install -g vercel
vercel login
vercel link
```

Responder aos prompts conectando ao projeto. O CLI cria o `.vercel/` automaticamente (já no .gitignore).

### 10. Configurar env vars na Vercel

Via dashboard vercel.com > projeto > Settings > Environment Variables.
Adicionar TODAS as variáveis de `.env.local.example` com seus valores reais, marcando:
- Production
- Preview
- Development

### 11. Primeiro deploy

```bash
vercel --prod
```

A partir daqui, todo push para `main` faz deploy automático. Todo push para outros branches gera preview deploy com URL única.

## Proteção de branch

No GitHub, em Settings > Branches, configurar proteção para `main`:
- Require a pull request before merging
- Require approvals: 1 (se tiver revisor)
- Não permitir force push
- Não permitir deletion

Para projeto solo, opcional — mas recomendado manter como lembrete de processo.

## Checklist de entrega do ticket T2.1

- [ ] Projeto Next.js criado e rodando localmente (`npm run dev` funciona em localhost:3000)
- [ ] Tailwind configurado com tokens da marca
- [ ] Figtree carregada via next/font
- [ ] ESLint + Prettier funcionando (rodar `npm run lint` sem erros)
- [ ] Repositório GitHub privado criado, com proteção de branch main
- [ ] Projeto linkado na Vercel
- [ ] Primeiro deploy publicado (URL *.vercel.app funcionando)
- [ ] `.env.local.example` documentado
- [ ] README.md básico com comandos de dev, build, lint
- [ ] Handoff preenchido em `.agents/handoffs/sprint-2/T2.1-devops.md`
