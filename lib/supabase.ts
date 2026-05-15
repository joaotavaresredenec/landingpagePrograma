import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-only. SUPABASE_SERVICE_ROLE_KEY ignora RLS — nunca importar em código de cliente.
let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (cached) return cached

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const faltando: string[] = []
  if (!url) faltando.push('SUPABASE_URL')
  if (!serviceRoleKey) faltando.push('SUPABASE_SERVICE_ROLE_KEY')
  if (faltando.length > 0) {
    throw new Error(`[supabase] envs ausentes: ${faltando.join(', ')}`)
  }

  cached = createClient(url!, serviceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return cached
}
