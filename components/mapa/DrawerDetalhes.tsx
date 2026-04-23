'use client'

import { useEffect, useMemo, useState } from 'react'
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

const ABAS: { key: StatusGrupo; label: string; cor: string; corTexto: string }[] = [
  { key: 'aderiu', label: 'Aderiu', cor: '#1cff9e', corTexto: '#0F6E56' },
  { key: 'iniciou_nao_concluiu', label: 'Iniciou, não concluiu', cor: '#0086ff', corTexto: '#0C447C' },
  { key: 'nao_iniciado', label: 'Não iniciou', cor: '#888780', corTexto: '#444441' },
]

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
          className="absolute top-4 right-4 text-gray-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded z-10"
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
  const [abaAtiva, setAbaAtiva] = useState<StatusGrupo>('aderiu')
  const [buscaMunicipio, setBuscaMunicipio] = useState('')

  const municipiosDoEstado = useMemo(
    () => adesoes.filter((a) => a.tipo === 'municipio' && a.uf === estado.uf),
    [adesoes, estado.uf],
  )

  const grupos = useMemo(
    () => ({
      aderiu: municipiosDoEstado.filter((m) => m.statusGrupo === 'aderiu'),
      iniciou_nao_concluiu: municipiosDoEstado.filter((m) => m.statusGrupo === 'iniciou_nao_concluiu'),
      nao_iniciado: municipiosDoEstado.filter((m) => m.statusGrupo === 'nao_iniciado'),
    }),
    [municipiosDoEstado],
  )

  const municipiosFiltrados = useMemo(() => {
    const termo = buscaMunicipio.trim().toLowerCase()
    const lista = grupos[abaAtiva]
    if (!termo) return lista
    return lista.filter((m) => m.nomeEnte.toLowerCase().includes(termo))
  }, [grupos, abaAtiva, buscaMunicipio])

  const statusLabel = STATUS_LABELS[estado.statusProprio]
  const abaAtual = ABAS.find((a) => a.key === abaAtiva) ?? ABAS[0]

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

      <div>
        <h3 className="font-bold text-sm text-black mb-3">Municípios deste estado</h3>

        {/* Abas */}
        <div className="flex border-b border-gray-200 mb-3" role="tablist">
          {ABAS.map((aba) => {
            const ativa = abaAtiva === aba.key
            return (
              <button
                key={aba.key}
                type="button"
                role="tab"
                aria-selected={ativa}
                onClick={() => {
                  setAbaAtiva(aba.key)
                  setBuscaMunicipio('')
                }}
                className={[
                  'flex-1 px-2 py-2 text-[11px] font-bold transition-colors border-b-2',
                  ativa ? '' : 'border-transparent text-gray-500 hover:text-gray-700',
                ].join(' ')}
                style={ativa ? { color: aba.corTexto, borderColor: aba.cor } : undefined}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: aba.cor }}
                    aria-hidden="true"
                  />
                  {aba.label}
                  <span className="text-gray-400 font-normal">({grupos[aba.key].length})</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Busca dentro do drawer */}
        {grupos[abaAtiva].length > 10 && (
          <input
            type="search"
            placeholder="Filtrar municípios…"
            value={buscaMunicipio}
            onChange={(e) => setBuscaMunicipio(e.target.value)}
            aria-label="Filtrar municípios na lista"
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md mb-2 focus:outline-none focus:border-redenec-verde focus:ring-2 focus:ring-redenec-verde/20"
          />
        )}

        {/* Lista */}
        <div className="max-h-96 overflow-y-auto">
          {municipiosFiltrados.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4 text-center">
              {grupos[abaAtiva].length === 0
                ? 'Nenhum município nesta categoria.'
                : 'Nenhum município corresponde à busca.'}
            </p>
          ) : (
            <div className="space-y-0.5">
              {municipiosFiltrados.map((m) => (
                <div
                  key={m.codigoIbge}
                  className="flex items-center justify-between py-1.5 px-2 text-sm hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: abaAtual.cor }}
                      aria-hidden="true"
                    />
                    <span className="text-gray-700 truncate">{m.nomeEnte}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono shrink-0 ml-2">
                    {m.codigoIbge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
