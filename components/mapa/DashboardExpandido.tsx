import type { Adesao, EstatisticasEstado, Regiao } from '@/lib/mapa/tipos'
import type { EstatisticasCapitais } from '@/lib/mapa/estatisticas'
import { TrendingUp, MapPin, Medal, AlertCircle } from 'lucide-react'
import { CardCapitais } from './CardCapitais'
import { BandeiraEstado } from './BandeiraEstado'

type Props = {
  adesoes: Adesao[]
  rankingEstados: EstatisticasEstado[]
  estatisticasCapitais: EstatisticasCapitais
}

const REGIOES: Regiao[] = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

const ALUNOS_REDES_NAO_INICIADAS: Record<string, { alunos: string; numerico: number }> = {
  ES: { alunos: '190 mil alunos', numerico: 190_000 },
  MG: { alunos: '1,6 milhão de alunos', numerico: 1_600_000 },
  MT: { alunos: '442 mil alunos', numerico: 442_000 },
  RR: { alunos: '165 mil alunos', numerico: 165_000 },
}

function calcularPorRegiao(adesoes: Adesao[]) {
  return REGIOES.map((regiao) => {
    const municipios = adesoes.filter((a) => a.tipo === 'municipio' && a.regiao === regiao)
    const aderidos = municipios.filter((m) => m.statusGrupo === 'aderiu').length
    const total = municipios.length
    const pct = total > 0 ? (aderidos / total) * 100 : 0
    return { regiao, aderidos, total, percentual: pct }
  })
}

function formatarTotalAlunos(total: number): string {
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1).replace('.', ',')} milhões de alunos`
  return `${(total / 1000).toFixed(0)} mil alunos`
}

export function DashboardExpandido({ adesoes, rankingEstados, estatisticasCapitais }: Props) {
  const porRegiao = calcularPorRegiao(adesoes)
  const top10Absoluto = [...rankingEstados].sort((a, b) => b.aderidos - a.aderidos).slice(0, 10)
  const top10Percentual = [...rankingEstados]
    .filter((e) => e.totalMunicipios > 50)
    .slice(0, 10)

  const estadosComoUF = adesoes.filter((a) => a.tipo === 'estado')
  const ufAderiram = estadosComoUF.filter((e) => e.statusGrupo === 'aderiu').length
  const ufIniciaram = estadosComoUF.filter((e) => e.statusGrupo === 'iniciou_nao_concluiu').length
  const ufNaoIniciaram = estadosComoUF.filter((e) => e.statusGrupo === 'nao_iniciado')

  const totalAlunosNaoIniciados = ufNaoIniciaram.reduce((acc, e) => {
    const dados = ALUNOS_REDES_NAO_INICIADAS[e.uf]
    return acc + (dados?.numerico ?? 0)
  }, 0)

  return (
    <div className="mb-6 space-y-4">

      {/* Linha 1 — Distribuição por região */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-redenec-verde" aria-hidden="true" />
          Distribuição por região
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {porRegiao.map((r) => (
            <div key={r.regiao} className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-[11px] text-gray-500 mb-1">{r.regiao}</p>
              <p className="text-xl font-bold text-black leading-none mb-1">{r.percentual.toFixed(0)}%</p>
              <p className="text-[11px] text-gray-500">
                {r.aderidos.toLocaleString('pt-BR')}/{r.total.toLocaleString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Linha 2 — dois rankings lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Medal size={16} className="text-redenec-verde" aria-hidden="true" />
            Top 10 — municípios aderidos (absoluto)
          </h3>
          <div className="space-y-1 max-h-[320px] overflow-y-auto">
            {top10Absoluto.map((e, i) => (
              <div
                key={e.uf}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                  <BandeiraEstado uf={e.uf} size="sm" />
                  <span className="font-medium text-sm text-black truncate">{e.nome}</span>
                </div>
                <span className="font-bold text-sm text-redenec-petroleo shrink-0">
                  {e.aderidos.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-redenec-verde" aria-hidden="true" />
            Top 10 — por percentual de adesão
          </h3>
          <div className="space-y-1 max-h-[320px] overflow-y-auto">
            {top10Percentual.map((e, i) => (
              <div
                key={e.uf}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                  <BandeiraEstado uf={e.uf} size="sm" />
                  <span className="font-medium text-sm text-black truncate">{e.nome}</span>
                </div>
                <span className="font-bold text-sm text-redenec-petroleo shrink-0">
                  {e.percentualAderido.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            * Considera apenas estados com mais de 50 municípios
          </p>
        </div>
      </div>

      {/* Linha 3 — Estados como UFs + Estados não iniciados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            Estados (UFs) por status institucional
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-redenec-verde/10 rounded-lg border border-redenec-verde/30">
              <p className="text-2xl font-bold text-[#0F6E56]">{ufAderiram}</p>
              <p className="text-[11px] text-gray-700 mt-1">Aderiram</p>
            </div>
            <div className="text-center p-3 bg-redenec-azul/10 rounded-lg border border-redenec-azul/30">
              <p className="text-2xl font-bold text-[#0C447C]">{ufIniciaram}</p>
              <p className="text-[11px] text-gray-700 mt-1">Iniciaram</p>
            </div>
            <div className="text-center p-3 bg-[#FAECE7] rounded-lg border border-[#F0997B]/40">
              <p className="text-2xl font-bold text-[#993C1D]">{ufNaoIniciaram.length}</p>
              <p className="text-[11px] text-gray-700 mt-1">Não iniciaram</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-3">
            Total: 27 unidades federativas (26 estados + DF)
          </p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle size={16} aria-hidden="true" />
            Estados que ainda não iniciaram (UF)
          </h3>
          {ufNaoIniciaram.length === 0 ? (
            <p className="text-sm text-amber-800">Todos os estados já iniciaram.</p>
          ) : (
            <div className="space-y-2 mb-3">
              {ufNaoIniciaram.map((e) => {
                const dados = ALUNOS_REDES_NAO_INICIADAS[e.uf]
                return (
                  <div
                    key={e.uf}
                    className="flex items-center gap-3 px-3 py-2 bg-white border border-amber-200 rounded-md"
                  >
                    <BandeiraEstado uf={e.uf} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        {e.nomeEnte}{' '}
                        <span className="text-amber-700">({e.uf})</span>
                      </p>
                      {dados && (
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Rede estadual: {dados.alunos}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {totalAlunosNaoIniciados > 0 && (
            <div className="pt-2 mt-2 border-t border-amber-200">
              <p className="text-xs text-amber-900 font-bold">
                Total de alunos nestas redes: {formatarTotalAlunos(totalAlunosNaoIniciados)}
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                Prioridade de incidência institucional e de articulação com as secretarias estaduais.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Linha 4 — Capitais */}
      <CardCapitais capitais={estatisticasCapitais} />

    </div>
  )
}
