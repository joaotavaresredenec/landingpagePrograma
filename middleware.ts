import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'redenec_admin'

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const buffer = new ArrayBuffer(binary.length)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const [expiresStr, signature] = token.split('.')
  if (!expiresStr || !signature) return false

  const expires = Number(expiresStr)
  if (!Number.isFinite(expires) || expires < Date.now()) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  return crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlDecode(signature),
    new TextEncoder().encode(expiresStr),
  )
}

export async function middleware(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    return new NextResponse('ADMIN_SECRET não configurado', { status: 500 })
  }

  const token = req.cookies.get(COOKIE_NAME)?.value
  const valid = token ? await verifyToken(token, secret) : false

  if (!valid) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/curadoria/:path*', '/api/baixar-arquivo/:path*'],
}
