import { NextResponse, type NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const STATUS_VALIDOS = [
  'pendente',
  'em_revisao',
  'aprovado_com_ajustes',
  'aprovado',
  'rejeitado',
] as const
type Status = (typeof STATUS_VALIDOS)[number]

const STATUS_LABEL: Record<Status, string> = {
  pendente: 'Pendente',
  em_revisao: 'Em revisão',
  aprovado_com_ajustes: 'Aprovado com ajustes',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
}

const COLUNAS = [
  'Data',
  'Título',
  'Organização',
  'Ponto focal',
  'E-mail',
  'Link do arquivo',
  'Status',
]

function escapeCsv(value: string): string {
  const needsQuotes = /[",\n\r]/.test(value)
  const escaped = value.replace(/"/g, '""')
  return needsQuotes ? `"${escaped}"` : escaped
}

export async function GET(req: NextRequest) {
  const statusParam = req.nextUrl.searchParams.get('status')
  const statusFiltro =
    statusParam &&
    (STATUS_VALIDOS as readonly string[]).includes(statusParam)
      ? (statusParam as Status)
      : null

  const supabase = getSupabase()
  let query = supabase
    .from('submissoes')
    .select(
      'id, criado_em, titulo, organizacao_autora, ponto_focal_nome, ponto_focal_email, status',
    )
    .not('material_arquivo_url', 'is', null)
    .order('criado_em', { ascending: false })

  if (statusFiltro) query = query.eq('status', statusFiltro)

  const { data, error } = await query

  if (error) {
    return new NextResponse(`Erro ao gerar CSV: ${error.message}`, {
      status: 500,
    })
  }

  const linhas = (data ?? []) as Array<{
    id: string
    criado_em: string
    titulo: string
    organizacao_autora: string
    ponto_focal_nome: string
    ponto_focal_email: string
    status: Status
  }>

  const origin = req.nextUrl.origin
  const corpo = linhas.map((l) =>
    [
      new Date(l.criado_em).toISOString().slice(0, 10),
      l.titulo,
      l.organizacao_autora,
      l.ponto_focal_nome,
      l.ponto_focal_email,
      `${origin}/api/baixar-arquivo?id=${l.id}`,
      STATUS_LABEL[l.status],
    ]
      .map(escapeCsv)
      .join(','),
  )

  const csv = '﻿' + [COLUNAS.join(','), ...corpo].join('\n')

  const dataStr = new Date().toISOString().slice(0, 10)
  const sufixo = statusFiltro ? `-${statusFiltro}` : ''
  const filename = `arquivos-curadoria${sufixo}-${dataStr}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
