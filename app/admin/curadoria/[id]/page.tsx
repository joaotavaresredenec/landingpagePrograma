import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import {
  CRITERIOS,
  type DefinicaoCriterio,
  type ResultadoCriterio,
} from '@/lib/curadoria/criterios'
import type {
  AvaliacaoCriterio,
  AvaliacaoSubmissao,
} from '@/lib/curadoria/avaliar'
import { rodarAvaliacao, decidirSubmissao } from './actions'

export const dynamic = 'force-dynamic'

type Submissao = {
  id: string
  criado_em: string
  organizacao_autora: string
  ponto_focal_nome: string
  ponto_focal_email: string
  titulo: string
  descricao: string | null
  tipo_recurso: string
  etapas_ensino: string[] | null
  temas_bncc: string[] | null
  licenca: string | null
  faixa_etaria: string | null
  status: string
  curador_email: string | null
  feedback_curador: string | null
  criterios: AvaliacaoSubmissao | null
  recomendacao: string | null
  avaliacao_concluida_em: string | null
}

const RESULTADO_VISUAL: Record<
  ResultadoCriterio,
  { icone: string; label: string; classe: string }
> = {
  completo: { icone: '✅', label: 'Completo', classe: 'bg-green-50 border-green-200 text-green-900' },
  satisfatorio: { icone: '⚠️', label: 'Satisfatório', classe: 'bg-amber-50 border-amber-200 text-amber-900' },
  insuficiente: { icone: '❌', label: 'Insuficiente', classe: 'bg-red-50 border-red-200 text-red-900' },
}

const RECOMENDACAO_VISUAL: Record<string, { label: string; classe: string }> = {
  incluir: { label: 'Incluir', classe: 'bg-green-100 text-green-900 border-green-300' },
  incluir_ressalvas: { label: 'Incluir com ressalvas', classe: 'bg-amber-100 text-amber-900 border-amber-300' },
  nao_incluir: { label: 'Não incluir', classe: 'bg-red-100 text-red-900 border-red-300' },
}

export default async function DetalheSubmissao({
  params,
}: {
  params: { id: string }
}) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('submissoes')
    .select('*')
    .eq('id', params.id)
    .single<Submissao>()

  if (error || !data) notFound()

  const s = data
  const avaliacao = s.criterios
  const criteriosNaoFit = CRITERIOS.filter((c) => c.slug !== 'fit_biblioteca')
  const fit = CRITERIOS.find((c) => c.slug === 'fit_biblioteca')!
  const avaliacaoFit = avaliacao?.criterios.find((c) => c.slug === 'fit_biblioteca')

  const rodarAvaliacaoBound = rodarAvaliacao.bind(null, s.id)
  const aprovar = decidirSubmissao.bind(null, s.id, 'aprovar')
  const pedirAjuste = decidirSubmissao.bind(null, s.id, 'pedir_ajuste')
  const reprovar = decidirSubmissao.bind(null, s.id, 'reprovar')

  return (
    <main className="container-site section-spacing space-y-10">
      <Link
        href="/admin/curadoria"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-redenec-petroleo/70 hover:text-redenec-petroleo"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Voltar para a fila
      </Link>

      <header>
        <p className="text-xs uppercase tracking-widest text-redenec-petroleo/50">
          {s.organizacao_autora}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-redenec-petroleo">{s.titulo}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-redenec-petroleo/70">
          <Pill>{s.tipo_recurso}</Pill>
          <Pill>status: {s.status}</Pill>
          <Pill>recebido em {new Date(s.criado_em).toLocaleDateString('pt-BR')}</Pill>
          {s.curador_email && <Pill>curador: {s.curador_email}</Pill>}
        </div>
      </header>

      <section className="grid gap-6 rounded-2xl border border-redenec-petroleo/10 bg-white p-6 sm:grid-cols-2">
        <Bloco titulo="Ponto focal">
          <p>{s.ponto_focal_nome}</p>
          <p className="text-redenec-petroleo/60">{s.ponto_focal_email}</p>
        </Bloco>
        <Bloco titulo="Organização">
          <p>{s.organizacao_autora}</p>
        </Bloco>
        <Bloco titulo="Etapas de ensino">
          <p>{(s.etapas_ensino ?? []).join(', ') || '—'}</p>
        </Bloco>
        <Bloco titulo="Eixo / temas BNCC">
          <p>{(s.temas_bncc ?? []).join(', ') || '—'}</p>
        </Bloco>
        <Bloco titulo="Faixa etária">
          <p>{s.faixa_etaria ?? '—'}</p>
        </Bloco>
        <Bloco titulo="Licença">
          <p>{s.licenca ?? '—'}</p>
        </Bloco>
        <div className="sm:col-span-2">
          <Bloco titulo="Descrição">
            <p className="whitespace-pre-wrap text-redenec-petroleo/80">
              {s.descricao ?? '—'}
            </p>
          </Bloco>
        </div>
      </section>

      <section className="rounded-2xl border border-redenec-petroleo/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-redenec-petroleo">
              Avaliação automática
            </h2>
            <p className="mt-1 text-sm text-redenec-petroleo/60">
              {avaliacao && s.avaliacao_concluida_em
                ? `Concluída em ${new Date(s.avaliacao_concluida_em).toLocaleString('pt-BR')}`
                : 'Não executada ainda.'}
            </p>
          </div>
          <form action={rodarAvaliacaoBound}>
            <button
              type="submit"
              className="rounded-pill bg-redenec-petroleo px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-redenec-petroleo/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
            >
              {avaliacao ? 'Reexecutar avaliação' : 'Rodar avaliação automática'}
            </button>
          </form>
        </div>

        {avaliacao && (
          <div className="mt-8 space-y-8">
            <BadgeRecomendacao recomendacao={avaliacao.recomendacao} />

            {avaliacaoFit && (
              <FitDestaque criterio={fit} avaliacao={avaliacaoFit} />
            )}

            <ScoreCard
              criterios={criteriosNaoFit}
              avaliacoes={avaliacao.criterios.filter((c) => c.slug !== 'fit_biblioteca')}
            />

            {avaliacao.justificativa_geral && (
              <Bloco titulo="Justificativa geral">
                <p>{avaliacao.justificativa_geral}</p>
              </Bloco>
            )}

            {avaliacao.pontos_atencao.length > 0 && (
              <Bloco titulo="Pontos de atenção">
                <ul className="list-disc space-y-1 pl-5">
                  {avaliacao.pontos_atencao.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </Bloco>
            )}

            {avaliacao.sugestoes_ao_parceiro && (
              <div className="rounded-xl border border-redenec-verde/30 bg-redenec-verde/10 p-4 text-sm text-redenec-petroleo">
                <p className="font-bold">Sugestões ao parceiro</p>
                <p className="mt-1">{avaliacao.sugestoes_ao_parceiro}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-redenec-petroleo/10 bg-white p-6">
        <h2 className="text-lg font-bold text-redenec-petroleo">Decisão do curador</h2>
        <p className="mt-1 text-sm text-redenec-petroleo/60">
          O feedback abaixo será armazenado em <code>feedback_curador</code> e usado
          no e-mail ao parceiro.
        </p>

        <form className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-redenec-petroleo">
              Feedback ao parceiro
            </span>
            <textarea
              name="feedback"
              rows={6}
              defaultValue={s.feedback_curador ?? ''}
              placeholder="Mensagem que será enviada ao parceiro junto com a decisão…"
              className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-redenec-verde"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              formAction={aprovar}
              className="rounded-pill bg-redenec-verde px-5 py-2.5 text-sm font-bold text-redenec-escuro transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-petroleo"
            >
              ✅ Aprovar
            </button>
            <button
              formAction={pedirAjuste}
              className="rounded-pill bg-amber-100 px-5 py-2.5 text-sm font-bold text-amber-900 transition-colors hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              🔄 Pedir ajuste
            </button>
            <button
              formAction={reprovar}
              className="rounded-pill bg-red-100 px-5 py-2.5 text-sm font-bold text-red-900 transition-colors hover:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              ❌ Reprovar
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-redenec-cinza/60 px-2.5 py-0.5">{children}</span>
  )
}

function Bloco({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-redenec-petroleo/50">
        {titulo}
      </p>
      <div className="mt-1.5 text-sm text-redenec-petroleo">{children}</div>
    </div>
  )
}

function BadgeRecomendacao({ recomendacao }: { recomendacao: string }) {
  const visual = RECOMENDACAO_VISUAL[recomendacao]
  if (!visual) return null
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${visual.classe}`}
    >
      Recomendação automática: {visual.label}
    </div>
  )
}

function FitDestaque({
  criterio,
  avaliacao,
}: {
  criterio: DefinicaoCriterio
  avaliacao: AvaliacaoCriterio
}) {
  const visual = RESULTADO_VISUAL[avaliacao.resultado]
  return (
    <div className={`rounded-2xl border p-5 ${visual.classe}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">
        Critério 13 — em destaque
      </p>
      <p className="mt-1 text-lg font-bold">
        {visual.icone} {criterio.label}: {visual.label}
      </p>
      <p className="mt-2 text-sm">{avaliacao.justificativa}</p>
    </div>
  )
}

function ScoreCard({
  criterios,
  avaliacoes,
}: {
  criterios: DefinicaoCriterio[]
  avaliacoes: AvaliacaoCriterio[]
}) {
  const mapa = new Map(avaliacoes.map((a) => [a.slug, a]))

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-redenec-petroleo/50">
        Critérios 1–12
      </h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {criterios.map((c) => {
          const a = mapa.get(c.slug)
          if (!a) return null
          const visual = RESULTADO_VISUAL[a.resultado]
          return (
            <li
              key={c.slug}
              className={`rounded-xl border p-4 text-sm ${visual.classe}`}
            >
              <p className="font-bold">
                {visual.icone} {c.numero}. {c.label}
                {c.critico && (
                  <span className="ml-1.5 rounded bg-black/10 px-1.5 py-0.5 text-xs">
                    crítico
                  </span>
                )}
              </p>
              <p className="mt-1.5 opacity-80">{a.justificativa}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
