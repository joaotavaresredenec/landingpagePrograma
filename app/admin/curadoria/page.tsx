import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { STATUS_EXCLUIVEIS } from './status'
import { BotaoExcluir } from './BotaoExcluir'

type Status =
  | 'pendente'
  | 'em_revisao'
  | 'aprovado_com_ajustes'
  | 'aprovado'
  | 'rejeitado'

type Submissao = {
  id: string
  criado_em: string
  organizacao_autora: string
  ponto_focal_nome: string
  ponto_focal_email: string
  titulo: string
  tipo_recurso: string
  status: Status
  curador_email: string | null
}

const STATUS_ORDEM: Array<{ slug: Status; label: string }> = [
  { slug: 'pendente', label: 'Pendentes' },
  { slug: 'em_revisao', label: 'Em revisão' },
  { slug: 'aprovado_com_ajustes', label: 'Aprovados com ajustes' },
  { slug: 'aprovado', label: 'Aprovados' },
  { slug: 'rejeitado', label: 'Rejeitados' },
]

export const dynamic = 'force-dynamic'

function MetricaCard({
  label,
  valor,
  subtexto,
}: {
  label: string
  valor: string
  subtexto: string
}) {
  return (
    <div className="rounded-xl border border-redenec-petroleo/10 bg-white p-5">
      <p className="text-xs uppercase tracking-widest text-redenec-petroleo/60">
        {label}
      </p>
      <p className="mt-3 text-4xl font-bold text-redenec-petroleo">{valor}</p>
      <p className="mt-2 text-xs text-redenec-petroleo/50">{subtexto}</p>
    </div>
  )
}

export default async function CuradoriaPage() {
  const supabase = getSupabase()
  const trintaDiasAtras = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString()

  const [
    listaRes,
    totalRes,
    ultimos30Res,
    aprovadasRes,
    reprovadasRes,
    aguardandoRes,
    temposRes,
  ] = await Promise.all([
    supabase
      .from('submissoes')
      .select(
        'id, criado_em, organizacao_autora, ponto_focal_nome, ponto_focal_email, titulo, tipo_recurso, status, curador_email',
      )
      .order('criado_em', { ascending: false }),
    supabase.from('submissoes').select('*', { count: 'exact', head: true }),
    supabase
      .from('submissoes')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', trintaDiasAtras),
    supabase
      .from('submissoes')
      .select('*', { count: 'exact', head: true })
      .in('status', ['aprovado', 'aprovado_com_ajustes']),
    supabase
      .from('submissoes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejeitado'),
    supabase
      .from('submissoes')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pendente', 'em_revisao']),
    supabase
      .from('submissoes')
      .select('criado_em, avaliacao_concluida_em')
      .not('avaliacao_concluida_em', 'is', null),
  ])

  if (listaRes.error) {
    return (
      <main className="container-site section-spacing">
        <h1 className="text-3xl font-bold text-redenec-petroleo">Curadoria</h1>
        <p className="mt-4 text-redenec-coral">
          Erro ao carregar submissões: {listaRes.error.message}
        </p>
      </main>
    )
  }

  const submissoes = (listaRes.data ?? []) as Submissao[]
  const porStatus = new Map<Status, Submissao[]>()
  for (const s of submissoes) {
    const arr = porStatus.get(s.status) ?? []
    arr.push(s)
    porStatus.set(s.status, arr)
  }

  const total = totalRes.count ?? 0
  const ultimos30 = ultimos30Res.count ?? 0
  const aprovadas = aprovadasRes.count ?? 0
  const reprovadas = reprovadasRes.count ?? 0
  const aguardando = aguardandoRes.count ?? 0

  const totalDecididas = aprovadas + reprovadas
  const taxaAprovacao =
    totalDecididas > 0 ? Math.round((aprovadas / totalDecididas) * 100) : null

  const tempos = (temposRes.data ?? []) as Array<{
    criado_em: string
    avaliacao_concluida_em: string
  }>
  const tempoMedioDias =
    tempos.length > 0
      ? tempos.reduce((acc, t) => {
          const diff =
            new Date(t.avaliacao_concluida_em).getTime() -
            new Date(t.criado_em).getTime()
          return acc + diff / (1000 * 60 * 60 * 24)
        }, 0) / tempos.length
      : null

  const formatDias = (n: number) =>
    n.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' dias'

  return (
    <main className="container-site section-spacing">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-redenec-petroleo">
            Fila de curadoria
          </h1>
          <p className="mt-1 text-sm text-redenec-petroleo/70">
            {submissoes.length} submissões no total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/admin/curadoria/arquivos"
            className="text-sm font-bold text-redenec-petroleo hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          >
            Ver todos os arquivos enviados →
          </Link>
          <Link
            href="/admin/curadoria/biblioteca"
            className="text-sm font-bold text-redenec-petroleo hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          >
            Gerenciar biblioteca →
          </Link>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricaCard
          label="Total de submissões"
          valor={total.toLocaleString('pt-BR')}
          subtexto={`${ultimos30.toLocaleString('pt-BR')} nos últimos 30 dias`}
        />
        <MetricaCard
          label="Taxa de aprovação"
          valor={taxaAprovacao !== null ? `${taxaAprovacao}%` : '—'}
          subtexto={`${aprovadas.toLocaleString('pt-BR')} aprovadas · ${reprovadas.toLocaleString('pt-BR')} reprovadas`}
        />
        <MetricaCard
          label="Aguardando você"
          valor={aguardando.toLocaleString('pt-BR')}
          subtexto="submissões na fila"
        />
        <MetricaCard
          label="Tempo médio de curadoria"
          valor={tempoMedioDias !== null ? formatDias(tempoMedioDias) : '—'}
          subtexto="do recebimento à decisão"
        />
      </section>

      <div className="mt-12 space-y-12">
        {STATUS_ORDEM.map(({ slug, label }) => {
          const items = porStatus.get(slug) ?? []
          return (
            <section key={slug}>
              <h2 className="text-xl font-bold text-redenec-petroleo">
                {label}{' '}
                <span className="text-redenec-petroleo/50">({items.length})</span>
              </h2>

              {items.length === 0 ? (
                <p className="mt-3 text-sm text-redenec-petroleo/50">
                  Nenhuma submissão.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="relative rounded-xl border border-redenec-petroleo/10 bg-white transition hover:border-redenec-petroleo/30 hover:shadow-sm"
                    >
                      <Link
                        href={`/admin/curadoria/${s.id}`}
                        className="block cursor-pointer rounded-xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 pr-8">
                            <h3 className="truncate font-bold text-redenec-petroleo">
                              {s.titulo}
                            </h3>
                            <p className="truncate text-sm text-redenec-petroleo/70">
                              {s.organizacao_autora} · {s.tipo_recurso}
                            </p>
                            <p className="mt-1 text-xs text-redenec-petroleo/50">
                              {s.ponto_focal_nome} &lt;{s.ponto_focal_email}&gt;
                            </p>
                          </div>
                          <div className="shrink-0 text-right text-xs text-redenec-petroleo/50">
                            {new Date(s.criado_em).toLocaleDateString('pt-BR')}
                            {s.curador_email && (
                              <div className="mt-1">curador: {s.curador_email}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                      {STATUS_EXCLUIVEIS.has(s.status) && (
                        <div className="absolute right-2 top-2">
                          <BotaoExcluir id={s.id} titulo={s.titulo} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </main>
  )
}
