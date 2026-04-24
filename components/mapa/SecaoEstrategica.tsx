'use client'

import { Target, AlertTriangle, MapPinned, TrendingDown, ChevronRight } from 'lucide-react'
import { BandeiraEstado } from './BandeiraEstado'
import type { Adesao, MunicipioCoord, StatusGrupo } from '@/lib/mapa/tipos'
import {
  calcularRankingNaoIniciados,
  somarMunicipiosNaoIniciados,
  calcularMunicipiosGrandesNaoAderidos,
  calcularCapitaisNaoAderidas,
  calcularEstadosNaoIniciadosComAlunos,
  totalAlunosEstadosNaoIniciados,
  formatarPopulacao,
  formatarAlunos,
} from '@/lib/mapa/estrategia'

type Props = {
  adesoes: Adesao[]
  municipiosCoord: Record<string, MunicipioCoord>
  onSelecionarEstado: (uf: string) => void
}

const STATUS_LABEL: Record<StatusGrupo, string> = {
  aderiu: 'Aderiu',
  iniciou_nao_concluiu: 'Iniciou, não concluiu',
  nao_iniciado: 'Não iniciado',
}

export function SecaoEstrategica({ adesoes, municipiosCoord, onSelecionarEstado }: Props) {
  const rankingNaoIniciados = calcularRankingNaoIniciados(adesoes)
  const maiorValor = rankingNaoIniciados[0]?.naoIniciados || 1
  const top5Soma = somarMunicipiosNaoIniciados(rankingNaoIniciados, 5)

  const municipiosGrandes = calcularMunicipiosGrandesNaoAderidos(adesoes, municipiosCoord)
  const capitaisNaoAderidas = calcularCapitaisNaoAderidas(adesoes)
  const estadosNaoIniciadosComAlunos = calcularEstadosNaoIniciadosComAlunos(adesoes)
  const totalAlunosNaoIniciados = totalAlunosEstadosNaoIniciados(adesoes)

  return (
    <div className="mt-8 mb-6">

      {/* Cabeçalho da seção */}
      <div className="bg-gradient-to-br from-redenec-verde/10 to-redenec-azul/10 border border-redenec-verde/30 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-redenec-verde rounded-lg flex items-center justify-center shrink-0">
            <Target size={22} className="text-redenec-petroleo" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0F6E56] mb-2">
              Onde a Redenec pode atuar com mais impacto
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-redenec-petroleo mb-2 leading-tight">
              Prioridades estratégicas de articulação
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
              Análise dos estados e municípios com maior potencial de conversão em adesão
              ao Programa. Esta seção oferece elementos para orientar esforços de
              articulação institucional da Redenec e parceiros.
            </p>
          </div>
        </div>
      </div>

      {/* Visualização 1 — Ranking negativo Top 10 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={18} className="text-redenec-azul" aria-hidden="true" />
          <h3 className="font-bold text-gray-900 text-sm md:text-base">
            Top 10 estados por municípios que ainda não iniciaram
          </h3>
        </div>
        <p className="text-[11px] text-gray-500 mb-1">
          Estados com maior número absoluto de municípios no status &ldquo;não iniciado&rdquo;.
          Ação coordenada aqui pode gerar o maior volume de conversões.
        </p>
        <p className="text-[11px] text-gray-500 italic mb-4">
          Clique em um estado para ver quais municípios ainda não iniciaram.
        </p>

        <div className="space-y-1.5">
          {rankingNaoIniciados.map((estado, i) => {
            const larguraBarra = (estado.naoIniciados / maiorValor) * 100
            return (
              <button
                key={estado.uf}
                type="button"
                onClick={() => onSelecionarEstado(estado.uf)}
                aria-label={`Abrir detalhes de ${estado.nome}: ${estado.naoIniciados} municípios não iniciados`}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
              >
                <span className="font-bold text-gray-400 text-xs w-5 shrink-0">{i + 1}</span>
                <BandeiraEstado uf={estado.uf} size="sm" />
                <span className="font-medium text-gray-900 text-sm w-28 shrink-0 truncate">
                  {estado.nome}
                </span>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="flex-1 h-5 bg-gray-100 rounded relative overflow-hidden">
                    <div
                      className="h-full bg-redenec-coral/90 rounded transition-all duration-500"
                      style={{ width: `${larguraBarra}%` }}
                    />
                  </div>
                  <div className="flex items-baseline gap-1.5 w-32 justify-end shrink-0">
                    <span className="font-bold text-redenec-petroleo text-sm">
                      {estado.naoIniciados.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[11px] text-gray-500">municípios</span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors"
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-sm text-redenec-petroleo bg-redenec-cinza/60 rounded-md px-3 py-2.5">
            <span className="font-bold">Leitura estratégica:</span> os 5 primeiros estados
            concentram <span className="font-bold text-[#993C1D]">{top5Soma.toLocaleString('pt-BR')} municípios</span>{' '}
            ainda sem movimento. Uma ação coordenada nestes estados, mesmo com pequena taxa
            de conversão, teria impacto nacional significativo.
          </p>
        </div>
      </div>

      {/* Visualizações 2 e 3 lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Visualização 2 — Alertas críticos */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-red-50 border-b border-red-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" aria-hidden="true" />
              <h3 className="font-bold text-red-900 text-sm md:text-base">
                Prioridade crítica institucional
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {estadosNaoIniciadosComAlunos.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-red-700 mb-3">
                  Estados (UF) sem movimento
                </h4>
                <div className="space-y-2">
                  {estadosNaoIniciadosComAlunos.map((e) => (
                    <div
                      key={e.uf}
                      className="flex items-center gap-3 p-2.5 bg-red-50/60 border border-red-100 rounded-md"
                    >
                      <BandeiraEstado uf={e.uf} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          {e.nome} <span className="text-red-700">({e.uf})</span>
                        </p>
                        {e.alunos > 0 && (
                          <p className="text-[11px] text-red-700 mt-0.5">
                            Rede estadual: {formatarAlunos(e.alunos)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {totalAlunosNaoIniciados > 0 && (
                  <p className="text-[11px] text-red-700 mt-3 pt-3 border-t border-red-100">
                    Total: <span className="font-bold">{formatarAlunos(totalAlunosNaoIniciados)}</span>{' '}
                    em redes estaduais sem movimento institucional.
                  </p>
                )}
              </div>
            )}

            {capitaisNaoAderidas.length > 0 && (
              <div className="pt-4 border-t border-red-100">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-amber-700 mb-2">
                  Capitais ainda pendentes ({capitaisNaoAderidas.length})
                </h4>
                <p className="text-[11px] text-gray-600 mb-3">
                  Alta relevância simbólica e estrutural — concentram grande volume de alunos
                  e capacidade institucional.
                </p>
                <div className="flex flex-wrap gap-2">
                  {capitaisNaoAderidas.map((c) => (
                    <span
                      key={c.codigoIbge}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md text-sm font-medium text-amber-900"
                    >
                      <BandeiraEstado uf={c.uf} size="xs" />
                      {c.nomeEnte}{' '}
                      <span className="text-[11px] text-amber-600">({c.uf})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualização 3 — Municípios grandes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <MapPinned size={18} className="text-amber-700" aria-hidden="true" />
              <h3 className="font-bold text-amber-900 text-sm md:text-base">
                Municípios grandes sem adesão
              </h3>
            </div>
          </div>

          <div className="p-5">
            <p className="text-[11px] text-gray-600 mb-4">
              Municípios com mais de 100 mil habitantes que ainda não aderiram efetivamente
              ao Programa. Concentram grande volume de alunos e capacidade institucional instalada.
            </p>

            {municipiosGrandes.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">
                Dados de população não disponíveis ou nenhum município grande sem adesão encontrado.
              </p>
            ) : (
              <>
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-2xl font-bold text-amber-900 leading-none">
                    {municipiosGrandes.length}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    cidades acima de 100 mil habitantes sem adesão efetiva
                  </p>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {municipiosGrandes.slice(0, 15).map((m, i) => (
                    <div
                      key={m.codigoIbge}
                      className="flex items-center justify-between p-2 hover:bg-amber-50 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[11px] font-bold text-gray-400 w-5 shrink-0">
                          {i + 1}
                        </span>
                        <BandeiraEstado uf={m.uf} size="xs" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{m.nome}</p>
                          <p className="text-[11px] text-gray-500">
                            {m.uf} · {STATUS_LABEL[m.statusGrupo]}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-amber-700 shrink-0 ml-2">
                        {formatarPopulacao(m.populacao)}
                      </span>
                    </div>
                  ))}

                  {municipiosGrandes.length > 15 && (
                    <div className="text-center py-2 text-[11px] text-gray-500">
                      + {municipiosGrandes.length - 15} municípios no total
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Nota de rodapé */}
      <div className="mt-5 pt-3 border-t border-gray-200">
        <p className="text-[11px] text-gray-500 italic text-center">
          Esta análise é indicativa e orienta prioridades. A articulação institucional deve
          sempre considerar o contexto local e as capacidades específicas de cada rede.
        </p>
      </div>

    </div>
  )
}
