'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type ModalAvisoProps = {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  children: React.ReactNode
}

export function ModalAviso({ aberto, aoFechar, titulo, children }: ModalAvisoProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') aoFechar()
    }
    if (aberto) {
      document.addEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={aoFechar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 id="modal-titulo" className="text-xl font-bold text-black">{titulo}</h2>
          <button
            onClick={aoFechar}
            aria-label="Fechar aviso"
            className="text-gray-500 hover:text-black transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
          >
            <X size={20} />
          </button>
        </div>
        <div className="text-gray-700 leading-relaxed text-sm md:text-base space-y-4">
          {children}
        </div>
        <button
          onClick={aoFechar}
          className="mt-6 rounded-pill bg-redenec-verde text-black font-bold py-2.5 px-6 text-sm hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
