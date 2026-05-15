-- 002_faixa_etaria.sql
-- Adiciona coluna faixa_etaria à tabela de submissões.
-- Aplicar manualmente no painel do Supabase ou via CLI:
--   psql "$SUPABASE_DB_URL" -f supabase/migrations/002_faixa_etaria.sql
--
-- Valores esperados (validação na API, em config/faixa-etaria.ts):
--   'livre' | '10-mais' | '14-mais' | 'apenas-educadores'

ALTER TABLE public.submissoes
  ADD COLUMN IF NOT EXISTS faixa_etaria text;

COMMENT ON COLUMN public.submissoes.faixa_etaria IS
  'Idade mínima recomendada do material. Valores fixados em config/faixa-etaria.ts. Validação na camada de API.';
