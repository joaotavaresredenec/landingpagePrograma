'use client'

import { useState, useMemo } from 'react'
import { Search, X, Filter } from 'lucide-react'
import type { FiltrosAtivos, EntidadeSelecionada } from './MapaInterativo'
import type { Adesao, Regiao, StatusGrupo } from '@/lib/mapa/tipos'

const REGIOES: Array<'todas' | Regiao> = ['todas', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

const STATUS_GRUPOS: { valor: 'todos' | StatusGrupo; label: string }[] = [
  { valor: 'todos', label: 'Todos os status' },
  { valor: 'aderiu', label: 'Aderidos' },
  { valor: 'iniciou_nao_concluiu', label: 'Iniciou, não concluiu' },
  { valor: 'nao_iniciado', label: 'Não iniciado' },
]

type Props = {
  filtros: FiltrosAtivos
  onChange: (filtros: FiltrosAtivos) => void
  adesoes: Adesao[]
  onSelecionarEntidade: (entidade: EntidadeSelecionada, bounds?: [[number, number], [number, number]]) => void
}

export function BarraBusca({ filtros, onChange, adesoes }: Props) {
  const [mostrandoSugestoes, setMostrandoSugestoes] = useState(false)
  const [mostrandoFiltros, setMostrandoFiltros] = useState(false)

  const sugestoes = useMemo(() => {
    if (filtros.busca.length < 2) return []
    const busca = filtros.busca.toLowerCase()
    return adesoes
      .filter((a) => a.nomeEnte.toLowerCase().includes(busca))
      .slice(0, 8)
  }, [adesoes, filtros.busca])

  const temFiltrosAtivos =
    filtros.regiao !== 'todas' || filtros.statusGrupo !== 'todos' || filtros.somenteAderidos

  const qtdFiltros = [
    filtros.regiao !== 'todas',
    filtros.statusGrupo !== 'todos',
    filtros.somenteAderidos,
  ].filter(Boolean).length

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={filtros.busca}
              onChange={(e) => onChange({ ...filtros, busca: e.target.value })}
              onFocus={() => setMostrandoSugestoes(true)}
              onBlur={() => setTimeout(() => setMostrandoSugestoes(false), 150)}
              placeholder="Buscar estado ou município..."
              aria-label="Buscar estado ou município no mapa"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-redenec-verde focus:ring-2 focus:ring-redenec-verde/20"
            />
            {filtros.busca && (
              <button
                type="button"
                onClick={() => onChange({ ...filtros, busca: '' })}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMostrandoFiltros((v) => !v)}
            aria-expanded={mostrandoFiltros}
            aria-label="Abrir filtros"
            className={[
              'flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-bold transition-colors',
              temFiltrosAtivos
                ? 'border-redenec-verde bg-redenec-verde/10 text-black'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50',
            ].join(' ')}
          >
            <Filter size={16} aria-hidden="true" />
            <span>Filtros</span>
            {qtdFiltros > 0 && (
              <span className="bg-redenec-verde text-black text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {qtdFiltros}
              </span>
            )}
          </button>
        </div>

        {mostrandoSugestoes && sugestoes.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {sugestoes.map((a) => (
              <button
                type="button"
                key={`${a.tipo}-${a.codigoIbge}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange({ ...filtros, busca: a.nomeEnte })
                  setMostrandoSugestoes(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <p className="font-medium text-sm text-black">{a.nomeEnte}</p>
                <p className="text-[11px] text-gray-500">
                  {a.tipo === 'estado' ? `Estado · ${a.uf}` : `Município · ${a.uf}`}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {mostrandoFiltros && (
        <div className="flex flex-wrap gap-2">
          <select
            value={filtros.regiao}
            onChange={(e) => onChange({ ...filtros, regiao: e.target.value as Regiao | 'todas' })}
            aria-label="Filtrar por região"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {REGIOES.map((r) => (
              <option key={r} value={r}>
                {r === 'todas' ? 'Todas as regiões' : r}
              </option>
            ))}
          </select>

          <select
            value={filtros.statusGrupo}
            onChange={(e) => onChange({ ...filtros, statusGrupo: e.target.value as StatusGrupo | 'todos' })}
            aria-label="Filtrar por status de adesão"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {STATUS_GRUPOS.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.label}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={filtros.somenteAderidos}
              onChange={(e) => onChange({ ...filtros, somenteAderidos: e.target.checked })}
              className="w-4 h-4 accent-redenec-verde"
            />
            Somente aderidos
          </label>

          {temFiltrosAtivos && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  busca: filtros.busca,
                  regiao: 'todas',
                  statusGrupo: 'todos',
                  somenteAderidos: false,
                })
              }
              className="text-sm text-gray-600 hover:text-redenec-petroleo underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
