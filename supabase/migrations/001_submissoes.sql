-- 001_submissoes.sql
-- Sistema de submissão e avaliação de materiais (Redenec / PECS).
-- Tabelas: public.submissoes, public.acessos_materiais
-- RLS desabilitado: toda escrita passa pelo server com SUPABASE_SERVICE_ROLE_KEY.

-- ─────────────────────────────────────────────────────────────
-- Extensões
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;    -- emails case-insensitive

-- ─────────────────────────────────────────────────────────────
-- Trigger genérico para atualizado_em
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_atualizado_em()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em := now();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- public.submissoes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.submissoes (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  criado_em                timestamptz NOT NULL DEFAULT now(),
  atualizado_em            timestamptz NOT NULL DEFAULT now(),

  -- Parceiro submetente
  organizacao_autora       text        NOT NULL,
  ponto_focal_nome         text        NOT NULL,
  ponto_focal_email        citext      NOT NULL,

  -- Dados do recurso (formulário do parceiro)
  titulo                   text        NOT NULL,
  descricao                text        NOT NULL,
  tipo_recurso             text        NOT NULL,
  formato                  text,
  idiomas                  text[]      NOT NULL DEFAULT '{}',
  etapas_ensino            text[]      NOT NULL DEFAULT '{}',
  temas_bncc               text[]      NOT NULL DEFAULT '{}',
  licenca                  text,
  material_arquivo_url     text,
  material_link_externo    text,
  termo_autorizacao_url    text,

  -- Avaliação do curador
  status                   text        NOT NULL DEFAULT 'pendente',
  curador_email            citext,
  avaliacao_iniciada_em    timestamptz,
  avaliacao_concluida_em   timestamptz,
  criterios                jsonb,
  recomendacao             text,
  observacoes_curador      text,

  -- Publicação no catálogo
  material_id              text        UNIQUE,
  publicado_em             timestamptz,

  CONSTRAINT submissoes_status_check
    CHECK (status IN (
      'pendente',
      'em_revisao',
      'aprovado',
      'aprovado_com_ajustes',
      'rejeitado'
    )),

  CONSTRAINT submissoes_recomendacao_check
    CHECK (
      recomendacao IS NULL
      OR recomendacao IN ('incluir', 'incluir-com-ajustes', 'nao-incluir')
    )
);

ALTER TABLE public.submissoes DISABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_submissoes_atualizado_em
  BEFORE UPDATE ON public.submissoes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX idx_submissoes_status_criado_em
  ON public.submissoes (status, criado_em DESC);

CREATE INDEX idx_submissoes_ponto_focal_email
  ON public.submissoes (ponto_focal_email);

CREATE INDEX idx_submissoes_material_id
  ON public.submissoes (material_id)
  WHERE material_id IS NOT NULL;

COMMENT ON COLUMN public.submissoes.criterios IS
  '12 critérios da curadoria Redenec. Shape esperado: { neutralidade_pluralidade: { nota, comentario }, clareza_coerencia: {...}, justificativa_pedagogica: {...}, detalhamento_replicabilidade: {...}, fontes_evidencias: {...}, potencial_impacto: {...}, contribuicao_cidadania: {...}, originalidade_inovacao: {...}, adequacao_tecnica: {...}, direitos_autorais: {...}, completude_documental: {...}, sustentabilidade_escalabilidade: {...} } — nota in (completo, satisfatorio, insuficiente). Validação aplicada na camada de API.';

COMMENT ON COLUMN public.submissoes.material_id IS
  'Slug do material em config/materials.json após publicação. NULL enquanto não publicado.';

-- ─────────────────────────────────────────────────────────────
-- public.acessos_materiais
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.acessos_materiais (
  id            bigserial   PRIMARY KEY,
  material_id   text        NOT NULL,
  email         citext,
  ip            inet,
  user_agent    text,
  referer       text,
  criado_em     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.acessos_materiais DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_acessos_material_criado
  ON public.acessos_materiais (material_id, criado_em DESC);

CREATE INDEX idx_acessos_email_criado
  ON public.acessos_materiais (email, criado_em DESC)
  WHERE email IS NOT NULL;

COMMENT ON COLUMN public.acessos_materiais.material_id IS
  'Slug do material em config/materials.json. Sem FK explícita: o catálogo ainda vive no JSON.';
