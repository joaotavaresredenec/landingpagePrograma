-- 004_materiais_publicados.sql
-- Catálogo de materiais publicados (aprovados pela curadoria).
-- Substitui o catálogo estático em config/materials.json para materiais novos.
-- Os 36 materiais originais seguem no JSON; a UI mescla as duas fontes em runtime.
-- Aplicar manualmente no painel do Supabase ou via CLI:
--   psql "$SUPABASE_DB_URL" -f supabase/migrations/004_materiais_publicados.sql
--
-- RLS desabilitada: leitura pelo server (anon ou service role); inserções só pelo
-- server action de aprovação com SUPABASE_SERVICE_ROLE_KEY.

CREATE TABLE public.materiais_publicados (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 text        NOT NULL UNIQUE,
  submissao_id         uuid        REFERENCES public.submissoes(id) ON DELETE SET NULL,

  -- Identidade
  titulo               text        NOT NULL,
  titulo_editorial     text        NOT NULL,
  organizacao          text        NOT NULL,

  -- Conteúdo editorial
  descricao            text        NOT NULL DEFAULT '',
  descricao_card       text        NOT NULL DEFAULT '',
  sinopse              text        NOT NULL DEFAULT '',
  pontos_chave         text[]      NOT NULL DEFAULT '{}',

  -- Classificação
  tipo                 text        NOT NULL,
  formato              text        NOT NULL DEFAULT '',
  etapas               text[]      NOT NULL DEFAULT '{}',
  temas                text[]      NOT NULL DEFAULT '{}',

  -- Metadados editoriais
  licenca              text        NOT NULL DEFAULT '',
  licenca_slug         text,
  faixa_etaria         text,
  alinhamento_bncc     text,

  -- Acesso ao material
  link_principal       text        NOT NULL,
  links_extras         jsonb       NOT NULL DEFAULT '[]'::jsonb,

  -- Curadoria
  recomendacao         text        NOT NULL DEFAULT 'incluir',
  observacoes_curador  text        NOT NULL DEFAULT '',

  -- Auditoria
  criado_em            timestamptz NOT NULL DEFAULT now(),
  publicado_em         timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT materiais_publicados_recomendacao_check
    CHECK (recomendacao IN ('incluir', 'incluir-com-ajustes'))
);

ALTER TABLE public.materiais_publicados DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_materiais_publicados_slug
  ON public.materiais_publicados (slug);

CREATE INDEX idx_materiais_publicados_publicado_em
  ON public.materiais_publicados (publicado_em DESC);

COMMENT ON TABLE public.materiais_publicados IS
  'Catálogo de materiais aprovados pela curadoria. Mesclado em runtime com config/materials.json (os 36 originais) para alimentar /biblioteca.';

COMMENT ON COLUMN public.materiais_publicados.slug IS
  'Identificador estável usado na URL (/biblioteca/{slug}). Gerado a partir de kebab(organizacao)-kebab(titulo) com sufixo numérico em caso de colisão.';

COMMENT ON COLUMN public.materiais_publicados.submissao_id IS
  'FK opcional para submissoes.id. ON DELETE SET NULL preserva o material publicado mesmo se a submissão de origem for excluída.';

COMMENT ON COLUMN public.materiais_publicados.licenca IS
  'Label legível da licença para exibição (ex.: "Material aberto"). Para o slug interno, ver licenca_slug.';

COMMENT ON COLUMN public.materiais_publicados.licenca_slug IS
  'Slug da licença em config/licencas.ts (ex.: aberta-com-adaptacao). NULL para entradas legadas.';

COMMENT ON COLUMN public.materiais_publicados.link_principal IS
  'URL do arquivo do material (Vercel Blob ou link externo). Replicado nos cards e na página de detalhe.';

COMMENT ON COLUMN public.materiais_publicados.links_extras IS
  'Array JSONB de links adicionais com shape { rotulo, url, tipo }. Ver types/material.ts → MaterialLink.';
