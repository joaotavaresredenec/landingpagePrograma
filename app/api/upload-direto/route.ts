import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
]
// Limite efetivo do server: a Vercel rejeita bodies >4.5 MB antes de chegar aqui.
const MAX_SIZE_BYTES = 4 * 1024 * 1024

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[upload-direto] BLOB_READ_WRITE_TOKEN ausente')
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN não configurado no servidor.' },
      { status: 500 },
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch (e) {
    console.error('[upload-direto] formData parse falhou:', e)
    return NextResponse.json(
      { error: 'Não foi possível ler o arquivo enviado.' },
      { status: 400 },
    )
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Campo "file" ausente ou inválido.' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'O arquivo precisa ter no máximo 4 MB.' },
      { status: 413 },
    )
  }

  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Tipo de arquivo não permitido: ${file.type || 'desconhecido'}` },
      { status: 415 },
    )
  }

  const timestamp = Date.now()
  const extensao = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const nomeBase =
    file.name
      .substring(0, file.name.lastIndexOf('.') || file.name.length)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50)
      .toLowerCase() || 'arquivo'
  const pathname = `submissoes/${timestamp}-${nomeBase}.${extensao}`

  try {
    const blob = await put(pathname, file, {
      access: 'private',
      addRandomSuffix: true,
      contentType: file.type,
    })
    console.log('[upload-direto] sucesso', {
      pathname: blob.pathname,
      size: file.size,
      contentType: file.type,
    })
    return NextResponse.json({ url: blob.url, pathname: blob.pathname })
  } catch (e) {
    const err = e as Error
    console.error('[upload-direto] put falhou:', {
      name: err?.name,
      message: err?.message,
    })
    return NextResponse.json(
      { error: err?.message ?? 'Falha ao enviar para o storage.' },
      { status: 500 },
    )
  }
}
