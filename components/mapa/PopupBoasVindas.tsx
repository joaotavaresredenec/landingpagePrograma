'use client'

import { useEffect, useState } from 'react'
import { X, AlertTriangle, Info } from 'lucide-react'

const COOKIE_KEY = 'redenec_mapa_popup_visto'

export function PopupBoasVindas() {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const jaViu = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith(`${COOKIE_KEY}=`))
    if (!jaViu) {
      const timer = setTimeout(() => setAberto(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  function fechar() {
    // Cookie de sessão (sem expires/maxAge): apaga ao fechar o browser
    document.cookie = `${COOKIE_KEY}=1; path=/; SameSite=Lax`
    setAberto(false)
  }

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-mapa-titulo"
      onClick={fechar}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 md:p-8">
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar aviso"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
          >
            <X size={22} />
          </button>

          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-redenec-verde mb-2">
              Antes de continuar
            </p>
            <h2
              id="popup-mapa-titulo"
              className="text-xl md:text-2xl font-bold text-redenec-petroleo leading-tight"
            >
              Orientações sobre o uso destes dados
            </h2>
          </div>

          <div className="space-y-4">

            <div className="flex gap-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-amber-900 mb-1.5 text-sm">
                  Abordagem institucional com sensibilidade
                </h3>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Ao articular com redes de ensino identificadas neste mapa, recomendamos
                  cautela e profissionalismo. Redes ainda não aderentes podem enfrentar
                  limitações estruturais, técnicas ou de capacidade institucional que
                  dificultam a adesão. O diálogo deve considerar o contexto local e ser
                  conduzido com respeito às especificidades de cada ente federado.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-blue-50 border-l-4 border-redenec-azul rounded-r-md">
              <Info size={20} className="text-redenec-azul shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-[#0C447C] mb-1.5 text-sm">Origem dos dados</h3>
                <p className="text-sm text-[#0C447C] leading-relaxed">
                  Em razão do Acordo de Cooperação nº 14/2025 celebrado entre a Rede
                  Nacional de Educação Cidadã e o Ministério da Educação, com objetivo
                  de apoiar a implementação do Programa Educação para a Cidadania e
                  Sustentabilidade, os dados de adesão apresentados neste mapa são
                  compartilhados pelo MEC.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-[11px] text-gray-500 italic">
              Este aviso aparece apenas uma vez por sessão.
            </p>
            <button
              type="button"
              onClick={fechar}
              className="w-full sm:w-auto px-6 py-2.5 rounded-pill bg-redenec-verde text-black font-bold text-sm hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
            >
              Entendi, continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
