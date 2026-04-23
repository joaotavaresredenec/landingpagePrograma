'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type {
  Adesao,
  EstatisticasNacionais,
  EstatisticasEstado,
  MunicipioCoord,
  Regiao,
  StatusGrupo,
} from '@/lib/mapa/tipos'
import { HeroMapa } from './HeroMapa'
import { CardsEstatisticas } from './CardsEstatisticas'
import { BarraBusca } from './BarraBusca'
import { RankingEstados } from './RankingEstados'
import { DrawerDetalhes } from './DrawerDetalhes'
import { Legenda } from './Legenda'

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] md:h-[640px] w-full rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-500">Carregando mapa…</p>
    </div>
  ),
})

export type FiltrosAtivos = {
  busca: string
  regiao: Regiao | 'todas'
  statusGrupo: StatusGrupo | 'todos'
  somenteAderidos: boolean
}

export type EntidadeSelecionada =
  | { tipo: 'estado'; dados: EstatisticasEstado }
  | { tipo: 'municipio'; adesao: Adesao; coord: MunicipioCoord }
  | null

type Props = {
  adesoes: Adesao[]
  municipiosCoord: Record<string, MunicipioCoord>
  estatisticasNacionais: EstatisticasNacionais
  rankingEstados: EstatisticasEstado[]
}

export function MapaInterativo({
  adesoes,
  municipiosCoord,
  estatisticasNacionais,
  rankingEstados,
}: Props) {
  const [filtros, setFiltros] = useState<FiltrosAtivos>({
    busca: '',
    regiao: 'todas',
    statusGrupo: 'todos',
    somenteAderidos: false,
  })

  const [entidadeSelecionada, setEntidadeSelecionada] = useState<EntidadeSelecionada>(null)
  const [boundsAlvo, setBoundsAlvo] = useState<[[number, number], [number, number]] | null>(null)

  const adesoesFiltered = useMemo(() => {
    const b = filtros.busca.trim().toLowerCase()
    return adesoes.filter((a) => {
      if (a.tipo === 'municipio' && filtros.regiao !== 'todas' && a.regiao !== filtros.regiao) return false
      if (filtros.somenteAderidos && a.statusGrupo !== 'aderiu') return false
      if (filtros.statusGrupo !== 'todos' && a.statusGrupo !== filtros.statusGrupo) return false
      if (b && !a.nomeEnte.toLowerCase().includes(b)) return false
      return true
    })
  }, [adesoes, filtros])

  function selecionarEstadoPorUf(uf: string) {
    const estado = rankingEstados.find((e) => e.uf === uf)
    if (!estado) return
    setEntidadeSelecionada({ tipo: 'estado', dados: estado })

    // Centraliza o mapa nos municípios do estado (bounds mínimos)
    const coords = adesoes
      .filter((a) => a.tipo === 'municipio' && a.uf === uf)
      .map((a) => municipiosCoord[a.codigoIbge])
      .filter((c): c is MunicipioCoord => Boolean(c))
    if (coords.length > 0) {
      const lats = coords.map((c) => c.latitude)
      const lngs = coords.map((c) => c.longitude)
      const bounds: [[number, number], [number, number]] = [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ]
      setBoundsAlvo(bounds)
    }
  }

  return (
    <main className="min-h-screen bg-redenec-cinza">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroMapa />

        <CardsEstatisticas estatisticas={estatisticasNacionais} />

        <BarraBusca
          filtros={filtros}
          onChange={setFiltros}
          adesoes={adesoes}
          onSelecionarEntidade={(entidade, bounds) => {
            setEntidadeSelecionada(entidade)
            if (bounds) setBoundsAlvo(bounds)
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <div className="relative">
            <MapaLeaflet
              adesoes={adesoesFiltered}
              todasAdesoes={adesoes}
              municipiosCoord={municipiosCoord}
              onSelecionar={setEntidadeSelecionada}
              boundsAlvo={boundsAlvo}
            />
            <Legenda />
          </div>

          <RankingEstados ranking={rankingEstados} onSelecionar={selecionarEstadoPorUf} />
        </div>

        {/* Tabela alternativa — acessibilidade WCAG AA */}
        <details className="mt-6 border border-gray-200 rounded-xl bg-white overflow-hidden">
          <summary className="cursor-pointer p-4 font-bold text-sm text-black hover:bg-gray-50 select-none">
            Ver tabela de dados (alternativa acessível)
          </summary>
          <div className="overflow-x-auto p-4 border-t border-gray-200">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Adesão ao PECS por estado: municípios aderidos, em processo, não iniciados e percentual total
              </caption>
              <thead>
                <tr className="border-b border-gray-200">
                  <th scope="col" className="text-left py-2 font-bold text-gray-700">Estado</th>
                  <th scope="col" className="text-right py-2 font-bold text-gray-700">Aderiu</th>
                  <th scope="col" className="text-right py-2 font-bold text-gray-700">Iniciou</th>
                  <th scope="col" className="text-right py-2 font-bold text-gray-700">Não iniciou</th>
                  <th scope="col" className="text-right py-2 font-bold text-gray-700">% aderido</th>
                </tr>
              </thead>
              <tbody>
                {rankingEstados.map((e) => (
                  <tr key={e.uf} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 font-medium text-black">{e.nome} ({e.uf})</td>
                    <td className="text-right py-2 text-gray-700">{e.aderidos}</td>
                    <td className="text-right py-2 text-gray-700">{e.iniciouNaoConcluiu}</td>
                    <td className="text-right py-2 text-gray-700">{e.naoIniciado}</td>
                    <td className="text-right py-2 font-bold text-black">{e.percentualAderido.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* Rodapé com timestamp e fonte */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-500">
            Dados fornecidos pelo Ministério da Educação · Última atualização: 23 de abril de 2026
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Fonte: planilha oficial de gestão do Programa PECS (SIMEC)
          </p>
        </div>
      </div>

      <DrawerDetalhes
        entidade={entidadeSelecionada}
        adesoes={adesoes}
        onFechar={() => setEntidadeSelecionada(null)}
      />
    </main>
  )
}
