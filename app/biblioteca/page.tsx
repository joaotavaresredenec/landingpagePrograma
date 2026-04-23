import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { validateToken } from '@/lib/magic-link'
import { criarSessao, obterSessao } from '@/lib/sessao'
import { AreaRestrita } from '@/components/auth/AreaRestrita'
import { BibliotecaCompleta } from '@/components/sections/BibliotecaCompleta'

export const metadata: Metadata = {
  title: 'Biblioteca Nacional de Educação Cidadã | Redenec',
  description:
    'Biblioteca com 36 materiais pedagógicos curados pela Redenec para apoiar a implementação do Programa Educação para a Cidadania e Sustentabilidade (PECS) — Portaria MEC nº 642/2025.',
  alternates: { canonical: 'https://cidadaniaesustentabilidade.com.br/biblioteca' },
  robots: { index: false, follow: false },
}

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }> | { token?: string }
}) {
  const params =
    typeof (searchParams as any)?.then === 'function'
      ? await (searchParams as Promise<{ token?: string }>)
      : (searchParams as { token?: string })

  // 1. Magic link do e-mail (?token=X): valida, cria cookie, redireciona para URL limpa
  if (params.token) {
    try {
      const sessaoMagicLink = await validateToken(params.token)
      if (sessaoMagicLink) {
        await criarSessao({
          email: sessaoMagicLink.email,
          nome: sessaoMagicLink.nome,
          perfil: sessaoMagicLink.perfil,
          criadoEm: sessaoMagicLink.createdAt,
        })
        redirect('/biblioteca')
      }
    } catch (err: any) {
      // redirect() joga um "NEXT_REDIRECT" — não capturar
      if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err
      console.error('[/biblioteca] Token de magic link inválido:', err)
    }
  }

  // 2. Verificar cookie de sessão
  const sessao = await obterSessao()

  // 3. Sem sessão: formulário inline
  if (!sessao) {
    return (
      <AreaRestrita
        titulo="Biblioteca Nacional de Educação Cidadã"
        descricao="36 materiais pedagógicos curados pela Redenec para apoiar a implementação do Programa Educação para a Cidadania e Sustentabilidade nas redes de ensino."
        icone={BookOpen}
        origem="biblioteca"
      />
    )
  }

  // 4. Autenticado: biblioteca completa
  return <BibliotecaCompleta nomeUsuario={sessao.nome} />
}
