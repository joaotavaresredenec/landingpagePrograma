'use client'

import type { EstatisticasEstado } from '@/lib/mapa/tipos'
import { BandeiraEstado } from './BandeiraEstado'

type Props = {
  ranking: EstatisticasEstado[]
  onSelecionar: (uf: string) => void
}

function corDoFundo(percentual: number): string {
  if (percentual >= 60) return 'bg-redenec-verde/30'
  if (percentual >= 40) return 'bg-redenec-verde/20'
  if (percentual >= 20) return 'bg-redenec-verde/10'
  if (percentual > 0) return 'bg-redenec-verde/5'
  return 'bg-redenec-coral/10'
}

export function RankingEstados({ ranking, onSelecionar }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm lg:sticky lg:top-20 lg:max-h-[640px] lg:overflow-y-auto">
      <h2 className="text-sm font-bold text-black mb-1">Ranking por estado</h2>
      <p className="text-[11px] text-gray-500 mb-3">% de municípios aderidos</p>

      <div className="space-y-1.5">
        {ranking.map((estado) => (
          <button
            key={estado.uf}
            type="button"
            onClick={() => onSelecionar(estado.uf)}
            className={[
              'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
              'hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
              corDoFundo(estado.percentualAderido),
            ].join(' ')}
            aria-label={`${estado.nome}: ${estado.percentualAderido.toFixed(1)}% de municípios aderidos`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <BandeiraEstado uf={estado.uf} size="sm" />
              <span className="font-bold text-sm text-redenec-petroleo">{estado.uf}</span>
              <span className="text-[11px] text-gray-500 hidden lg:inline">
                {estado.aderidos}/{estado.totalMunicipios}
              </span>
            </div>
            <span className="font-bold text-sm text-black">
              {estado.percentualAderido.toFixed(0)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
