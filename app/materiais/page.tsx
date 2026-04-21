import { redirect } from 'next/navigation'
import { validateToken } from '@/lib/magic-link'
import { BibliotecaCompleta } from '@/components/sections/BibliotecaCompleta'

export const metadata = {
  title: 'Materiais e orientações — Programa Educação para a Cidadania e Sustentabilidade',
  robots: { index: false, follow: false },
}

export default async function MateriaisPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }> | { token?: string }
}) {
  const params =
    typeof (searchParams as any)?.then === 'function'
      ? await (searchParams as Promise<{ token?: string }>)
      : (searchParams as { token?: string })

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    return <BibliotecaCompleta nomeUsuario="Visualização local" />
  }

  const token = params.token

  if (!token) {
    redirect('/#formulario')
  }

  const session = await validateToken(token)

  if (!session) {
    redirect('/?erro=token_invalido#formulario')
  }

  return <BibliotecaCompleta nomeUsuario={session.nome} />
}
