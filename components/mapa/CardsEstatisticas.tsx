import type { EstatisticasNacionais } from '@/lib/mapa/tipos'
import { TrendingUp, Building2, FileClock, MapPin } from 'lucide-react'

type Props = {
  estatisticas: EstatisticasNacionais
}

export function CardsEstatisticas({ estatisticas }: Props) {
  const cards = [
    {
      label: 'Estados aderidos',
      valor: String(estatisticas.estadosAderidos),
      subtitulo: `de ${estatisticas.totalEstados} unidades federativas`,
      icone: MapPin,
      corDestaque: 'text-redenec-verde',
    },
    {
      label: 'Municípios aderidos',
      valor: estatisticas.municipiosAderidos.toLocaleString('pt-BR'),
      subtitulo: `${estatisticas.percentualAderidos.toFixed(1)}% do total nacional`,
      icone: Building2,
      corDestaque: 'text-redenec-verde',
    },
    {
      label: 'Iniciaram, não concluíram',
      valor: estatisticas.municipiosIniciaramNaoConcluiram.toLocaleString('pt-BR'),
      subtitulo: 'em fase de cadastramento',
      icone: FileClock,
      corDestaque: 'text-redenec-azul',
    },
    {
      label: 'Cobertura nacional',
      valor: `${estatisticas.percentualComMovimento.toFixed(1)}%`,
      subtitulo: `${(estatisticas.municipiosAderidos + estatisticas.municipiosIniciaramNaoConcluiram).toLocaleString('pt-BR')} com movimento`,
      icone: TrendingUp,
      corDestaque: 'text-redenec-verde',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => {
        const Icone = card.icone
        return (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[11px] text-gray-500 leading-tight">{card.label}</p>
              <Icone size={16} className={card.corDestaque} aria-hidden="true" />
            </div>
            <p className="text-2xl md:text-[26px] font-bold text-black leading-none mb-1">{card.valor}</p>
            <p className="text-[11px] text-gray-500 leading-snug">{card.subtitulo}</p>
          </div>
        )
      })}
    </div>
  )
}
