'use server'

import { revalidatePath } from 'next/cache'
import { getSupabase } from '@/lib/supabase'
import { STATUS_EXCLUIVEIS } from './status'

export async function excluirSubmissao(id: string): Promise<void> {
  const supabase = getSupabase()

  const { data, error: fetchErr } = await supabase
    .from('submissoes')
    .select('status')
    .eq('id', id)
    .single<{ status: string }>()

  if (fetchErr || !data) {
    console.error('[excluirSubmissao] não encontrada:', fetchErr)
    throw new Error('Submissão não encontrada.')
  }

  if (!STATUS_EXCLUIVEIS.has(data.status)) {
    throw new Error(
      `Submissão em status "${data.status}" não pode ser excluída.`,
    )
  }

  const { error: delErr } = await supabase
    .from('submissoes')
    .delete()
    .eq('id', id)

  if (delErr) {
    console.error('[excluirSubmissao] falhou:', delErr)
    throw new Error(`Falha ao excluir: ${delErr.message}`)
  }

  revalidatePath('/admin/curadoria')
}
