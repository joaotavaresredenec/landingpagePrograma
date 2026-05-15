# CLAUDE.md — Sistema de Submissão e Curadoria
## Biblioteca de Educação Cidadã (Antigravity)

Leia este arquivo inteiro antes de executar qualquer passo.
Este sistema é acoplado ao projeto Antigravity já existente.

---

## 0. VISÃO GERAL

Construir um sistema de submissão de materiais educacionais com curadoria
assistida por IA, integrado à Biblioteca de Educação Cidadã. O fluxo envolve:

1. Formulário público de submissão (qualquer pessoa pode enviar)
2. Upload automático para pasta no Google Drive
3. Avaliação automática pelos 12 critérios via Claude API
4. Painel de curador para João Tavares aprovar/rejeitar/pedir ajuste
5. Publicação automática na biblioteca após aprovação
6. Relatório bimestral de acessos enviado ao parceiro via Brevo

**Curador:** João Tavares (único)
**Submissão:** aberta ao público, sem necessidade de conta
**Armazenamento de materiais:** Google Drive (pasta controlada pela equipe)
**Stack:** Next.js (Antigravity) + Supabase + Google Drive API + Claude API + Brevo

---

## 1. ESTRUTURA DE ARQUIVOS A CRIAR NO ANTIGRAVITY

```
/
├── app/
│   ├── submeter/
│   │   └── page.tsx              # Página pública de submissão
│   └── admin/
│       └── curadoria/
│           ├── page.tsx          # Painel do curador (protegido)
│           └── [id]/
│               └── page.tsx      # Detalhe de uma submissão
├── components/
│   └── submissao/
│       ├── FormularioSubmissao.tsx
│       ├── ScoreCard.tsx         # Exibe os 12 critérios avaliados
│       └── BotoesCurador.tsx     # Aprovar / Rejeitar / Pedir ajuste
├── lib/
│   ├── drive.ts                  # Google Drive API
│   ├── curadoria.ts              # Lógica de avaliação com Claude API
│   ├── brevo.ts                  # E-mails transacionais e relatórios
│   └── supabase/
│       └── submissoes.ts         # Queries do banco
├── api/
│   ├── submissoes/
│   │   └── route.ts              # POST: recebe submissão
│   ├── curadoria/
│   │   └── route.ts              # POST: dispara avaliação Claude
│   ├── aprovar/
│   │   └── route.ts              # POST: curador aprova
│   ├── rejeitar/
│   │   └── route.ts              # POST: curador rejeita
│   └── relatorio-bimestral/
│       └── route.ts              # GET: cron job bimestral (Vercel Cron)
└── supabase/
    └── migrations/
        └── 001_submissoes.sql    # Schema do banco
```

---

## 2. SCHEMA DO BANCO DE DADOS (Supabase)

```sql
-- Executar em supabase/migrations/001_submissoes.sql

-- Tabela principal de submissões
CREATE TABLE submissoes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT now(),

  -- Dados do parceiro
  nome_contato  TEXT NOT NULL,
  email         TEXT NOT NULL,
  organizacao   TEXT NOT NULL,
  site_org      TEXT,
  opt_in_relatorio BOOLEAN DEFAULT false,

  -- Dados do material
  titulo        TEXT NOT NULL,
  descricao     TEXT NOT NULL,
  tipo_material TEXT NOT NULL,  -- guia, plano-de-aula, podcast, infografico, etc.
  publico_alvo  TEXT NOT NULL,  -- fundamental, medio, eja, professores, gestores
  eixo_matriz   TEXT NOT NULL,  -- Eixo I a V da Matriz de Saberes

  -- Google Drive
  drive_folder_id  TEXT,        -- ID da pasta criada no Drive
  drive_file_id    TEXT,        -- ID do arquivo após upload
  drive_folder_url TEXT,        -- URL para o parceiro fazer upload

  -- Curadoria automática
  scorecard     JSONB,          -- resultado dos 12 critérios (ver estrutura abaixo)
  recomendacao  TEXT,           -- 'incluir' | 'incluir_ressalvas' | 'nao_incluir'
  justificativa TEXT,           -- texto gerado pela Claude API

  -- Decisão do curador
  status        TEXT DEFAULT 'aguardando_upload',
  -- aguardando_upload → em_avaliacao → aguardando_curador
  -- → aprovado | reprovado | ajuste_solicitado

  feedback_curador TEXT,        -- mensagem do curador ao parceiro
  aprovado_em      TIMESTAMPTZ,
  aprovado_por     TEXT DEFAULT 'joao.tavares',

  -- Publicação
  material_id   TEXT,           -- ID na biblioteca após publicação
  publicado_em  TIMESTAMPTZ
);

-- Tabela de acessos por material
CREATE TABLE acessos_materiais (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id TEXT NOT NULL,    -- ID na biblioteca
  acessado_em TIMESTAMPTZ DEFAULT now()
);

-- View para relatório bimestral
CREATE VIEW relatorio_parceiros AS
SELECT
  s.email,
  s.nome_contato,
  s.organizacao,
  s.material_id,
  s.titulo,
  COUNT(a.id) FILTER (
    WHERE a.acessado_em > now() - interval '2 months'
  ) AS acessos_bimestre,
  COUNT(a.id) AS acessos_total
FROM submissoes s
LEFT JOIN acessos_materiais a ON a.material_id = s.material_id
WHERE s.status = 'aprovado'
  AND s.opt_in_relatorio = true
GROUP BY s.email, s.nome_contato, s.organizacao, s.material_id, s.titulo;

-- Row Level Security: apenas service_role acessa (operações via API)
ALTER TABLE submissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acessos_materiais ENABLE ROW LEVEL SECURITY;
```

**Estrutura do campo `scorecard` (JSONB):**
```json
{
  "criterios": [
    {
      "numero": 1,
      "nome": "Neutralidade e pluralidade",
      "resultado": "completo",
      "justificativa": "..."
    }
  ],
  "pontuacao_geral": 87,
  "gerado_em": "2025-01-15T14:32:00Z"
}
```

---

## 3. AGENTES E RESPONSABILIDADES

Execute os agentes **nesta ordem exata**.

---

### AGENTE 1 — ORCHESTRATOR

**Tarefas:**
1. Verificar que está dentro do projeto Antigravity (`package.json` presente)
2. Confirmar que as variáveis de ambiente necessárias estão no `.env.local`
3. Verificar se Supabase já está configurado no projeto
4. Executar o schema SQL no Supabase
5. Delegar para os agentes seguintes em sequência

**Variáveis de ambiente a verificar (e adicionar se ausentes):**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_DRIVE_REFRESH_TOKEN=
GOOGLE_DRIVE_PASTA_RAIZ_ID=    # ID da pasta "Submissões OBC" no Drive
ANTHROPIC_API_KEY=
BREVO_API_KEY=
CURADOR_EMAIL=joao@redenec.org  # e-mail que recebe alerta de nova submissão
ADMIN_SECRET=                   # senha de acesso ao painel /admin/curadoria
```

---

### AGENTE 2 — DATABASE AGENT

**Papel:** Criar e validar o schema no Supabase.

**Tarefas:**
1. Executar `supabase/migrations/001_submissoes.sql`
2. Confirmar que as tabelas `submissoes` e `acessos_materiais` foram criadas
3. Confirmar que a view `relatorio_parceiros` está funcionando
4. Criar índices para performance:
```sql
CREATE INDEX idx_submissoes_status ON submissoes(status);
CREATE INDEX idx_submissoes_email ON submissoes(email);
CREATE INDEX idx_acessos_material ON acessos_materiais(material_id);
CREATE INDEX idx_acessos_data ON acessos_materiais(acessado_em);
```

---

### AGENTE 3 — DRIVE AGENT

**Papel:** Configurar integração com Google Drive.

**Criar `lib/drive.ts`** com as seguintes funções:

```typescript
// Cria subpasta em GOOGLE_DRIVE_PASTA_RAIZ_ID
// Nome: "[organizacao] - [titulo] - [data]"
// Retorna: { folderId, folderUrl }
createSubmissaoFolder(organizacao: string, titulo: string): Promise<DriveFolder>

// Lista arquivos de uma pasta (para detectar quando o parceiro fez upload)
listFilesInFolder(folderId: string): Promise<DriveFile[]>

// Retorna metadados de um arquivo (nome, tipo, tamanho)
getFileMetadata(fileId: string): Promise<DriveFileMetadata>
```

**Permissões:** A pasta criada deve permitir que **qualquer pessoa com o link**
possa fazer upload — configurar `role: writer, type: anyone` via Drive API.

---

### AGENTE 4 — FORMULÁRIO AGENT

**Papel:** Criar a página pública de submissão.

**Criar `app/submeter/page.tsx`** com os seguintes campos:

**Seção 1 — Sobre você:**
- Nome completo (obrigatório)
- E-mail (obrigatório)
- Organização (obrigatório)
- Site da organização (opcional)

**Seção 2 — Sobre o material:**
- Título do material (obrigatório)
- Descrição (obrigatório — mínimo 100 caracteres, máximo 500)
- Tipo de material (select obrigatório):
  - Guia ou cartilha
  - Plano de aula
  - Podcast ou vídeo
  - Infográfico
  - Metodologia
  - Pesquisa ou relatório
  - Outro
- Público-alvo (multi-select obrigatório):
  - Ensino fundamental
  - Ensino médio
  - EJA
  - Professores
  - Gestores escolares
- Eixo da Matriz de Saberes (select obrigatório):
  - Eixo I: Percepção de Si e do Outro
  - Eixo II: Convivência Democrática
  - Eixo III: Participação Cívica
  - Eixo IV: Direitos e Deveres
  - Eixo V: Sustentabilidade e Futuro

**Seção 3 — Consentimento:**
- Checkbox LGPD (obrigatório): "Autorizo o uso dos meus dados para
  análise e comunicação sobre esta submissão, conforme a Política de
  Privacidade. Posso cancelar a qualquer momento."
- Checkbox opt-in relatório (opcional): "Quero receber relatórios
  bimestrais de acesso ao meu material por e-mail."
- Checkbox direitos autorais (obrigatório): "Confirmo que tenho os
  direitos autorais ou autorização para compartilhar este material,
  e autorizo sua publicação gratuita na Biblioteca de Educação Cidadã."

**Fluxo após submit:**
1. Salvar submissão no Supabase com status `aguardando_upload`
2. Criar pasta no Google Drive via `lib/drive.ts`
3. Atualizar submissão com `drive_folder_id` e `drive_folder_url`
4. Exibir tela de sucesso com link do Drive para upload
5. Enviar e-mail ao parceiro via Brevo com link do Drive e instruções
6. Enviar alerta ao curador (CURADOR_EMAIL) com link para o painel

**Tela de sucesso deve mostrar:**
- Mensagem de confirmação
- Link para a pasta do Drive (botão destacado)
- Instrução: "Faça o upload do seu material nesta pasta. Nossa equipe
  será notificada automaticamente e você receberá um retorno em até
  10 dias úteis."

---

### AGENTE 5 — CURADORIA AGENT

**Papel:** Avaliar automaticamente cada submissão pelos 12 critérios.

**Criar `lib/curadoria.ts`** com a função `avaliarMaterial()`.

**Esta função é chamada manualmente pelo curador no painel** (botão
"Iniciar avaliação automática") após o parceiro fazer o upload.

**Prompt do sistema para a Claude API:**

```
Você é um avaliador especializado em materiais de educação cidadã para
a Biblioteca de Educação Cidadã, mantida pela Rede Nacional de Educação
Cidadã (neec). Avalie o material submetido segundo os 12 critérios abaixo.

Para cada critério, atribua:
- COMPLETO: critério plenamente atendido, sem ressalvas
- SATISFATÓRIO: critério atendido com lacunas menores que não comprometem
  o material
- INSUFICIENTE: critério não atendido ou com problemas que comprometem
  a qualidade ou adequação do material

Definição precisa de cada critério:

CRITÉRIO 1 — NEUTRALIDADE E PLURALIDADE
Completo: o material apresenta múltiplas perspectivas sobre temas
  controversos, sem favorecer posição política, religiosa ou ideológica.
  Linguagem equânime, fontes diversas.
Satisfatório: predominantemente neutro, mas com eventuais desequilíbrios
  de perspectiva que não chegam a comprometer o caráter educacional.
Insuficiente: material claramente parcial, panfletário, com viés
  político-partidário, religioso ou ideológico explícito.

CRITÉRIO 2 — CLAREZA E COERÊNCIA DA PROPOSTA
Completo: objetivos claros, linguagem adequada ao público-alvo, estrutura
  lógica e progressiva. Fácil entender o que o material propõe e como.
Satisfatório: proposta compreensível mas com trechos confusos ou
  estrutura irregular que exige esforço adicional do educador.
Insuficiente: objetivos ausentes ou obscuros, linguagem inacessível
  ao público declarado, estrutura incoerente.

CRITÉRIO 3 — JUSTIFICATIVA PEDAGÓGICA E CONCEITUAL
Completo: fundamentação teórica explícita, alinhamento com abordagens
  pedagógicas reconhecidas (construtivismo, aprendizagem ativa, etc.),
  conceitos-chave definidos com clareza.
Satisfatório: base pedagógica presente mas implícita ou parcialmente
  desenvolvida. Conceitos usados sem definição suficiente.
Insuficiente: ausência de fundamentação pedagógica ou conceitual.
  Material aplicativo sem base teórica identificável.

CRITÉRIO 4 — DETALHAMENTO E REPLICABILIDADE
Completo: qualquer educador sem contato prévio com o material consegue
  aplicá-lo seguindo as instruções. Tempo, recursos, dinâmicas e
  adaptações detalhados.
Satisfatório: replicável com esforço adicional de interpretação.
  Faltam alguns detalhes operacionais mas a estrutura é clara.
Insuficiente: instruções insuficientes para replicação independente.
  Dependência excessiva de formação específica não oferecida pelo material.

CRITÉRIO 5 — FONTES E EVIDÊNCIAS
Completo: afirmações baseadas em fontes identificadas e confiáveis
  (pesquisas, dados públicos, legislação, autores referenciados).
  Referências acessíveis ao leitor.
Satisfatório: fontes presentes mas incompletas (algumas afirmações sem
  referência, referências sem dados suficientes para localização).
Insuficiente: afirmações sem embasamento, dados não referenciados,
  ausência total de fontes ou uso de fontes não confiáveis.

CRITÉRIO 6 — POTENCIAL DE IMPACTO E APLICABILIDADE
Completo: alta probabilidade de gerar aprendizagem significativa e
  mudança de comportamento. Aplicável em contextos reais de sala de aula
  ou espaço educativo sem adaptações significativas.
Satisfatório: impacto potencial presente mas limitado por escopo restrito,
  complexidade de implementação ou dependência de recursos específicos.
Insuficiente: impacto improvável dado o formato, complexidade ou
  distância da realidade educacional brasileira.

CRITÉRIO 7 — CONTRIBUIÇÃO À CIDADANIA E À DIVERSIDADE
Completo: material fortalece ativamente a formação cidadã, reconhece
  e valoriza a diversidade (étnica, regional, de gênero, etc.) e
  está alinhado com os princípios democráticos.
Satisfatório: contribuição cidadã presente mas superficial. Diversidade
  não contrariada mas também não afirmada.
Insuficiente: material neutro em relação à formação cidadã (não contribui
  para os objetivos da biblioteca) ou apresenta viés discriminatório.

CRITÉRIO 8 — ORIGINALIDADE E INOVAÇÃO
Completo: abordagem, formato ou perspectiva diferenciada em relação ao
  que já existe na biblioteca. Contribuição nova ao acervo.
Satisfatório: conteúdo válido mas semelhante ao que já existe. Adiciona
  com redundância aceitável.
Insuficiente: duplicata evidente de material já existente ou abordagem
  completamente genérica sem nenhum diferencial.

CRITÉRIO 9 — ADEQUAÇÃO TÉCNICA E ACESSIBILIDADE
Completo: material tecnicamente bem produzido, legível, com contraste
  adequado, linguagem acessível, sem erros ortográficos relevantes.
  Funciona em dispositivos de baixa performance quando digital.
Satisfatório: qualidade técnica aceitável com problemas menores (alguns
  erros, formatação irregular, levemente pesado para download).
Insuficiente: problemas técnicos que comprometem o uso (arquivo corrompido,
  ilegível, erros graves de português, tamanho proibitivo para conexões lentas).

CRITÉRIO 10 — DIREITOS AUTORAIS E USO
Completo: material original ou com autorização documentada. Licença
  de uso explicitada (Creative Commons ou equivalente). Imagens e
  conteúdos de terceiros devidamente creditados.
Satisfatório: autoria clara mas licença não explicitada. Uso de conteúdos
  de terceiros com crédito mas sem indicação de licença.
Insuficiente: indícios de uso não autorizado de conteúdos de terceiros,
  ausência de informação de autoria ou licença incompatível com
  distribuição gratuita.

CRITÉRIO 11 — COMPLETUDE DOCUMENTAL
Completo: submissão acompanhada de todos os elementos esperados —
  descrição adequada, público-alvo definido, eixo da Matriz de Saberes
  indicado, e arquivo do material disponível e acessível.
Satisfatório: maioria dos elementos presentes mas com lacunas menores
  que podem ser sanadas com uma solicitação ao parceiro.
Insuficiente: submissão incompleta a ponto de inviabilizar a avaliação
  ou a publicação sem retrabalho significativo.

CRITÉRIO 12 — SUSTENTABILIDADE E ESCALABILIDADE
Completo: material perene ou com atualização facilitada. Não depende
  de recursos esgotáveis, tecnologias proprietárias ou contextos
  políticos transitórios.
Satisfatório: material útil no médio prazo com algumas dependências
  de contexto que podem desatualizá-lo.
Insuficiente: material com prazo de validade curto ou dependência
  de plataformas, eventos ou políticas que podem deixar de existir.

---

Após avaliar todos os critérios, emita uma recomendação final:

INCLUIR: 10 ou mais critérios como Completo ou Satisfatório,
  sem nenhum Insuficiente em critérios 1, 7 ou 10.
INCLUIR COM RESSALVAS: 8 ou mais critérios como Completo ou Satisfatório,
  com no máximo 2 Insuficientes em critérios não críticos.
NÃO INCLUIR: menos de 8 critérios satisfatórios, ou qualquer
  Insuficiente nos critérios 1 (neutralidade), 7 (cidadania) ou 10
  (direitos autorais).

Responda APENAS em JSON válido com a estrutura abaixo, sem texto fora do JSON:

{
  "criterios": [
    {
      "numero": 1,
      "nome": "Neutralidade e pluralidade",
      "resultado": "completo|satisfatorio|insuficiente",
      "justificativa": "..."
    }
  ],
  "pontuacao_geral": 0-100,
  "recomendacao": "incluir|incluir_ressalvas|nao_incluir",
  "justificativa_geral": "...",
  "pontos_atencao": ["...", "..."],
  "sugestoes_ao_parceiro": "..."
}
```

---

### AGENTE 6 — PAINEL AGENT

**Papel:** Criar o painel de curador em `/admin/curadoria`.

**Proteção:** Verificar header `Authorization: Bearer ${ADMIN_SECRET}` ou
implementar middleware Next.js que redireciona para login simples com senha.

**Página principal `/admin/curadoria`:**
- Lista de submissões agrupadas por status
- Filtros: Aguardando upload · Em avaliação · Aguardando curador · Aprovados · Reprovados
- Para cada submissão: nome do material · organização · data · status · botão Ver
- Badge colorido por recomendação da IA (verde/amarelo/vermelho)
- Contador de submissões por status no topo

**Página de detalhe `/admin/curadoria/[id]`:**
- Dados completos da submissão
- Link para a pasta no Google Drive
- Botão "Iniciar avaliação automática" (chama `lib/curadoria.ts`)
- ScoreCard com os 12 critérios (após avaliação)
- Recomendação da IA em destaque
- Área de texto para feedback do curador
- Três botões de ação:
  - ✅ APROVAR — muda status para `aprovado`, envia e-mail de aprovação ao parceiro
  - 🔄 PEDIR AJUSTE — muda status para `ajuste_solicitado`, envia e-mail com feedback
  - ❌ REPROVAR — muda status para `reprovado`, envia e-mail com feedback

---

### AGENTE 7 — EMAIL AGENT

**Papel:** Configurar todos os e-mails transacionais via Brevo.

**E-mails a criar (salvar templates no Brevo):**

**1. Confirmação de submissão (para o parceiro)**
```
Assunto: Recebemos sua submissão — [Título do Material]

Olá, [Nome]!

Recebemos sua submissão para a Biblioteca de Educação Cidadã.

Para concluir, faça o upload do seu material nesta pasta:
[BOTÃO: Acessar pasta no Google Drive]

Após o upload, nossa equipe será notificada e você
receberá um retorno em até 10 dias úteis.

Material: [Título]
Organização: [Organização]
```

**2. Alerta ao curador (para João Tavares)**
```
Assunto: Nova submissão aguardando avaliação — [Título]

Nova submissão recebida.

Organização: [Organização]
Material: [Título]
Tipo: [Tipo]
Público: [Público]

[BOTÃO: Ver no painel de curadoria]
```

**3. Aprovação (para o parceiro)**
```
Assunto: Seu material foi aprovado! ✅

Olá, [Nome]!

Ótima notícia: [Título do Material] foi aprovado e
já está disponível na Biblioteca de Educação Cidadã.

[BOTÃO: Ver na biblioteca]

[Feedback do curador, se houver]
```

**4. Ajuste solicitado (para o parceiro)**
```
Assunto: Solicitamos ajustes no seu material

Olá, [Nome]!

Analisamos [Título do Material] e gostaríamos de
sugerir alguns ajustes antes da publicação:

[Feedback do curador]

Por favor, substitua o arquivo na sua pasta do Drive
e nos avise respondendo este e-mail.

[BOTÃO: Acessar pasta no Drive]
```

**5. Reprovação (para o parceiro)**
```
Assunto: Retorno sobre sua submissão

Olá, [Nome]!

Agradecemos por compartilhar [Título do Material]
com a Biblioteca de Educação Cidadã.

Após análise cuidadosa, não será possível incluí-lo
neste momento pelos seguintes motivos:

[Feedback do curador]

Ficamos à disposição para dúvidas.
```

**6. Relatório bimestral (para parceiros com opt-in)**
```
Assunto: Seus materiais impactaram [X] pessoas — Relatório [Mês/Mês]

Olá, [Nome]!

Aqui está o relatório de acessos dos seus materiais
na Biblioteca de Educação Cidadã:

[Para cada material:]
📄 [Título]
   [X] acessos nos últimos 2 meses · [X] no total

[Se múltiplos estados: "Seus materiais chegaram a X estados."]

Obrigado por contribuir com a educação cidadã no Brasil.
```

---

### AGENTE 8 — CRON AGENT

**Papel:** Configurar o envio automático do relatório bimestral.

**Criar `api/relatorio-bimestral/route.ts`:**
```typescript
// Esta rota é chamada pelo Vercel Cron a cada 2 meses
// Protegida por header Authorization: Bearer ${CRON_SECRET}

export async function GET(request: Request) {
  // 1. Buscar todos os parceiros com opt_in_relatorio = true
  //    e pelo menos um material aprovado
  // 2. Para cada parceiro, buscar dados da view relatorio_parceiros
  // 3. Enviar e-mail via Brevo usando template 6
  // 4. Retornar { enviados: N, erros: [] }
}
```

**Criar `vercel.json` na raiz do projeto:**
```json
{
  "crons": [
    {
      "path": "/api/relatorio-bimestral",
      "schedule": "0 9 1 */2 *"
    }
  ]
}
```
O cron roda no dia 1 de cada mês bimestral (jan, mar, mai, jul, set, nov) às 9h.

---

### AGENTE 9 — QA AGENT

**Papel:** Validar o sistema antes do deploy.

**Checklist:**

Formulário
- [ ] Submissão cria registro no Supabase
- [ ] Pasta é criada no Google Drive com nome correto
- [ ] Link do Drive é enviado ao parceiro por e-mail
- [ ] Alerta chega ao e-mail do curador

Curadoria automática
- [ ] Botão "Iniciar avaliação" chama a Claude API
- [ ] ScoreCard exibe os 12 critérios com resultados
- [ ] Recomendação final aparece em destaque
- [ ] JSON do scorecard é salvo no Supabase

Painel do curador
- [ ] Acesso bloqueado sem ADMIN_SECRET
- [ ] Lista de submissões filtra por status corretamente
- [ ] Botão Aprovar muda status e dispara e-mail ao parceiro
- [ ] Botão Pedir Ajuste muda status e dispara e-mail com feedback
- [ ] Botão Reprovar muda status e dispara e-mail com feedback

Relatório bimestral
- [ ] Rota `/api/relatorio-bimestral` retorna dados corretos
- [ ] E-mail de relatório renderiza corretamente com dados reais
- [ ] Apenas parceiros com opt-in recebem

LGPD
- [ ] Checkboxes obrigatórios não pré-marcados
- [ ] Opt-in de relatório separado e opcional
- [ ] Checkbox de direitos autorais obrigatório

---

## 4. COMO INICIAR NO ANTIGRAVITY

```bash
# 1. Abrir nova janela do PowerShell

# 2. Navegar até o projeto Antigravity
cd "C:\Users\Joao Tavares\Desktop\CODE"

# 3. Confirmar que está no projeto certo
ls   # deve mostrar package.json, app/, components/, etc.

# 4. Colocar este CLAUDE.md na raiz do projeto
# (arrastar pelo Explorer para a pasta CODE)

# 5. Adicionar as variáveis de ambiente no .env.local
# (abrir o arquivo e adicionar as chaves listadas no Agente 1)

# 6. Iniciar o Claude Code
claude

# 7. Dentro do Claude Code, dizer:
# "Execute o workflow completo do sistema de submissão e curadoria
#  conforme o CLAUDE.md, começando pelo Agente 1."
```

---

## 5. ORDEM DE CONFIGURAÇÕES MANUAIS (antes de rodar)

Antes de iniciar o Claude Code, configure manualmente:

**1. Google Drive API**
- Acesse console.cloud.google.com
- Crie um projeto novo (ou use o existente)
- Ative a Google Drive API
- Crie credenciais OAuth 2.0 (tipo: Web Application)
- Gere um refresh token usando o OAuth Playground
- Crie a pasta "Submissões — Biblioteca" no seu Drive pessoal
- Copie o ID da pasta (último segmento da URL)
- Adicione tudo no `.env.local`

**2. Supabase**
- Se ainda não tiver projeto Supabase para o Antigravity, criar em supabase.com
- Copiar URL e service role key para o `.env.local`

**3. Brevo**
- Usar a mesma chave REST já configurada
- Os templates serão criados pelo Agente 7 via API

**4. ADMIN_SECRET**
- Gerar uma senha forte para o painel de curadoria
- Adicionar no `.env.local`

---

*Sistema de Submissão e Curadoria — Biblioteca de Educação Cidadã*
*neec — Rede Nacional de Educação Cidadã*
*CLAUDE.md gerado em 2025*
