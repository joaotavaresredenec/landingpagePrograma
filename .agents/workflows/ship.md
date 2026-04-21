---
description: Faz o deploy final do site em produção, após as três sprints terem sido aprovadas. Aponta o domínio .com.br e entrega a URL final. Uso /ship.
---

# Workflow: /ship

Quando o usuário digita `/ship`, execute como **PM agent** o deploy final.

## Pré-condições obrigatórias

- Sprint 1 aprovada (`SPRINT-1-REVIEW.md` com "aprovado")
- Sprint 2 aprovada (`SPRINT-2-REVIEW.md` com "aprovado")
- Sprint 3 aprovada (`SPRINT-3-REVIEW.md` com "aprovado" do usuário humano)
- `RELATORIO-QA.md` e `RELATORIO-AUDITORIA.md` existem e recomendam aprovação
- Nenhum ticket bloqueador aberto em `.agents/fixes/`
- Domínio registrado e DNS propagado (ticket T2.4 concluído)

Se alguma pré-condição não for atendida, **recusar executar** e listar o que falta.

## Sequência

### 1. Verificação final

O PM agent executa os seguintes checks antes de qualquer deploy:

- [ ] Rodar `git status` — working tree limpo
- [ ] Rodar `npm run build` localmente — build passa sem erros
- [ ] Verificar se todas as env vars de produção estão configuradas na Vercel
- [ ] Verificar se o domínio responde: `curl -I https://programacidadaniaesustentabilidade.com.br` retorna 200
- [ ] Verificar se o certificado SSL está válido

Se algum check falhar, reportar ao usuário e pausar.

### 2. Despachar DevOps agent

Acionar o DevOps agent com a tarefa de deploy de produção:

- Fazer `git push origin main` — Vercel dispara deploy automático na branch production
- Acompanhar o build na Vercel
- Se der erro: reportar ao PM que reporta ao usuário
- Se der certo: capturar a URL de produção e os logs

### 3. Smoke test em produção

O DevOps agent, após o deploy, executa um smoke test mínimo:

- [ ] Home carrega em < 3 segundos
- [ ] Formulário está renderizando todos os campos
- [ ] Submit do formulário com dados de teste funciona
- [ ] E-mail de magic link chega
- [ ] Magic link abre `/materiais` corretamente
- [ ] Política de privacidade acessível

Não é o teste completo do QA (já foi feito em preview). É só confirmar que o deploy não quebrou nada.

### 4. Fazer tag de versão no git

```bash
git tag -a v1.0.0 -m "Lançamento v1.0.0"
git push origin v1.0.0
```

### 5. Gerar relatório final do projeto

Criar `PROJETO-ENTREGUE.md` na raiz:

```markdown
# Projeto entregue — [data]

## Status
✅ Em produção

## URL de produção
https://programacidadaniaesustentabilidade.com.br

## Resumo
[3-5 parágrafos consolidando o que foi entregue, decisões importantes tomadas, e o que está pronto para a próxima fase (OBC)]

## Métricas finais
- Lighthouse Performance: X
- Lighthouse Accessibility: X
- Lighthouse Best Practices: X
- Lighthouse SEO: X

## Próximos passos sugeridos
- Monitorar captação nas primeiras 2 semanas
- Quando a OBC estiver pronta, segmentar base no Brevo por perfil e disparar campanha
- Iterações recomendadas: [lista]

## Como manter
- Atualizações de conteúdo: editar `content/copy.ts` ou `content/materials/*.md` e fazer commit
- Novos materiais: adicionar em `config/materials.ts` e subir arquivos no Google Drive
- Monitoramento: dashboard Vercel + painel Brevo
- Suporte: [contato LGPD e contato técnico]
```

### 6. Responder ao usuário

```
🎉 Site no ar.

URL de produção: https://programacidadaniaesustentabilidade.com.br

Smoke test: ✅ passou
Tag v1.0.0 publicada no GitHub
PROJETO-ENTREGUE.md gerado com métricas e próximos passos

Próximos passos sugeridos:
1. Teste o site em condições reais (mobile, rede 4G, etc.)
2. Compartilhe com alguém da equipe para feedback
3. Quando a OBC estiver pronta, vamos disparar a campanha para a base captada

Se precisar corrigir algo agora: use /fix [descrição]
Se quiser ajustar copy ou layout depois: só editar o arquivo e fazer commit
```

### 7. Encerrar projeto

Marcar o projeto como concluído. Os agentes ficam disponíveis para ajustes futuros via `/fix`, mas as sprints regulares do projeto terminam aqui.

## Cuidados

- **Nunca fazer deploy sem todas as pré-condições.** Prefereir pausar e explicar o que falta.
- **Nunca "forçar" um fix de último minuto durante o ship.** Se descobrir problema, abortar ship, abrir /fix, corrigir, revalidar QA, então tentar ship de novo.
- **Se o deploy falhar parcialmente** (ex: build passou mas smoke test reprovou uma funcionalidade), reverter: `vercel rollback` ou fazer revert no git.
