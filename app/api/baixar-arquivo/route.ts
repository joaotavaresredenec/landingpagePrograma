import { NextResponse, type NextRequest } from 'next/server'
import { get } from '@vercel/blob'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim()
  if (!id) {
    return NextResponse.json({ error: 'id ausente' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('submissoes')
    .select('material_arquivo_url, titulo')
    .eq('id', id)
    .single<{ material_arquivo_url: string | null; titulo: string }>()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Submissão não encontrada' },
      { status: 404 },
    )
  }
  if (!data.material_arquivo_url) {
    return NextResponse.json(
      { error: 'Submissão sem arquivo anexado' },
      { status: 404 },
    )
  }

  let result
  try {
    result = await get(data.material_arquivo_url, { access: 'private' })
  } catch (e) {
    console.error('[baixar-arquivo] get falhou:', e)
    return NextResponse.json(
      { error: 'Falha ao buscar arquivo no storage' },
      { status: 502 },
    )
  }

  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json(
      { error: 'Arquivo não encontrado no storage' },
      { status: 404 },
    )
  }

  const extensao = result.blob.pathname.split('.').pop() || 'bin'
  const filenameBase = data.titulo
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .slice(0, 100)
  const filename = `${filenameBase}.${extensao}`

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      'Content-Length': String(result.blob.size),
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
