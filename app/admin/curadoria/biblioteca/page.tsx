import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { BotaoRemover } from './BotaoRemover'

type Linha = {
  slug: string
  titulo: string
  organizacao: string
  publicado_em: string
}

export const dynamic = 'force-dynamic'

export default async function BibliotecaAdminPage() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('materiais_publicados')
    .select('slug, titulo, organizacao, publicado_em')
    .order('publicado_em', { ascending: false })

  if (error) {
    return (
      <main className="container-site section-spacing">
        <h1 className="text-3xl font-bold text-redenec-petroleo">
          Biblioteca publicada
        </h1>
        <p className="mt-4 text-redenec-coral">
          Erro ao carregar materiais: {error.message}
        </p>
      </main>
    )
  }

  const linhas = (data ?? []) as Linha[]

  return (
    <main className="container-site section-spacing">
      <Link
        href="/admin/curadoria"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-redenec-petroleo/70 transition-colors hover:text-redenec-petroleo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Voltar para a fila
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold text-redenec-petroleo">
          Biblioteca publicada
        </h1>
        <p className="mt-1 text-sm text-redenec-petroleo/70">
          {linhas.length}{' '}
          {linhas.length === 1 ? 'material publicado' : 'materiais publicados'}{' '}
          via curadoria
        </p>
        <p className="mt-2 text-xs text-redenec-petroleo/50">
          Os 36 materiais originais curados pela Redenec não aparecem aqui —
          eles são fixos e não podem ser removidos pelo painel.
        </p>
      </header>

      {linhas.length === 0 ? (
        <p className="mt-10 text-sm text-redenec-petroleo/60">
          Nenhum material publicado pela curadoria até o momento.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {linhas.map((l) => (
            <li
              key={l.slug}
              className="rounded-xl border border-redenec-petroleo/10 bg-white p-4 transition hover:border-redenec-petroleo/30 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/biblioteca/${l.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-bold text-redenec-petroleo hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
                  >
                    {l.titulo}
                  </Link>
                  <p className="mt-1 truncate text-sm text-redenec-petroleo/70">
                    {l.organizacao}
                  </p>
                  <p className="mt-1 text-xs text-redenec-petroleo/50">
                    Publicado em{' '}
                    {new Date(l.publicado_em).toLocaleDateString('pt-BR')}
                    {' · '}
                    <span className="font-mono">{l.slug}</span>
                  </p>
                </div>

                <div className="shrink-0">
                  <BotaoRemover slug={l.slug} titulo={l.titulo} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
