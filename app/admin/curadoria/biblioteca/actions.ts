'use server'

import { revalidatePath } from 'next/cache'
import { getSupabase } from '@/lib/supabase'

export async function removerMaterialPublicado(slug: string): Promise<void> {
  if (!slug) {
    throw new Error('Slug obrigatório.')
  }

  const supabase = getSupabase()

  const { data: material, error: readErr } = await supabase
    .from('materiais_publicados')
    .select('slug, submissao_id')
    .eq('slug', slug)
    .maybeSingle<{ slug: string; submissao_id: string | null }>()

  if (readErr) {
    console.error('[removerMaterialPublicado] falha ao ler material:', readErr)
    throw new Error(`Falha ao ler material: ${readErr.message}`)
  }
  if (!material) {
    throw new Error('Material não encontrado (talvez já removido).')
  }

  const { error: delErr } = await supabase
    .from('materiais_publicados')
    .delete()
    .eq('slug', slug)

  if (delErr) {
    console.error('[removerMaterialPublicado] falha ao deletar:', delErr)
    throw new Error(`Falha ao remover material: ${delErr.message}`)
  }

  if (material.submissao_id) {
    const { error: updErr } = await supabase
      .from('submissoes')
      .update({ material_id: null, publicado_em: null })
      .eq('id', material.submissao_id)

    if (updErr) {
      console.error(
        '[removerMaterialPublicado] material removido mas falha ao limpar submissão:',
        updErr,
      )
    }
  }

  revalidatePath('/biblioteca')
  revalidatePath('/admin/curadoria/biblioteca')
}
