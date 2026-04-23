'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Adesao, EstatisticasEstado, MunicipioCoord, StatusGrupo, StatusAdesao } from '@/lib/mapa/tipos'
import type { EntidadeSelecionada } from './MapaInterativo'

const STATUS_LABELS: Record<StatusGrupo, { texto: string; cor: string }> = {
  aderiu: { texto: 'Aderiu', cor: 'bg-redenec-verde text-black' },
  iniciou_nao_concluiu: { texto: 'Iniciou, não concluiu', cor: 'bg-redenec-azul text-white' },
  nao_iniciado: { texto: 'Não iniciado', cor: 'bg-gray-200 text-gray-700' },
}

const STATUS_ORIGINAIS: Record<StatusAdesao, string> = {
  nao_iniciado: 'Ainda não foi iniciado o processo de adesão.',
  em_cadastramento: 'Está preenchendo o formulário de adesão no SIMEC.',
  em_analise: 'Documentação enviada, aguardando homologação do MEC.',
  finalizado: 'Processo finalizado e publicado no Diário Oficial da União.',
}

type Props = {
  entidade: EntidadeSelecionada
  adesoes: Adesao[]
  onFechar: () => void
}

export function DrawerDetalhes({ entidade, adesoes, onFechar }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar()
    }
    if (entidade) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [entidade, onFechar])

  if (!entidade) return null

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes"
    >
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar detalhes"
          className="absolute top-4 right-4 text-gray-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {entidade.tipo === 'estado' && <DetalhesEstado estado={entidade.dados} adesoes={adesoes} />}
          {entidade.tipo === 'municipio' && (
            <DetalhesMunicipio adesao={entidade.adesao} coord={entidade.coord} />
          )}
        </div>
      </div>
    </div>
  )
}

function DetalhesEstado({ estado, adesoes }: { estado: EstatisticasEstado; adesoes: Adesao[] }) {
  const municipiosDoEstado = adesoes.filter((a) => a.tipo === 'municipio' && a.uf === estado.uf)
  const municipiosAderidos = municipiosDoEstado.filter((m) => m.statusGrupo === 'aderiu')
  const municipiosIniciando = municipiosDoEstado.filter((m) => m.statusGrupo === 'iniciou_nao_concluiu')

  const statusLabel = STATUS_LABELS[estado.statusProprio]

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Estado</p>
        <h2 className="text-2xl font-bold text-black mb-2">{estado.nome}</h2>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusLabel.cor}`}>
          {statusLabel.texto}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Municípios aderidos" valor={estado.aderidos} />
        <Stat label="% do estado" valor={`${estado.percentualAderido.toFixed(1)}%`} />
        <Stat label="Iniciaram" valor={estado.iniciouNaoConcluiu} />
        <Stat label="Total municípios" valor={estado.totalMunicipios} />
      </div>

      {municipiosAderidos.length > 0 && (
        <div className="mb-5">
          <h3 className="font-bold text-sm text-black mb-2">
            Municípios aderidos ({municipiosAderidos.length})
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {municipiosAderidos.map((m) => (
              <div key={m.codigoIbge} className="flex items-center gap-2 text-sm py-1">
                <div className="w-2 h-2 rounded-full bg-redenec-verde shrink-0" />
                <span className="text-gray-700">{m.nomeEnte}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {municipiosIniciando.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-black mb-2">
            Em processo ({municipiosIniciando.length})
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {municipiosIniciando.map((m) => (
              <div key={m.codigoIbge} className="flex items-center gap-2 text-sm py-1">
                <div className="w-2 h-2 rounded-full bg-redenec-azul shrink-0" />
                <span className="text-gray-700">{m.nomeEnte}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DetalhesMunicipio({ adesao, coord }: { adesao: Adesao; coord: MunicipioCoord }) {
  const statusLabel = STATUS_LABELS[adesao.statusGrupo]

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">
          Município · {adesao.uf}
        </p>
        <h2 className="text-2xl font-bold text-black mb-2">
          {adesao.nomeEnte}
          {coord.capital && (
            <span className="text-xs font-normal text-gray-500 ml-2">(capital)</span>
          )}
        </h2>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusLabel.cor}`}>
          {statusLabel.texto}
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Status detalhado</p>
          <p className="text-gray-700 leading-relaxed">{STATUS_ORIGINAIS[adesao.status]}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Região</p>
          <p className="text-gray-700">{adesao.regiao}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Código IBGE</p>
          <p className="text-gray-700 font-mono">{adesao.codigoIbge}</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-black">{valor}</p>
    </div>
  )
}
