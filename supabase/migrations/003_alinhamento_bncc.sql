-- 003_alinhamento_bncc.sql
-- Adiciona coluna alinhamento_bncc à tabela de submissões.
-- Aplicar manualmente no painel do Supabase ou via CLI:
--   psql "$SUPABASE_DB_URL" -f supabase/migrations/003_alinhamento_bncc.sql
--
-- Valores esperados (validação na camada de API):
--   'sim' | 'parcialmente' | 'nao'

ALTER TABLE public.submissoes
  ADD COLUMN IF NOT EXISTS alinhamento_bncc text;

COMMENT ON COLUMN public.submissoes.alinhamento_bncc IS
  'Declaração do parceiro sobre alinhamento intencional à BNCC. Valores: sim | parcialmente | nao.';
