import 'server-only'
import materialsData from '@/config/materials.json'
import { getSupabase } from '@/lib/supabase'
import type {
  EtapaEnsino,
  Material,
  MaterialLink,
  Recomendacao,
  TemaBNCC,
  TipoRecurso,
} from '@/types/material'

const ESTATICOS = materialsData as Material[]

const SELECT_COLS =
  'slug, titulo, titulo_editorial, organizacao, descricao, descricao_card, sinopse, pontos_chave, tipo, formato, etapas, temas, licenca, links_extras, link_principal, recomendacao, observacoes_curador, publicado_em'

type LinhaPublicado = {
  slug: string
  titulo: string
  titulo_editorial: string
  organizacao: string
  descricao: string
  descricao_card: string
  sinopse: string
  pontos_chave: string[] | null
  tipo: string
  formato: string
  etapas: string[] | null
  temas: string[] | null
  licenca: string
  links_extras: MaterialLink[] | null
  link_principal: string
  recomendacao: string
  observacoes_curador: string
  publicado_em: string
}

function mapLinha(l: LinhaPublicado): Material {
  const linkPrincipal: MaterialLink = {
    rotulo: 'Acessar',
    url: `/api/material-arquivo?slug=${encodeURIComponent(l.slug)}`,
    tipo: 'url',
  }
  return {
    id: l.slug,
    titulo: l.titulo,
    tituloEditorial: l.titulo_editorial,
    organizacao: l.organizacao,
    descricao: l.descricao,
    descricaoCard: l.descricao_card,
    sinopse: l.sinopse,
    pontosChave: l.pontos_chave ?? [],
    tipo: l.tipo as TipoRecurso,
    formato: l.formato,
    etapas: (l.etapas ?? []) as EtapaEnsino[],
    temas: (l.temas ?? []) as TemaBNCC[],
    licenca: l.licenca,
    links: [linkPrincipal, ...(l.links_extras ?? [])],
    recomendacao: (l.recomendacao || 'incluir') as Recomendacao,
    observacoesCurador: l.observacoes_curador,
  }
}

async function fetchPublicados(): Promise<Material[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('materiais_publicados')
      .select(SELECT_COLS)
      .order('publicado_em', { ascending: false })

    if (error) {
      console.error('[getMateriais] supabase select error:', error)
      return []
    }
    return ((data ?? []) as LinhaPublicado[]).map(mapLinha)
  } catch (e) {
    console.error('[getMateriais] inesperado:', e)
    return []
  }
}

export async function getMateriais(): Promise<Material[]> {
  const publicados = await fetchPublicados()
  return [...publicados, ...ESTATICOS]
}

export async function getMaterial(
  slug: string,
): Promise<Material | undefined> {
  const estatico = ESTATICOS.find((m) => m.id === slug)
  if (estatico) return estatico

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('materiais_publicados')
      .select(SELECT_COLS)
      .eq('slug', slug)
      .maybeSingle<LinhaPublicado>()

    if (error) {
      console.error('[getMaterial] supabase select error:', error)
      return undefined
    }
    return data ? mapLinha(data) : undefined
  } catch (e) {
    console.error('[getMaterial] inesperado:', e)
    return undefined
  }
}
