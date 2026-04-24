'use client'

import type { EstatisticasEstado } from '@/lib/mapa/tipos'
import { BandeiraEstado } from './BandeiraEstado'

type Props = {
  ranking: EstatisticasEstado[]
  onSelecionar: (uf: string) => void
}

export function RankingEstados({ ranking, onSelecionar }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm lg:sticky lg:top-20 lg:max-h-[640px] lg:overflow-y-auto">
      <h2 className="text-sm font-bold text-black mb-1">Ranking por estado</h2>
      <p className="text-[11px] text-gray-500 mb-3">% de municípios aderidos</p>

      <div className="space-y-1">
        {ranking.map((estado) => (
          <button
            key={estado.uf}
            type="button"
            onClick={() => onSelecionar(estado.uf)}
            aria-label={`${estado.nome}: ${estado.percentualAderido.toFixed(1)}% de municípios aderidos (${estado.aderidos} de ${estado.totalMunicipios})`}
            className="w-full p-2.5 rounded-md text-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <BandeiraEstado uf={estado.uf} size="sm" />
              <span className="font-bold text-sm text-redenec-petroleo">{estado.uf}</span>
              <span className="text-[11px] text-gray-500 ml-auto">
                {estado.aderidos}/{estado.totalMunicipios}
              </span>
              <span className="font-bold text-sm text-redenec-petroleo min-w-[38px] text-right">
                {estado.percentualAderido.toFixed(0)}%
              </span>
            </div>

            {/* Barra proporcional ao % de adesão */}
            <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-redenec-verde rounded-full transition-all duration-500"
                style={{ width: `${estado.percentualAderido}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
