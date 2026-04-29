'use client'

import { useMemo, useState } from 'react'
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react'
import type { Adesao, EstatisticasEstado } from '@/lib/mapa/tipos'
import {
  baixarPdfMunicipiosEstado,
  baixarExcelMunicipiosEstado,
} from '@/lib/mapa/exportar-municipios'

type Props = {
  adesoes: Adesao[]
  rankingEstados: EstatisticasEstado[]
}

type FormatoExport = 'pdf' | 'excel'

export function CardExportarRelacao({ adesoes, rankingEstados }: Props) {
  const [ufSelecionada, setUfSelecionada] = useState<string>('')
  const [gerando, setGerando] = useState<FormatoExport | null>(null)

  // DF nao possui municipios — fica fora do select.
  const estadosOrdenados = useMemo(
    () =>
      rankingEstados
        .filter((e) => e.uf !== 'DF')
        .slice()
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [rankingEstados],
  )

  const estadoEscolhido = useMemo(
    () => estadosOrdenados.find((e) => e.uf === ufSelecionada) ?? null,
    [estadosOrdenados, ufSelecionada],
  )

  async function exportar(formato: FormatoExport) {
    if (!estadoEscolhido || gerando) return
    const municipios = adesoes.filter(
      (a) => a.tipo === 'municipio' && a.uf === estadoEscolhido.uf,
    )
    setGerando(formato)
    try {
      if (formato === 'pdf') {
        await baixarPdfMunicipiosEstado(
          municipios,
          estadoEscolhido.uf,
          estadoEscolhido.nome,
          estadoEscolhido.statusProprio,
        )
      } else {
        await baixarExcelMunicipiosEstado(
          municipios,
          estadoEscolhido.uf,
          estadoEscolhido.nome,
          estadoEscolhido.statusProprio,
        )
      }
    } catch (err) {
      console.error(`Erro ao gerar ${formato} da relação de municípios:`, err)
    } finally {
      setGerando(null)
    }
  }

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-r from-redenec-petroleo to-[#0c5379] text-white shadow-md overflow-hidden">
      <div className="p-5 md:p-6 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        {/* Ícone destacado */}
        <div className="hidden md:flex w-14 h-14 rounded-xl bg-redenec-verde/20 border border-redenec-verde/40 items-center justify-center shrink-0">
          <FileDown size={28} className="text-redenec-verde" aria-hidden="true" />
        </div>

        {/* Texto */}
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-redenec-verde mb-1">
            Material para articulação
          </p>
          <h2 className="text-lg md:text-xl font-bold leading-tight">
            Baixe a relação completa do estado em PDF
          </h2>
          <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
            Lista com todos os municípios agrupados por estágio (aderiu, em adesão e não
            iniciado), pronta para imprimir e levar para reuniões institucionais.
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-col gap-2 md:items-stretch">
          <label className="sr-only" htmlFor="card-exportar-uf">
            Selecionar estado
          </label>
          <select
            id="card-exportar-uf"
            value={ufSelecionada}
            onChange={(e) => setUfSelecionada(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-white text-redenec-petroleo text-sm font-medium border border-white/30 focus:outline-none focus:ring-2 focus:ring-redenec-verde min-w-[200px]"
          >
            <option value="">Selecione um estado…</option>
            {estadosOrdenados.map((e) => (
              <option key={e.uf} value={e.uf}>
                {e.nome} ({e.uf})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => exportar('pdf')}
              disabled={!estadoEscolhido || gerando !== null}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-redenec-verde text-redenec-petroleo font-bold text-sm hover:brightness-95 active:brightness-90 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-redenec-petroleo whitespace-nowrap"
              aria-label={
                estadoEscolhido
                  ? `Exportar relação completa de ${estadoEscolhido.nome} em PDF`
                  : 'Selecione um estado para exportar em PDF'
              }
            >
              <FileText size={16} aria-hidden="true" />
              {gerando === 'pdf' ? 'Gerando…' : 'PDF'}
            </button>

            <button
              type="button"
              onClick={() => exportar('excel')}
              disabled={!estadoEscolhido || gerando !== null}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-redenec-petroleo font-bold text-sm hover:bg-white/90 active:bg-white/80 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-redenec-petroleo whitespace-nowrap"
              aria-label={
                estadoEscolhido
                  ? `Exportar relação completa de ${estadoEscolhido.nome} em Excel`
                  : 'Selecione um estado para exportar em Excel'
              }
            >
              <FileSpreadsheet size={16} aria-hidden="true" />
              {gerando === 'excel' ? 'Gerando…' : 'Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* Faixa de rodapé: material de orientação institucional */}
      <div className="px-5 md:px-6 py-3 bg-black/20 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-white/85 leading-snug">
          <span className="font-bold text-white">Material de orientação às redes:</span>{' '}
          guia oficial sobre como aderir ao PECS.
        </p>
        <a
          href="/Guia PECS — Como aderir · Redenec.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-redenec-petroleo text-xs font-bold hover:brightness-95 active:brightness-90 transition focus:outline-none focus:ring-2 focus:ring-redenec-verde focus:ring-offset-2 focus:ring-offset-redenec-petroleo whitespace-nowrap shrink-0"
          aria-label="Baixar Material de orientação às redes em PDF"
        >
          <FileDown size={14} aria-hidden="true" />
          Baixar PDF
        </a>
      </div>
    </div>
  )
}
