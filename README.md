# Programa Educação para a Cidadania e Sustentabilidade

Landing page de captação de leads — Redenec × MEC.

## Requisitos

- Node.js 18+
- Conta Brevo com API key e template de e-mail configurado
- Projeto Vercel com Vercel KV ativado

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
# Preencher .env.local com os valores reais
npm run dev
```

Acesse http://localhost:3000

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Verificar erros de lint |
| `npm run format` | Formatar código com Prettier |

## Estrutura

```
app/           → Rotas Next.js (App Router)
components/    → Componentes React
config/        → Dados e copy
lib/           → Integrações (Brevo, KV, magic-link)
public/        → Assets estáticos
```

## Deploy

Push para `main` dispara deploy automático na Vercel.
Pull Requests geram preview deploys com URL única.

## Manutenção

- **Atualizar copy:** editar `config/copy.ts`
- **Adicionar material:** editar `config/materials.ts`
- **Variáveis de ambiente:** painel Vercel → Settings → Environment Variables
