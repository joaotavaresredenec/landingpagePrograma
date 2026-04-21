import crypto from 'crypto'
import { kv } from './kv'

const TTL_SECONDS = 30 * 24 * 60 * 60 // 30 dias

export type MagicLinkSession = {
  email: string
  nome: string
  perfil: string
  createdAt: string
}

export function generateToken(): string {
  const uuid = crypto.randomUUID()
  const hmac = crypto
    .createHmac('sha256', process.env.MAGIC_LINK_SECRET!)
    .update(uuid)
    .digest('hex')
    .slice(0, 16)
  return `${uuid}.${hmac}`
}

export async function storeToken(token: string, session: MagicLinkSession): Promise<void> {
  await kv.set(`magic:${token}`, session, { ex: TTL_SECONDS })
}

export async function validateToken(token: string): Promise<MagicLinkSession | null> {
  if (!token || !token.includes('.')) return null

  const [uuid, hmac] = token.split('.')
  if (!uuid || !hmac) return null

  const expectedHmac = crypto
    .createHmac('sha256', process.env.MAGIC_LINK_SECRET!)
    .update(uuid)
    .digest('hex')
    .slice(0, 16)

  if (hmac !== expectedHmac) return null

  const session = await kv.get<MagicLinkSession>(`magic:${token}`)
  return session ?? null
}
