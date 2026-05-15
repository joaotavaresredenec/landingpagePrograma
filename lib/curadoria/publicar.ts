import { getSupabase } from '@/lib/supabase'
import { LICENCAS, type Licenca } from '@/config/licencas'
import type { EtapaEnsino, TipoRecurso } from '@/types/material'

export type SubmissaoParaPublicar = {
  id: string
  titulo: string
  organizacao_autora: string
  descricao: string
  tipo_recurso: TipoRecurso
  etapas_ensino: EtapaEnsino[]
  licenca: string | null
  faixa_etaria: string | null
  alinhamento_bncc: string | null
  material_arquivo_url: string
}

function kebab(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function gerarSlug(
  titulo: string,
  organizacao: string,
  slugsExistentes: Set<string>,
  fallbackId: string,
): string {
  const partes = [kebab(organizacao), kebab(titulo)].filter(Boolean)
  const base = partes.join('-') || fallbackId
  if (!slugsExistentes.has(base)) return base
  let i = 2
  while (slugsExistentes.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}

function resumir(texto: string, max = 220): string {
  if (texto.length <= max) return texto
  return texto.slice(0, max - 1).trimEnd() + '…'
}

function resolverLicencaLabel(slugOrText: string | null): string {
  if (!slugOrText) return ''
  if (slugOrText in LICENCAS) return LICENCAS[slugOrText as Licenca].label
  return slugOrText
}

export async function publicarMaterial(
  s: SubmissaoParaPublicar,
): Promise<{ slug: string; publicado_em: string }> {
  const supabase = getSupabase()

  const { data: existentes, error: readErr } = await supabase
    .from('materiais_publicados')
    .select('slug')

  if (readErr) {
    throw new Error(
      `Falha ao consultar slugs existentes: ${readErr.message}`,
    )
  }

  const slugsExistentes = new Set(
    (existentes ?? []).map((r) => r.slug as string),
  )
  const slug = gerarSlug(s.titulo, s.organizacao_autora, slugsExistentes, s.id)

  const { data: inserido, error: insertErr } = await supabase
    .from('materiais_publicados')
    .insert({
      slug,
      submissao_id: s.id,
      titulo: s.titulo,
      titulo_editorial: s.titulo,
      organizacao: s.organizacao_autora,
      descricao: s.descricao,
      descricao_card: resumir(s.descricao),
      sinopse: '',
      pontos_chave: [],
      tipo: s.tipo_recurso,
      formato: '',
      etapas: s.etapas_ensino,
      temas: [],
      licenca: resolverLicencaLabel(s.licenca),
      licenca_slug: s.licenca,
      faixa_etaria: s.faixa_etaria,
      alinhamento_bncc: s.alinhamento_bncc,
      link_principal: s.material_arquivo_url,
      links_extras: [],
      recomendacao: 'incluir',
      observacoes_curador: '',
    })
    .select('slug, publicado_em')
    .single<{ slug: string; publicado_em: string }>()

  if (insertErr || !inserido) {
    throw new Error(
      `Falha ao publicar material: ${insertErr?.message ?? 'sem retorno'}`,
    )
  }

  return { slug: inserido.slug, publicado_em: inserido.publicado_em }
}
