'use client'

import React, { useState, useMemo, useId } from 'react'
import Image from 'next/image'
import { Search, X, Printer } from 'lucide-react'
import { CardMaterial } from '@/components/ui/CardMaterial'
import { CuradoriaDisclaimer } from '@/components/ui/CuradoriaDisclaimer'
import { ModalAviso } from '@/components/ui/ModalAviso'
import { HeroBiblioteca } from '@/components/visual/HeroBiblioteca'
import materialsData from '@/config/materials.json'
import {
  TIPOS_RECURSO,
  ETAPAS_ENSINO,
  TEMAS_BNCC,
  COPY_BIBLIOTECA,
} from '@/config/taxonomia'
import { copyPaginaBiblioteca } from '@/config/copy'
import type { Material, TipoRecurso, EtapaEnsino, TemaBNCC } from '@/types/material'

const materials = materialsData as Material[]

const TIPO_ORDEM = Object.keys(TIPOS_RECURSO).sort(
  (a, b) => TIPOS_RECURSO[a as TipoRecurso].ordem - TIPOS_RECURSO[b as TipoRecurso].ordem
) as TipoRecurso[]

const ETAPA_ORDEM = Object.keys(ETAPAS_ENSINO).sort(
  (a, b) => ETAPAS_ENSINO[a as EtapaEnsino].ordem - ETAPAS_ENSINO[b as EtapaEnsino].ordem
) as EtapaEnsino[]

const TEMA_ORDEM = Object.keys(TEMAS_BNCC).sort(
  (a, b) => TEMAS_BNCC[a as TemaBNCC].ordem - TEMAS_BNCC[b as TemaBNCC].ordem
) as TemaBNCC[]

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

function contarResultados(count: number): string {
  if (count === 0) return COPY_BIBLIOTECA.semResultados.split('.')[0]
  if (count === 1) return `1 ${COPY_BIBLIOTECA.resultadosSingular}`
  return `${count} ${COPY_BIBLIOTECA.resultadosPlural}`
}

export function BibliotecaCompleta({ nomeUsuario }: { nomeUsuario?: string }) {
  const searchId = useId()
  const [tipoAtivo, setTipoAtivo] = useState<TipoRecurso | null>(null)
  const [etapasSelecionadas, setEtapasSelecionadas] = useState<EtapaEnsino[]>([])
  const [temasSelecionados, setTemasSelecionados] = useState<TemaBNCC[]>([])
  const [busca, setBusca] = useState('')
  const [modalPlanoAberto, setModalPlanoAberto] = useState(false)

  const temFiltrosAtivos = etapasSelecionadas.length > 0 || temasSelecionados.length > 0

  function toggleEtapa(etapa: EtapaEnsino) {
    setEtapasSelecionadas((prev) =>
      prev.includes(etapa) ? prev.filter((e) => e !== etapa) : [...prev, etapa]
    )
  }

  function toggleTema(tema: TemaBNCC) {
    setTemasSelecionados((prev) =>
      prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]
    )
  }

  function limparFiltros() {
    setEtapasSelecionadas([])
    setTemasSelecionados([])
  }

  const materiaisFiltrados = useMemo(() => {
    let lista = materials

    if (tipoAtivo) {
      lista = lista.filter((m) => m.tipo === tipoAtivo)
    }

    if (etapasSelecionadas.length > 0) {
      lista = lista.filter((m) =>
        etapasSelecionadas.some((e) => m.etapas.includes(e))
      )
    }

    if (temasSelecionados.length > 0) {
      lista = lista.filter((m) =>
        temasSelecionados.some((t) => m.temas.includes(t))
      )
    }

    if (busca.trim()) {
      const q = busca.trim().toLowerCase()
      lista = lista.filter(
        (m) =>
          m.tituloEditorial.toLowerCase().includes(q) ||
          m.descricaoCard.toLowerCase().includes(q) ||
          m.organizacao.toLowerCase().includes(q)
      )
    }

    return lista
  }, [tipoAtivo, etapasSelecionadas, temasSelecionados, busca])

  // Contagem por tipo (respeitando filtros de etapa/tema/busca, sem filtro de tipo)
  const contagemPorTipo = useMemo(() => {
    return TIPO_ORDEM.reduce((acc, tipo) => {
      let lista = materials.filter((m) => m.tipo === tipo)
      if (etapasSelecionadas.length > 0)
        lista = lista.filter((m) => etapasSelecionadas.some((e) => m.etapas.includes(e)))
      if (temasSelecionados.length > 0)
        lista = lista.filter((m) => temasSelecionados.some((t) => m.temas.includes(t)))
      if (busca.trim()) {
        const q = busca.trim().toLowerCase()
        lista = lista.filter(
          (m) =>
            m.tituloEditorial.toLowerCase().includes(q) ||
            m.descricaoCard.toLowerCase().includes(q) ||
            m.organizacao.toLowerCase().includes(q)
        )
      }
      acc[tipo] = lista.length
      return acc
    }, {} as Record<TipoRecurso, number>)
  }, [etapasSelecionadas, temasSelecionados, busca])

  const totalSemTipo = useMemo(() => {
    let lista = materials
    if (etapasSelecionadas.length > 0)
      lista = lista.filter((m) => etapasSelecionadas.some((e) => m.etapas.includes(e)))
    if (temasSelecionados.length > 0)
      lista = lista.filter((m) => temasSelecionados.some((t) => m.temas.includes(t)))
    if (busca.trim()) {
      const q = busca.trim().toLowerCase()
      lista = lista.filter(
        (m) =>
          m.tituloEditorial.toLowerCase().includes(q) ||
          m.descricaoCard.toLowerCase().includes(q) ||
          m.organizacao.toLowerCase().includes(q)
      )
    }
    return lista.length
  }, [etapasSelecionadas, temasSelecionados, busca])

  const primeiroNome = nomeUsuario?.split(' ')[0]

  return (
    <div className="min-h-screen bg-redenec-cinza">
      <CuradoriaDisclaimer />
      <div className="container-site section-spacing">

        {/* Hero institucional */}
        <HeroBiblioteca primeiroNome={primeiroNome} />

        {/* Busca */}
        <div className="mb-6">
          <label htmlFor={searchId} className="sr-only">
            {copyPaginaBiblioteca.buscaAriaLabel}
          </label>
          <div className="relative max-w-lg">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={copyPaginaBiblioteca.buscaPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-redenec-verde"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus-visible:outline-none"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Abas por tipo */}
        <div
          role="tablist"
          aria-label="Filtrar por tipo de recurso"
          className="mb-6 flex gap-0 overflow-x-auto border-b border-gray-200 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          <button
            role="tab"
            aria-selected={tipoAtivo === null}
            onClick={() => setTipoAtivo(null)}
            className={[
              'shrink-0 px-4 pb-3 pt-1 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-t',
              tipoAtivo === null
                ? 'border-b-2 border-redenec-petroleo text-redenec-petroleo'
                : 'text-gray-500 hover:text-redenec-petroleo',
            ].join(' ')}
          >
            Todos ({totalSemTipo})
          </button>
          {TIPO_ORDEM.map((tipo) => (
            <button
              key={tipo}
              role="tab"
              aria-selected={tipoAtivo === tipo}
              onClick={() => setTipoAtivo(tipo)}
              className={[
                'shrink-0 px-4 pb-3 pt-1 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-t',
                tipoAtivo === tipo
                  ? 'border-b-2 border-redenec-petroleo text-redenec-petroleo'
                  : 'text-gray-500 hover:text-redenec-petroleo',
              ].join(' ')}
            >
              {TIPOS_RECURSO[tipo].label} ({contagemPorTipo[tipo]})
            </button>
          ))}
        </div>

        {/* Filtros facetados */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <div>
            <p className="text-micro font-bold text-gray-500 uppercase tracking-widest mb-3">
              Etapa de ensino
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filtrar por etapa de ensino"
            >
              {ETAPA_ORDEM.map((etapa) => (
                <FilterPill
                  key={etapa}
                  label={ETAPAS_ENSINO[etapa].label}
                  active={etapasSelecionadas.includes(etapa)}
                  onClick={() => toggleEtapa(etapa)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-micro font-bold text-gray-500 uppercase tracking-widest mb-3">
                Tema BNCC
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrar por tema BNCC"
              >
                {TEMA_ORDEM.map((tema) => (
                  <FilterPill
                    key={tema}
                    label={TEMAS_BNCC[tema].label}
                    active={temasSelecionados.includes(tema)}
                    onClick={() => toggleTema(tema)}
                  />
                ))}
              </div>
            </div>

            {temFiltrosAtivos && (
              <button
                type="button"
                onClick={limparFiltros}
                className="shrink-0 self-end sm:self-start rounded-pill px-4 py-2 text-sm font-bold text-gray-500 border border-gray-200 hover:text-redenec-petroleo hover:border-redenec-petroleo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
              >
                {COPY_BIBLIOTECA.limparFiltros}
              </button>
            )}
          </div>
        </div>

        {/* Contagem e resultados */}
        {materiaisFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <p className="text-body font-bold text-gray-700">
              {COPY_BIBLIOTECA.semResultados}
            </p>
            <p className="text-body text-gray-500">
              {COPY_BIBLIOTECA.semResultadosSugestao}
            </p>
            <button
              type="button"
              onClick={limparFiltros}
              className="mt-1 rounded-pill bg-redenec-petroleo px-5 py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
            >
              {COPY_BIBLIOTECA.limparFiltros}
            </button>
          </div>
        ) : (
          <>
            <p className="text-micro text-gray-500 mb-4" aria-live="polite">
              {contarResultados(materiaisFiltrados.length)}
            </p>
            <div
              role="tabpanel"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {materiaisFiltrados.map((material) => (
                <CardMaterial key={material.id} material={material} />
              ))}
            </div>
          </>
        )}

        {/* Recursos para download */}
        <div className="mt-12 border-t border-gray-200 pt-8 grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setModalPlanoAberto(true)}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow group text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-redenec-petroleo/10 group-hover:bg-redenec-petroleo/20 transition-colors">
              <Printer size={20} className="text-redenec-petroleo" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">Modelo de Plano de Ação</p>
              <p className="text-xs text-gray-500">Disponibilização pelo MEC em breve</p>
            </div>
          </button>
          <a
            href="/portaria-642-2025-pecs.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex h-12 w-16 shrink-0 items-center justify-center">
              <Image
                src="/logos/diariooficialdauniao.png"
                alt="Diário Oficial da União"
                width={64}
                height={48}
                className="h-10 w-auto object-contain logo-sem-fundo-branco"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">Portaria MEC nº 642/2025</p>
              <p className="text-xs text-gray-500">Documento oficial do Programa · PDF</p>
            </div>
          </a>
        </div>

        <p className="mt-6 text-micro text-gray-400 text-center">
          Dúvidas ou sugestões: contato@redenec.org
        </p>
      </div>

      <ModalAviso
        aberto={modalPlanoAberto}
        aoFechar={() => setModalPlanoAberto(false)}
        titulo="Modelo de Plano de Ação"
      >
        <p>
          O modelo oficial do Plano de Ação será disponibilizado pelo Ministério
          da Educação em breve, via plataforma SIMEC.
        </p>
        <p>
          Assim que estiver disponível, o link de acesso também será publicado
          neste site para facilitar o acesso das redes de ensino.
        </p>
        <p>
          Enquanto isso, recomendamos consultar as orientações gerais disponíveis
          na seção &ldquo;Como elaborar o plano de ação&rdquo; deste portal.
        </p>
      </ModalAviso>
    </div>
  )
}
