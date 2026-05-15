import Link from 'next/link'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'

type Status =
  | 'pendente'
  | 'em_revisao'
  | 'aprovado_com_ajustes'
  | 'aprovado'
  | 'rejeitado'

type Linha = {
  id: string
  criado_em: string
  titulo: string
  organizacao_autora: string
  ponto_focal_nome: string
  ponto_focal_email: string
  material_arquivo_url: string
  status: Status
}

const STATUS_VALIDOS: Status[] = [
  'pendente',
  'em_revisao',
  'aprovado_com_ajustes',
  'aprovado',
  'rejeitado',
]

const STATUS_LABEL: Record<Status, string> = {
  pendente: 'Pendente',
  em_revisao: 'Em revisão',
  aprovado_com_ajustes: 'Aprovado com ajustes',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
}

const STATUS_BADGE: Record<Status, string> = {
  pendente: 'border-amber-200 bg-amber-50 text-amber-800',
  em_revisao: 'border-redenec-azul/30 bg-redenec-azul/10 text-redenec-azul',
  aprovado_com_ajustes:
    'border-redenec-verde/40 bg-redenec-verde/20 text-redenec-petroleo',
  aprovado:
    'border-redenec-verde/60 bg-redenec-verde/30 text-redenec-petroleo',
  rejeitado:
    'border-redenec-coral/40 bg-redenec-coral/15 text-redenec-petroleo',
}

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { status?: string }
}

export default async function ArquivosPage({ searchParams }: Props) {
  const statusParam = searchParams?.status
  const statusFiltro = (STATUS_VALIDOS as string[]).includes(statusParam ?? '')
    ? (statusParam as Status)
    : null

  const supabase = getSupabase()
  let query = supabase
    .from('submissoes')
    .select(
      'id, criado_em, titulo, organizacao_autora, ponto_focal_nome, ponto_focal_email, material_arquivo_url, status',
    )
    .not('material_arquivo_url', 'is', null)
    .order('criado_em', { ascending: false })

  if (statusFiltro) query = query.eq('status', statusFiltro)

  const { data, error } = await query

  if (error) {
    return (
      <main className="container-site section-spacing">
        <h1 className="text-3xl font-bold text-redenec-petroleo">
          Arquivos enviados
        </h1>
        <p className="mt-4 text-redenec-coral">
          Erro ao carregar arquivos: {error.message}
        </p>
      </main>
    )
  }

  const linhas = (data ?? []) as Linha[]
  const exportHref = statusFiltro
    ? `/admin/curadoria/arquivos/export?status=${statusFiltro}`
    : '/admin/curadoria/arquivos/export'

  return (
    <main className="container-site section-spacing">
      <Link
        href="/admin/curadoria"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-redenec-petroleo/70 transition-colors hover:text-redenec-petroleo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Voltar para a fila
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-redenec-petroleo">
            Arquivos enviados
          </h1>
          <p className="mt-1 text-sm text-redenec-petroleo/70">
            {linhas.length} submissões com arquivo anexado
            {statusFiltro && ` · status: ${STATUS_LABEL[statusFiltro]}`}
          </p>
        </div>

        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-pill border border-redenec-petroleo bg-white px-5 py-2.5 text-sm font-bold text-redenec-petroleo transition-colors hover:bg-redenec-petroleo hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
        >
          <Download size={16} aria-hidden="true" />
          Exportar lista em CSV
        </a>
      </header>

      <form
        method="GET"
        className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-redenec-petroleo/10 bg-white p-4"
      >
        <label
          htmlFor="status"
          className="text-xs font-bold uppercase tracking-widest text-redenec-petroleo/60"
        >
          Filtrar por status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={statusFiltro ?? ''}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-redenec-petroleo focus:outline-none focus:ring-2 focus:ring-redenec-verde"
        >
          <option value="">Todos</option>
          {STATUS_VALIDOS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-pill bg-redenec-petroleo px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-redenec-petroleo/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
        >
          Aplicar
        </button>
      </form>

      {linhas.length === 0 ? (
        <p className="mt-10 text-sm text-redenec-petroleo/60">
          Nenhuma submissão com arquivo anexado
          {statusFiltro
            ? ` para o status "${STATUS_LABEL[statusFiltro]}"`
            : ''}
          .
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {linhas.map((l) => (
            <li
              key={l.id}
              className="rounded-xl border border-redenec-petroleo/10 bg-white p-4 transition hover:border-redenec-petroleo/30 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/curadoria/${l.id}`}
                    className="block truncate font-bold text-redenec-petroleo hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
                  >
                    {l.titulo}
                  </Link>
                  <p className="mt-1 truncate text-sm text-redenec-petroleo/70">
                    {l.organizacao_autora}
                  </p>
                  <p className="mt-1 text-xs text-redenec-petroleo/50">
                    {new Date(l.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_BADGE[l.status]}`}
                  >
                    {STATUS_LABEL[l.status]}
                  </span>
                  <a
                    href={`/api/baixar-arquivo?id=${l.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-pill border border-redenec-petroleo/30 px-4 py-2 text-xs font-bold text-redenec-petroleo transition-colors hover:border-redenec-petroleo hover:bg-redenec-petroleo hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
                  >
                    Baixar arquivo
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
