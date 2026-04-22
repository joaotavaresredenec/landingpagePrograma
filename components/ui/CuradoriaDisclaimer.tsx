'use client'

import { useEffect, useState } from 'react'
import { X, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'redenec_curadoria_aceito'

export function CuradoriaDisclaimer() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function fechar() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={fechar}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header verde */}
        <div className="bg-redenec-petroleo px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-redenec-verde/20">
                <ShieldCheck size={22} className="text-redenec-verde" aria-hidden="true" />
              </div>
              <h2
                id="disclaimer-titulo"
                className="text-lg font-bold text-white leading-snug"
              >
                Nota sobre esta biblioteca
              </h2>
            </div>
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar aviso"
              className="shrink-0 mt-0.5 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-[15px] font-bold text-gray-900 leading-snug">
            Os materiais desta biblioteca foram curados pela{' '}
            <span className="text-redenec-petroleo">Rede Nacional de Educação Cidadã (Redenec)</span>,
            não pelo Ministério da Educação.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            Eles são fruto de <strong className="font-semibold text-gray-800">quatro anos de articulação da Redenec</strong> com organizações do ecossistema de educação cidadã — e já foram testados por milhares de professores em todo o Brasil. Todos prezam pelo <strong className="font-semibold text-gray-800">suprapartidarismo</strong> e pelo alinhamento às competências e habilidades da BNCC.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            O MEC avaliará a convergência pedagógica de cada um deles e os incluirá nas plataformas oficiais do Ministério em breve.
          </p>

          {/* Destaque */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-800">
              Para comunicados e publicações oficiais do Programa, consulte o canal oficial no{' '}
              <a
                href="https://www.gov.br/mec"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                site do MEC (gov.br/mec)
              </a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={fechar}
            className="w-full rounded-pill bg-redenec-petroleo px-5 py-3 text-sm font-bold text-white hover:bg-opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          >
            Entendi, quero continuar
          </button>
        </div>
      </div>
    </div>
  )
}
