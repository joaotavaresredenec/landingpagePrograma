import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'redenec_sessao'
const TTL_DIAS = 30
const TTL_SEGUNDOS = TTL_DIAS * 24 * 60 * 60

export type DadosSessao = {
  email: string
  nome: string
  perfil: string
  criadoEm: string
}

const getSecret = () =>
  new TextEncoder().encode(process.env.MAGIC_LINK_SECRET!)

export async function criarSessao(dados: DadosSessao): Promise<void> {
  const token = await new SignJWT({ ...dados })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_DIAS}d`)
    .sign(getSecret())

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TTL_SEGUNDOS,
    path: '/',
  })
}

export async function obterSessao(): Promise<DadosSessao | null> {
  const cookie = cookies().get(COOKIE_NAME)
  if (!cookie) return null

  try {
    const { payload } = await jwtVerify(cookie.value, getSecret())
    return {
      email: String(payload.email ?? ''),
      nome: String(payload.nome ?? ''),
      perfil: String(payload.perfil ?? ''),
      criadoEm: String(payload.criadoEm ?? ''),
    }
  } catch {
    return null
  }
}

export async function encerrarSessao(): Promise<void> {
  cookies().delete(COOKIE_NAME)
}
