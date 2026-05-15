import { NextResponse, type NextRequest } from 'next/server'
import { get } from '@vercel/blob'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')?.trim()
  if (!slug) {
    return NextResponse.json({ error: 'slug ausente' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('materiais_publicados')
    .select('link_principal, titulo')
    .eq('slug', slug)
    .single<{ link_principal: string; titulo: string }>()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Material não encontrado' },
      { status: 404 },
    )
  }

  let result
  try {
    result = await get(data.link_principal, { access: 'private' })
  } catch (e) {
    console.error('[material-arquivo] get falhou:', e)
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
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
