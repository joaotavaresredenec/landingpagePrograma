import { getSupabase } from '@/lib/supabase'

type Bucket = { chave: string; total: number }

export type ContextoBiblioteca = {
  etapasMaisAcessadas: Bucket[] | 'desconhecido'
  topMateriaisAprovados:
    | Array<{ id: string; titulo: string; organizacao: string }>
    | 'desconhecido'
  distribuicaoTemas: Bucket[] | 'desconhecido'
  perfilPublico: Bucket[] | 'desconhecido'
}

function topN(map: Map<string, number>, n: number): Bucket[] {
  return Array.from(map.entries())
    .map(([chave, total]) => ({ chave, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, n)
}

async function buscarEtapasMaisAcessadas(): Promise<Bucket[] | 'desconhecido'> {
  try {
    const supabase = getSupabase()
    const desde = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('acessos_materiais')
      .select('material_id, submissoes!inner(etapas_ensino)')
      .gte('acessado_em', desde)
    if (error || !data) throw error ?? new Error('sem dados')

    const contagem = new Map<string, number>()
    for (const row of data as Array<{ submissoes?: { etapas_ensino?: string[] } }>) {
      for (const etapa of row.submissoes?.etapas_ensino ?? []) {
        contagem.set(etapa, (contagem.get(etapa) ?? 0) + 1)
      }
    }
    if (contagem.size === 0) return 'desconhecido'
    return topN(contagem, 5)
  } catch (e) {
    console.warn('[contexto-biblioteca] etapasMaisAcessadas falhou:', e)
    return 'desconhecido'
  }
}

async function buscarTopMateriaisAprovados(): Promise<
  ContextoBiblioteca['topMateriaisAprovados']
> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('submissoes')
      .select('id, titulo, organizacao_autora')
      .eq('status', 'aprovado')
      .order('criado_em', { ascending: false })
      .limit(5)
    if (error) throw error
    if (!data || data.length === 0) return 'desconhecido'
    return data.map((r) => ({
      id: r.id as string,
      titulo: r.titulo as string,
      organizacao: r.organizacao_autora as string,
    }))
  } catch (e) {
    console.warn('[contexto-biblioteca] topMateriaisAprovados falhou:', e)
    return 'desconhecido'
  }
}

async function buscarDistribuicaoTemas(): Promise<Bucket[] | 'desconhecido'> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('submissoes')
      .select('temas_bncc')
      .eq('status', 'aprovado')
    if (error) throw error
    if (!data || data.length === 0) return 'desconhecido'

    const contagem = new Map<string, number>()
    for (const row of data as Array<{ temas_bncc?: string[] }>) {
      for (const tema of row.temas_bncc ?? []) {
        contagem.set(tema, (contagem.get(tema) ?? 0) + 1)
      }
    }
    if (contagem.size === 0) return 'desconhecido'
    return topN(contagem, 10)
  } catch (e) {
    console.warn('[contexto-biblioteca] distribuicaoTemas falhou:', e)
    return 'desconhecido'
  }
}

async function buscarPerfilPublico(): Promise<Bucket[] | 'desconhecido'> {
  const apiKey = process.env.BREVO_API_KEY
  const listIdRaw = process.env.BREVO_CONTACT_LIST_ID
  if (!apiKey || !listIdRaw) return 'desconhecido'
  const listId = Number(listIdRaw)
  if (!listId) return 'desconhecido'

  try {
    const url = new URL(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts`,
    )
    url.searchParams.set('limit', '500')
    url.searchParams.set('offset', '0')
    url.searchParams.set('sort', 'desc')

    const resp = await fetch(url.toString(), {
      headers: { 'api-key': apiKey, accept: 'application/json' },
      cache: 'no-store',
    })
    if (!resp.ok) throw new Error(`Brevo HTTP ${resp.status}`)

    const json = (await resp.json()) as {
      contacts?: Array<{ attributes?: Record<string, unknown> }>
    }
    const contatos = json.contacts ?? []
    if (contatos.length === 0) return 'desconhecido'

    const contagem = new Map<string, number>()
    for (const c of contatos) {
      const perfil = c.attributes?.PERFIL
      if (typeof perfil === 'string' && perfil.trim().length > 0) {
        contagem.set(perfil, (contagem.get(perfil) ?? 0) + 1)
      }
    }
    if (contagem.size === 0) return 'desconhecido'
    return topN(contagem, 5)
  } catch (e) {
    console.warn('[contexto-biblioteca] perfilPublico falhou:', e)
    return 'desconhecido'
  }
}

export async function obterContextoBiblioteca(): Promise<ContextoBiblioteca> {
  const [
    etapasMaisAcessadas,
    topMateriaisAprovados,
    distribuicaoTemas,
    perfilPublico,
  ] = await Promise.all([
    buscarEtapasMaisAcessadas(),
    buscarTopMateriaisAprovados(),
    buscarDistribuicaoTemas(),
    buscarPerfilPublico(),
  ])

  return {
    etapasMaisAcessadas,
    topMateriaisAprovados,
    distribuicaoTemas,
    perfilPublico,
  }
}
