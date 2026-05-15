import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'redenec_admin'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8

async function login(formData: FormData) {
  'use server'

  const secret = process.env.ADMIN_SECRET
  if (!secret) throw new Error('ADMIN_SECRET não configurado')

  const senha = formData.get('senha')
  if (typeof senha !== 'string') redirect('/admin/login?erro=1')

  const provided = createHash('sha256').update(senha).digest()
  const expected = createHash('sha256').update(secret).digest()
  if (!timingSafeEqual(provided, expected)) redirect('/admin/login?erro=1')

  const expiresStr = String(Date.now() + SESSION_DURATION_MS)
  const sig = createHmac('sha256', secret).update(expiresStr).digest('base64url')

  cookies().set(COOKIE_NAME, `${expiresStr}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  })

  redirect('/admin/curadoria')
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { erro?: string }
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-redenec-cinza px-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-redenec-petroleo">Curadoria Redenec</h1>
          <p className="mt-1 text-sm text-redenec-petroleo/70">
            Acesso restrito à equipe de curadoria.
          </p>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-redenec-petroleo">Senha</span>
          <input
            type="password"
            name="senha"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-1 block w-full rounded-lg border border-redenec-petroleo/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-redenec-verde"
          />
        </label>

        {searchParams.erro && (
          <p className="text-sm text-redenec-coral">Senha inválida.</p>
        )}

        <button type="submit" className="btn-primary w-full">
          Entrar
        </button>
      </form>
    </main>
  )
}
