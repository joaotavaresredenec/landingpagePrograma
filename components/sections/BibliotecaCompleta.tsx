'use client'

import React, { useState, useMemo } from 'react'
import { Users, ClipboardList, Route, Layers, Gamepad2, Star, type LucideIcon } from 'lucide-react'
import { CardMaterial } from '@/components/ui/CardMaterial'
import {
  materials,
  TIPO_LABELS,
  ETAPA_LABELS,
  type TipoMaterial,
  type EtapaEnsino,
} from '@/config/materials'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  ClipboardList,
  Route,
  Layers,
  Gamepad2,
  Star,
}

type Ordenacao = 'recente' | 'antigo'

const TODOS_TIPOS = Object.keys(TIPO_LABELS) as TipoMaterial[]
const TODAS_ETAPAS = Object.keys(ETAPA_LABELS) as EtapaEnsino[]

type FilterPillProps = {
  label: string
  active: boolean
  onClick: () => void
}

function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-pill px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
        active
          ? 'bg-redenec-petroleo text-white'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-redenec-petroleo hover:text-redenec-petroleo',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function BibliotecaCompleta({ nomeUsuario }: { nomeUsuario?: string }) {
  const [tiposSelecionados, setTiposSelecionados] = useState<TipoMaterial[]>([])
  const [etapaSelecionada, setEtapaSelecionada] = useState<EtapaEnsino | null>(null)
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('recente')

  function toggleTipo(tipo: TipoMaterial) {
    setTiposSelecionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )
  }

  function toggleEtapa(etapa: EtapaEnsino) {
    setEtapaSelecionada((prev) => (prev === etapa ? null : etapa))
  }

  const materiaisFiltrados = useMemo(() => {
    let lista = [...materials]

    if (tiposSelecionados.length > 0) {
      lista = lista.filter((m) => tiposSelecionados.includes(m.tipo))
    }

    if (etapaSelecionada) {
      lista = lista.filter(
        (m) => m.etapas.includes(etapaSelecionada) || m.etapas.includes('todas')
      )
    }

    lista.sort((a, b) => {
      const diff = new Date(a.dataPublicacao).getTime() - new Date(b.dataPublicacao).getTime()
      return ordenacao === 'recente' ? -diff : diff
    })

    return lista
  }, [tiposSelecionados, etapaSelecionada, ordenacao])

  const primeiroNome = nomeUsuario?.split(' ')[0]

  return (
    <div className="min-h-screen bg-redenec-cinza">
      <div className="container-site section-spacing">

        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-2">
            {primeiroNome ? `Olá, ${primeiroNome}. ` : ''}Materiais e orientações
          </h1>
          <p className="text-body text-gray-600">
            Conteúdos organizados pela Redenec para apoiar a implementação do Programa na sua rede.
          </p>
        </div>

        {/* Filtros e ordenação */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl bg-white border border-gray-100 shadow-sm p-5">

          {/* Tipo de material */}
          <div>
            <p className="text-micro font-bold text-gray-500 uppercase tracking-widest mb-3">
              Tipo de material
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo de material">
              {TODOS_TIPOS.map((tipo) => (
                <FilterPill
                  key={tipo}
                  label={TIPO_LABELS[tipo]}
                  active={tiposSelecionados.includes(tipo)}
                  onClick={() => toggleTipo(tipo)}
                />
              ))}
              {tiposSelecionados.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTiposSelecionados([])}
                  className="rounded-pill px-4 py-2 text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Etapa de ensino + Ordenação */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div>
              <p className="text-micro font-bold text-gray-500 uppercase tracking-widest mb-3">
                Etapa de ensino
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por etapa de ensino">
                {TODAS_ETAPAS.map((etapa) => (
                  <FilterPill
                    key={etapa}
                    label={ETAPA_LABELS[etapa]}
                    active={etapaSelecionada === etapa}
                    onClick={() => toggleEtapa(etapa)}
                  />
                ))}
              </div>
            </div>

            <div className="shrink-0">
              <p className="text-micro font-bold text-gray-500 uppercase tracking-widest mb-3">
                Ordenar por
              </p>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-redenec-verde cursor-pointer"
                aria-label="Ordenação dos materiais"
              >
                <option value="recente">Mais recente primeiro</option>
                <option value="antigo">Mais antigo primeiro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {materiaisFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-body font-bold text-gray-500 mb-2">
              Nenhum material encontrado com esses filtros.
            </p>
            <button
              type="button"
              onClick={() => { setTiposSelecionados([]); setEtapaSelecionada(null) }}
              className="text-redenec-azul text-sm font-bold underline underline-offset-2"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="text-micro text-gray-500 mb-4">
              {materiaisFiltrados.length === materials.length
                ? `${materials.length} materiais disponíveis`
                : `${materiaisFiltrados.length} de ${materials.length} materiais`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiaisFiltrados.map((material) => {
                const Icone = ICON_MAP[material.icone] ?? Users
                return (
                  <CardMaterial
                    key={material.id}
                    titulo={material.titulo}
                    descricao={material.resumo}
                    icone={Icone}
                    tipo={material.tipo}
                    driveUrl={material.driveUrl}
                  />
                )
              })}
            </div>
          </>
        )}

        <p className="mt-12 text-micro text-gray-400 text-center">
          Mais materiais em breve. Dúvidas: contato@redenec.org
        </p>
      </div>
    </div>
  )
}
