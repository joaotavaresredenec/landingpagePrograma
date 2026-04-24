import type { Metadata } from 'next'
import { temSessaoMapa } from '@/lib/sessao-mapa'
import { TelaSenhaMapa } from '@/components/mapa/TelaSenhaMapa'
import { MapaInterativo } from '@/components/mapa/MapaInterativo'
import { carregarAdesoes, carregarMunicipiosCoord } from '@/lib/mapa/carregar-dados'
import {
  calcularEstatisticasNacionais,
  calcularRankingEstados,
  calcularEstatisticasCapitais,
} from '@/lib/mapa/estatisticas'
import type { MunicipioCoord } from '@/lib/mapa/tipos'

export const metadata: Metadata = {
  title: 'Mapa de Adesão | Programa Educação para a Cidadania e Sustentabilidade',
  description: 'Visualize os estados e municípios que aderiram ao Programa PECS — Portaria MEC nº 642/2025.',
  robots: { index: false, follow: false },
}

export default async function MapaPage() {
  const autenticado = await temSessaoMapa()

  if (!autenticado) {
    return <TelaSenhaMapa />
  }

  const [adesoes, municipiosCoord] = await Promise.all([
    carregarAdesoes(),
    carregarMunicipiosCoord(),
  ])

  const estatisticasNacionais = calcularEstatisticasNacionais(adesoes)
  const rankingEstados = calcularRankingEstados(adesoes)
  const estatisticasCapitais = calcularEstatisticasCapitais(adesoes)

  const municipiosCoordObj: Record<string, MunicipioCoord> = {}
  municipiosCoord.forEach((value, key) => {
    municipiosCoordObj[key] = value
  })

  return (
    <MapaInterativo
      adesoes={adesoes}
      municipiosCoord={municipiosCoordObj}
      estatisticasNacionais={estatisticasNacionais}
      rankingEstados={rankingEstados}
      estatisticasCapitais={estatisticasCapitais}
    />
  )
}
