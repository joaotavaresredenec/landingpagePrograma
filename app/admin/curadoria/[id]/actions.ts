'use server'

import { revalidatePath } from 'next/cache'
import { getSupabase } from '@/lib/supabase'
import { avaliarSubmissao } from '@/lib/curadoria/avaliar'
import {
  enviarAprovacao,
  enviarPedidoAjuste,
  enviarRejeicao,
  type SubmissaoEmail,
} from '@/lib/curadoria/emails'
import { publicarMaterial } from '@/lib/curadoria/publicar'
import type { EtapaEnsino, TipoRecurso } from '@/types/material'

export type Decisao = 'aprovar' | 'pedir_ajuste' | 'reprovar'

const STATUS_POR_DECISAO: Record<Decisao, string> = {
  aprovar: 'aprovado',
  pedir_ajuste: 'aprovado_com_ajustes',
  reprovar: 'rejeitado',
}

const FEEDBACK_OBRIGATORIO: Record<Decisao, boolean> = {
  aprovar: false,
  pedir_ajuste: true,
  reprovar: true,
}

type SubmissaoCompleta = SubmissaoEmail & {
  descricao: string | null
  tipo_recurso: string
  etapas_ensino: string[] | null
  licenca: string | null
  faixa_etaria: string | null
  alinhamento_bncc: string | null
  material_arquivo_url: string | null
}

export async function rodarAvaliacao(id: string): Promise<void> {
  try {
    await avaliarSubmissao(id)
  } catch (e) {
    console.error('[rodarAvaliacao] falhou:', e)
    throw e
  } finally {
    revalidatePath(`/admin/curadoria/${id}`)
  }
}

export async function decidirSubmissao(
  id: string,
  decisao: Decisao,
  formData: FormData,
): Promise<void> {
  const feedback = String(formData.get('feedback') ?? '').trim()

  if (FEEDBACK_OBRIGATORIO[decisao] && !feedback) {
    throw new Error(
      decisao === 'pedir_ajuste'
        ? 'Escreva o feedback ao parceiro antes de pedir ajuste.'
        : 'Escreva o feedback ao parceiro antes de reprovar.',
    )
  }

  const supabase = getSupabase()

  const { data: submissao, error: readErr } = await supabase
    .from('submissoes')
    .select(
      'titulo, organizacao_autora, ponto_focal_nome, ponto_focal_email, descricao, tipo_recurso, etapas_ensino, licenca, faixa_etaria, alinhamento_bncc, material_arquivo_url',
    )
    .eq('id', id)
    .single<SubmissaoCompleta>()

  if (readErr || !submissao) {
    console.error('[decidirSubmissao] falha ao carregar submissão:', readErr)
    throw new Error(
      `Falha ao carregar submissão: ${readErr?.message ?? 'sem retorno'}`,
    )
  }

  let publicacao: { slug: string; publicado_em: string } | null = null
  if (decisao === 'aprovar') {
    if (!submissao.material_arquivo_url) {
      throw new Error(
        'Submissão sem arquivo anexado — não é possível publicar no catálogo.',
      )
    }
    try {
      publicacao = await publicarMaterial({
        id,
        titulo: submissao.titulo,
        organizacao_autora: submissao.organizacao_autora,
        descricao: submissao.descricao ?? '',
        tipo_recurso: submissao.tipo_recurso as TipoRecurso,
        etapas_ensino: (submissao.etapas_ensino ?? []) as EtapaEnsino[],
        licenca: submissao.licenca,
        faixa_etaria: submissao.faixa_etaria,
        alinhamento_bncc: submissao.alinhamento_bncc,
        material_arquivo_url: submissao.material_arquivo_url,
      })
    } catch (e) {
      console.error(
        '[decidirSubmissao] falha ao publicar no catálogo:',
        e,
      )
      throw new Error(
        `Falha ao publicar no catálogo: ${(e as Error).message}`,
      )
    }
  }

  const updatePayload: Record<string, unknown> = {
    status: STATUS_POR_DECISAO[decisao],
    feedback_curador: feedback || null,
  }
  if (publicacao) {
    updatePayload.material_id = publicacao.slug
    updatePayload.publicado_em = publicacao.publicado_em
  }

  const { error: updateErr } = await supabase
    .from('submissoes')
    .update(updatePayload)
    .eq('id', id)

  if (updateErr) {
    console.error('[decidirSubmissao] update falhou:', updateErr)
    if (publicacao) {
      throw new Error(
        `Material publicado em materiais_publicados (slug: ${publicacao.slug}), mas falha ao registrar status na submissão: ${updateErr.message}. Reverta manualmente.`,
      )
    }
    throw new Error(`Falha ao registrar decisão: ${updateErr.message}`)
  }

  try {
    const emailPayload: SubmissaoEmail = {
      titulo: submissao.titulo,
      organizacao_autora: submissao.organizacao_autora,
      ponto_focal_nome: submissao.ponto_focal_nome,
      ponto_focal_email: submissao.ponto_focal_email,
    }
    if (decisao === 'aprovar') {
      await enviarAprovacao(emailPayload, feedback || undefined)
    } else if (decisao === 'pedir_ajuste') {
      await enviarPedidoAjuste(emailPayload, feedback)
    } else {
      await enviarRejeicao(emailPayload, feedback)
    }
  } catch (e) {
    console.error('[decidirSubmissao] envio de e-mail falhou:', e)
  }

  revalidatePath(`/admin/curadoria/${id}`)
  revalidatePath('/admin/curadoria')
  if (publicacao) {
    revalidatePath('/biblioteca')
  }
}
