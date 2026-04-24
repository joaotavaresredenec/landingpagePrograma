'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, ExternalLink, Phone, Users, MapPin, Hash, Star } from 'lucide-react'
import type { Adesao, EstatisticasEstado, MunicipioCoord, StatusGrupo, StatusAdesao } from '@/lib/mapa/tipos'
import type { EntidadeSelecionada } from './MapaInterativo'
import {
  gerarLinksMunicipio,
  gerarLinksEstado,
  estimarAlunosRedeMunicipal,
  formatarAlunos,
  formatarPopulacao,
  type LinkArticulacao,
} from '@/lib/mapa/articulacao'
import { BandeiraEstado } from './BandeiraEstado'

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
  municipiosCoord: Record<string, MunicipioCoord>
  onFechar: () => void
}

export function DrawerDetalhes({ entidade, adesoes, municipiosCoord, onFechar }: Props) {
  const [municipioSecundario, setMunicipioSecundario] = useState<{
    adesao: Adesao
    coord: MunicipioCoord
  } | null>(null)

  // Se a entidade principal mudar, fecha sub-drawer
  useEffect(() => {
    setMunicipioSecundario(null)
  }, [entidade])

  // ESC fecha sub-drawer primeiro; só depois o principal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (municipioSecundario) {
        setMunicipioSecundario(null)
      } else {
        onFechar()
      }
    }
    if (entidade) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [entidade, municipioSecundario, onFechar])

  if (!entidade) return null

  function handleSelecionarMunicipio(adesao: Adesao) {
    const coord = municipiosCoord[adesao.codigoIbge]
    if (coord) {
      setMunicipioSecundario({ adesao, coord })
    }
  }

  return (
    <>
      {/* Drawer principal */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
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
            {entidade.tipo === 'estado' && (
              <DetalhesEstado
                estado={entidade.dados}
                adesoes={adesoes}
                abaInicial={entidade.abaInicial}
                onSelecionarMunicipio={handleSelecionarMunicipio}
              />
            )}
            {entidade.tipo === 'municipio' && (
              <DetalhesMunicipio adesao={entidade.adesao} coord={entidade.coord} />
            )}
          </div>
        </div>
      </div>

      {/* Sub-drawer empilhado (município secundário a partir de um estado) */}
      {municipioSecundario && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setMunicipioSecundario(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Detalhes do município"
        >
          <div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto border-l-2 border-redenec-verde"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <button
                type="button"
                onClick={() => setMunicipioSecundario(null)}
                aria-label="Voltar para o estado"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Voltar</span>
              </button>

              <DetalhesMunicipio
                adesao={municipioSecundario.adesao}
                coord={municipioSecundario.coord}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DetalhesEstado({
  estado,
  adesoes,
  abaInicial = 'aderiu',
  onSelecionarMunicipio,
}: {
  estado: EstatisticasEstado
  adesoes: Adesao[]
  abaInicial?: StatusGrupo
  onSelecionarMunicipio: (adesao: Adesao) => void
}) {
  const [abaAtiva, setAbaAtiva] = useState<StatusGrupo>(abaInicial)
  const [buscaMunicipio, setBuscaMunicipio] = useState('')

  // Reset quando o estado/aba inicial mudar
  useEffect(() => {
    setAbaAtiva(abaInicial)
    setBuscaMunicipio('')
  }, [estado.uf, abaInicial])

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
  const linksArticulacao = gerarLinksEstado(estado.uf)

  const legendaPorStatus: Record<StatusGrupo, string> = {
    aderiu: 'Aderiu',
    iniciou_nao_concluiu: 'Iniciou, não concluiu',
    nao_iniciado: 'Não aderiu',
  }

  return (
    <div>
      {/* Cabeçalho com bandeira */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BandeiraEstado uf={estado.uf} size="lg" />
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-500">Estado</p>
            <h2 className="text-2xl font-bold text-black leading-tight">{estado.nome}</h2>
          </div>
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusLabel.cor}`}>
          {statusLabel.texto}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Municípios aderidos" valor={estado.aderidos} />
        <Stat label="% do estado" valor={`${estado.percentualAderido.toFixed(1)}%`} />
        <Stat label="Iniciaram" valor={estado.iniciouNaoConcluiu} />
        <Stat label="Total municípios" valor={estado.totalMunicipios} />
      </div>

      {/* Abas + grid de municípios */}
      <div>
        <h3 className="font-bold text-sm text-black mb-3">Municípios deste estado</h3>

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

        {/* Busca local quando há muitos itens */}
        {grupos[abaAtiva].length > 12 && (
          <input
            type="search"
            placeholder="Filtrar municípios…"
            value={buscaMunicipio}
            onChange={(e) => setBuscaMunicipio(e.target.value)}
            aria-label="Filtrar municípios na lista"
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md mb-3 focus:outline-none focus:border-redenec-verde focus:ring-2 focus:ring-redenec-verde/20"
          />
        )}

        {/* Legenda de cor + dica */}
        <p className="text-[11px] text-gray-500 mb-3 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: abaAtual.cor }}
            aria-hidden="true"
          />
          <span>
            {legendaPorStatus[abaAtiva]} · clique em um município para ver detalhes
          </span>
        </p>

        {/* Grid 2 colunas */}
        <div className="max-h-[420px] overflow-y-auto -mx-1 px-1">
          {municipiosFiltrados.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4 text-center">
              {buscaMunicipio
                ? 'Nenhum município encontrado com essa busca.'
                : 'Nenhum município nesta categoria.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
              {municipiosFiltrados.map((m) => (
                <button
                  key={m.codigoIbge}
                  type="button"
                  onClick={() => onSelecionarMunicipio(m)}
                  className="flex items-center gap-2 py-1 px-2 text-left text-sm hover:bg-gray-100 rounded transition-colors group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: abaAtual.cor }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-gray-700 group-hover:text-redenec-azul transition-colors">
                    {m.nomeEnte}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {municipiosFiltrados.length > 0 && (
          <p className="text-[11px] text-gray-400 mt-3 text-center">
            {municipiosFiltrados.length} de {grupos[abaAtiva].length} municípios
          </p>
        )}
      </div>

      {/* Articulação institucional do estado */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <SecaoArticulacao
          titulo="Articulação institucional"
          subtitulo="Links de busca para facilitar o contato com gestores estaduais"
          links={linksArticulacao}
        />
      </div>
    </div>
  )
}

function DetalhesMunicipio({ adesao, coord }: { adesao: Adesao; coord: MunicipioCoord }) {
  const statusLabel = STATUS_LABELS[adesao.statusGrupo]
  const alunosEstimados = estimarAlunosRedeMunicipal(coord.populacao)
  const linksArticulacao = gerarLinksMunicipio(adesao.nomeEnte, adesao.uf)

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BandeiraEstado uf={adesao.uf} size="md" />
          <p className="text-[11px] uppercase tracking-widest text-gray-500">
            Município · {adesao.uf}
          </p>
        </div>
        <h2 className="text-2xl font-bold text-black mb-2 flex items-center gap-2 flex-wrap">
          {adesao.nomeEnte}
          {coord.capital && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              <Star size={11} className="fill-current" aria-hidden="true" />
              Capital
            </span>
          )}
        </h2>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusLabel.cor}`}>
          {statusLabel.texto}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Status detalhado</p>
        <p className="text-sm text-gray-700 leading-relaxed">{STATUS_ORIGINAIS[adesao.status]}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {coord.populacao !== undefined && (
          <ContextCard
            icon={<Users size={14} className="text-gray-500" aria-hidden="true" />}
            label="População"
            valor={formatarPopulacao(coord.populacao)}
            sub="habitantes"
          />
        )}

        {alunosEstimados !== null && (
          <ContextCard
            icon={<Users size={14} className="text-gray-500" aria-hidden="true" />}
            label="Rede municipal"
            valor={`~ ${formatarAlunos(alunosEstimados)}`}
            sub="alunos (estimativa)"
          />
        )}

        <ContextCard
          icon={<MapPin size={14} className="text-gray-500" aria-hidden="true" />}
          label="Região"
          valor={adesao.regiao}
        />

        <ContextCard
          icon={<Hash size={14} className="text-gray-500" aria-hidden="true" />}
          label="Código IBGE"
          valor={<span className="font-mono">{adesao.codigoIbge}</span>}
        />
      </div>

      <SecaoArticulacao
        titulo="Articulação institucional"
        subtitulo="Links de busca para facilitar o contato com gestores locais"
        links={linksArticulacao}
      />

      {alunosEstimados !== null && (
        <p className="text-[11px] text-gray-400 italic mt-4 leading-relaxed">
          * Número de alunos é estimativa baseada em proporção populacional. Para dados
          oficiais, consulte o Censo Escolar do INEP.
        </p>
      )}
    </div>
  )
}

function SecaoArticulacao({
  titulo,
  subtitulo,
  links,
}: {
  titulo: string
  subtitulo: string
  links: LinkArticulacao[]
}) {
  return (
    <div>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Phone size={14} className="text-redenec-azul" aria-hidden="true" />
          <h3 className="text-sm font-bold text-black">{titulo}</h3>
        </div>
        <p className="text-[11px] text-gray-600">{subtitulo}</p>
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-redenec-verde hover:bg-redenec-verde/5 transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-[#0F6E56]">
                {link.label}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{link.descricao}</p>
            </div>
            <ExternalLink
              size={16}
              className="text-gray-400 group-hover:text-[#0F6E56] shrink-0 ml-2"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 italic mt-3 leading-relaxed">
        Os links abrem buscas no Google. Os resultados são gerados externamente e podem
        variar ao longo do tempo.
      </p>
    </div>
  )
}

function ContextCard({
  icon,
  label,
  valor,
  sub,
}: {
  icon: React.ReactNode
  label: string
  valor: React.ReactNode
  sub?: string
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-[11px] text-gray-600">{label}</p>
      </div>
      <p className="text-base font-bold text-black leading-tight">{valor}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
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
