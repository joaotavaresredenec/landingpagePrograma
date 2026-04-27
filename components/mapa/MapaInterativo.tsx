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
import {
  calcularEstatisticasEstado,
  type EstatisticasCapitais,
} from '@/lib/mapa/estatisticas'
import { obterBoundsEstado, obterBoundsMunicipio } from '@/lib/mapa/geo-utils'
import { HeroMapa } from './HeroMapa'
import { CardsEstatisticas } from './CardsEstatisticas'
import { DashboardExpandido } from './DashboardExpandido'
import { BarraBusca } from './BarraBusca'
import { RankingEstados } from './RankingEstados'
import { DrawerDetalhes } from './DrawerDetalhes'
import { Legenda } from './Legenda'
import { PopupBoasVindas } from './PopupBoasVindas'
import { SecaoEstrategica } from './SecaoEstrategica'
import { CardExportarRelacao } from './CardExportarRelacao'

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] md:h-[640px] w-full rounded-b-xl border border-gray-200 border-t-0 bg-gray-50 flex items-center justify-center">
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
  | { tipo: 'estado'; dados: EstatisticasEstado; abaInicial?: StatusGrupo }
  | { tipo: 'municipio'; adesao: Adesao; coord: MunicipioCoord }
  | null

type Props = {
  adesoes: Adesao[]
  municipiosCoord: Record<string, MunicipioCoord>
  estatisticasNacionais: EstatisticasNacionais
  rankingEstados: EstatisticasEstado[]
  estatisticasCapitais: EstatisticasCapitais
}

export function MapaInterativo({
  adesoes,
  municipiosCoord,
  estatisticasNacionais,
  rankingEstados,
  estatisticasCapitais,
}: Props) {
  const [filtros, setFiltros] = useState<FiltrosAtivos>({
    busca: '',
    regiao: 'todas',
    statusGrupo: 'todos',
    somenteAderidos: false,
  })

  const [entidadeSelecionada, setEntidadeSelecionada] = useState<EntidadeSelecionada>(null)
  const [boundsAlvo, setBoundsAlvo] = useState<[[number, number], [number, number]] | null>(null)
  const [ufAtiva, setUfAtiva] = useState<string | null>(null)

  function handleMudarUf(uf: string | null) {
    setUfAtiva(uf)
    if (uf === null) {
      setEntidadeSelecionada(null)
      setBoundsAlvo(null)
    }
  }

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
    setUfAtiva(uf)
    const bounds = obterBoundsEstado(uf)
    if (bounds) setBoundsAlvo(bounds)
  }

  function handleSelecionarEstadoNaoIniciado(uf: string) {
    const stats = calcularEstatisticasEstado(adesoes, uf)
    setEntidadeSelecionada({ tipo: 'estado', dados: stats, abaInicial: 'nao_iniciado' })
    setUfAtiva(uf)
    const bounds = obterBoundsEstado(uf)
    if (bounds) setBoundsAlvo(bounds)
  }

  function handleSelecionarDaBusca(adesao: Adesao) {
    if (adesao.tipo === 'estado') {
      const stats = calcularEstatisticasEstado(adesoes, adesao.uf)
      setEntidadeSelecionada({ tipo: 'estado', dados: stats })
      setUfAtiva(adesao.uf)
      const bounds = obterBoundsEstado(adesao.uf)
      if (bounds) setBoundsAlvo(bounds)
    } else {
      const coord = municipiosCoord[adesao.codigoIbge]
      if (coord) {
        setEntidadeSelecionada({ tipo: 'municipio', adesao, coord })
        setUfAtiva(adesao.uf)
        setBoundsAlvo(obterBoundsMunicipio(coord.latitude, coord.longitude))
      }
    }
  }

  return (
    <>
      <PopupBoasVindas />

      <main className="min-h-screen bg-redenec-cinza">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Hero (com 3 logos) */}
          <HeroMapa />

          {/* Cards breves — visão de relance */}
          <CardsEstatisticas estatisticas={estatisticasNacionais} />

          {/* Busca + filtros logo acima do mapa */}
          <BarraBusca
            filtros={filtros}
            onChange={setFiltros}
            adesoes={adesoes}
            onSelecionarEntidade={(entidade, bounds) => {
              setEntidadeSelecionada(entidade)
              if (bounds) setBoundsAlvo(bounds)
            }}
            onSelecionarDaBusca={handleSelecionarDaBusca}
          />

          {/* CTA visivel para baixar relacao em PDF de qualquer estado */}
          <CardExportarRelacao adesoes={adesoes} rankingEstados={rankingEstados} />

          {/* Mapa + ranking — primeiro elemento visual após a busca */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
            <div>
              <Legenda />
              <MapaLeaflet
                adesoes={adesoesFiltered}
                todasAdesoes={adesoes}
                municipiosCoord={municipiosCoord}
                onSelecionar={(entidade) => {
                  setEntidadeSelecionada(entidade)
                  if (entidade?.tipo === 'estado') setUfAtiva(entidade.dados.uf)
                  else if (entidade?.tipo === 'municipio') setUfAtiva(entidade.adesao.uf)
                }}
                boundsAlvo={boundsAlvo}
                ufAtiva={ufAtiva}
                onMudarUf={handleMudarUf}
              />
            </div>

            <RankingEstados ranking={rankingEstados} onSelecionar={selecionarEstadoPorUf} />
          </div>

          {/* Dashboard analítico abaixo do mapa */}
          <div className="mt-8">
            <DashboardExpandido
              adesoes={adesoes}
              rankingEstados={rankingEstados}
              estatisticasCapitais={estatisticasCapitais}
            />
          </div>

          {/* Seção estratégica de prioridades de articulação */}
          <SecaoEstrategica
            adesoes={adesoes}
            municipiosCoord={municipiosCoord}
            onSelecionarEstado={handleSelecionarEstadoNaoIniciado}
          />

          {/* Rodapé com timestamp e fonte */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-gray-500">
              Dados fornecidos pelo Ministério da Educação · Última atualização: 23 de abril de 2026
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Fonte: planilha oficial de gestão do Programa PECS (SIMEC)
            </p>
            <p className="text-[11px] text-gray-400 mt-3">
              Desenvolvido por João Tavares / Redenec
            </p>
          </div>
        </div>

        <DrawerDetalhes
          entidade={entidadeSelecionada}
          adesoes={adesoes}
          municipiosCoord={municipiosCoord}
          onFechar={() => setEntidadeSelecionada(null)}
        />
      </main>
    </>
  )
}
