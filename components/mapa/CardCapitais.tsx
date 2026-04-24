'use client'

import { useState } from 'react'
import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import type { EstatisticasCapitais } from '@/lib/mapa/estatisticas'
import { BandeiraEstado } from './BandeiraEstado'

type Props = {
  capitais: EstatisticasCapitais
}

export function CardCapitais({ capitais }: Props) {
  const [expandido, setExpandido] = useState(false)
  const percentualAderidas =
    capitais.total > 0 ? (capitais.aderidas.length / capitais.total) * 100 : 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setExpandido((v) => !v)}
        aria-expanded={expandido}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-redenec-verde/20 rounded-lg flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-[#0F6E56]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Capitais que aderiram</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {capitais.aderidas.length}/{capitais.total} ({percentualAderidas.toFixed(0)}%) — clique para detalhes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-redenec-petroleo">
            {capitais.aderidas.length}
          </span>
          {expandido ? (
            <ChevronUp size={20} className="text-gray-400" aria-hidden="true" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" aria-hidden="true" />
          )}
        </div>
      </button>

      {expandido && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {capitais.aderidas.length > 0 && (
            <ListaCapitais
              titulo={`Aderiram (${capitais.aderidas.length})`}
              corPonto="#1cff9e"
              corTitulo="text-[#0F6E56]"
              capitais={capitais.aderidas}
            />
          )}

          {capitais.iniciouNaoConcluiu.length > 0 && (
            <ListaCapitais
              titulo={`Iniciaram, não concluíram (${capitais.iniciouNaoConcluiu.length})`}
              corPonto="#0086ff"
              corTitulo="text-[#0C447C]"
              capitais={capitais.iniciouNaoConcluiu}
            />
          )}

          {capitais.naoIniciadas.length > 0 && (
            <ListaCapitais
              titulo={`Ainda não iniciaram (${capitais.naoIniciadas.length})`}
              corPonto="#ff8b80"
              corTitulo="text-[#993C1D]"
              capitais={capitais.naoIniciadas}
            />
          )}

          <p className="text-[11px] text-gray-500 italic pt-2 border-t border-gray-100">
            A adesão de capitais tem peso estratégico pela concentração de alunos e capacidade
            institucional das redes municipais.
          </p>
        </div>
      )}
    </div>
  )
}

function ListaCapitais({
  titulo,
  corPonto,
  corTitulo,
  capitais,
}: {
  titulo: string
  corPonto: string
  corTitulo: string
  capitais: EstatisticasCapitais['aderidas']
}) {
  return (
    <div>
      <h4 className={`text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${corTitulo}`}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: corPonto }} aria-hidden="true" />
        {titulo}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1.5 text-sm">
        {capitais.map((c) => (
          <div key={c.codigoIbge} className="flex items-center gap-2 text-gray-700">
            <BandeiraEstado uf={c.uf} size="xs" />
            <span className="truncate">
              {c.nomeEnte} <span className="text-gray-400 text-xs">({c.uf})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
