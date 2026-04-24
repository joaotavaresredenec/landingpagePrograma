import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'redenec_mapa'

const getSecret = () =>
  new TextEncoder().encode(
    process.env.MAPA_COOKIE_SECRET || process.env.MAGIC_LINK_SECRET!
  )

export async function criarSessaoMapa(): Promise<void> {
  const token = await new SignJWT({ autorizado: true, tipo: 'mapa' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret())

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    // Sem maxAge nem expires → cookie de sessão: apagado ao fechar o browser
    path: '/',
  })
}

export async function temSessaoMapa(): Promise<boolean> {
  const cookie = cookies().get(COOKIE_NAME)
  if (!cookie) return false

  try {
    const { payload } = await jwtVerify(cookie.value, getSecret())
    return payload.tipo === 'mapa' && payload.autorizado === true
  } catch {
    return false
  }
}

export async function encerrarSessaoMapa(): Promise<void> {
  cookies().delete(COOKIE_NAME)
}
