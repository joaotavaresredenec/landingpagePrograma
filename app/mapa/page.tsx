import type { Metadata } from 'next'
import { MapaInterativo } from '@/components/mapa/MapaInterativo'
import { carregarAdesoes, carregarMunicipiosCoord } from '@/lib/mapa/carregar-dados'
import {
  calcularEstatisticasNacionais,
  calcularRankingEstados,
  calcularEstatisticasCapitais,
} from '@/lib/mapa/estatisticas'
import type { MunicipioCoord } from '@/lib/mapa/tipos'

export const metadata: Metadata = {
  title: 'Mapa de Adesão ao PECS | Programa Educação para a Cidadania e Sustentabilidade',
  description:
    'Acompanhe a adesão dos estados e municípios brasileiros ao Programa Educação para a Cidadania e Sustentabilidade (PECS) do Ministério da Educação. Dados compartilhados via Acordo de Cooperação nº 14/2025 entre MEC e Redenec.',
  keywords: [
    'PECS',
    'Educação Cidadã',
    'Programa MEC',
    'Sustentabilidade',
    'Redenec',
    'Adesão',
    'Portaria 642',
  ],
  openGraph: {
    title: 'Mapa Nacional de Adesão ao PECS',
    description:
      'Acompanhe em tempo real o avanço do Programa Educação para a Cidadania e Sustentabilidade em todos os estados e municípios brasileiros.',
    type: 'website',
  },
}

export default async function MapaPage() {
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
