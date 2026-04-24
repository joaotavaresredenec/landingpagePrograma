'use client'

import { useState } from 'react'
import {
  Megaphone,
  FileText,
  Mail,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { TipoModelo, DadosEnte } from '@/lib/mapa/modelos-articulacao'
import { gerarTextoModelo, MODELOS_INFO } from '@/lib/mapa/modelos-articulacao'

type Props = {
  ente: DadosEnte
}

const MODELOS_DISPONIVEIS: TipoModelo[] = [
  'oficio_publico',
  'oficio_privado',
  'email_publico',
  'email_privado',
]

export function ModeloArticulacao({ ente }: Props) {
  const [modeloAberto, setModeloAberto] = useState<TipoModelo | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [expandido, setExpandido] = useState(false)

  const texto = modeloAberto ? gerarTextoModelo(modeloAberto, ente) : ''

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between mb-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
        aria-expanded={expandido}
      >
        <div className="flex items-center gap-2">
          <Megaphone size={18} className="text-redenec-azul" aria-hidden="true" />
          <h3 className="text-base font-bold text-gray-900">Quero articular</h3>
        </div>
        {expandido ? (
          <ChevronUp
            size={18}
            className="text-gray-400 group-hover:text-gray-600"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            size={18}
            className="text-gray-400 group-hover:text-gray-600"
            aria-hidden="true"
          />
        )}
      </button>

      {expandido && (
        <>
          <p className="text-xs text-gray-600 mb-4">
            Escolha como você quer começar a articulação com{' '}
            <strong>{ente.nome}</strong>. Os textos já vêm pré-preenchidos — é
            só ajustar os campos entre colchetes e enviar.
          </p>

          <div className="grid grid-cols-1 gap-2 mb-4">
            {MODELOS_DISPONIVEIS.map((tipo) => {
              const info = MODELOS_INFO[tipo]
              const Icone = info.icone === 'mail' ? Mail : FileText
              const isAtivo = modeloAberto === tipo

              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setModeloAberto(isAtivo ? null : tipo)}
                  className={[
                    'flex items-start gap-3 p-3 rounded-lg border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
                    isAtivo
                      ? 'border-redenec-verde bg-redenec-verde/5'
                      : 'border-gray-200 hover:border-redenec-verde/50 hover:bg-gray-50',
                  ].join(' ')}
                  aria-pressed={isAtivo}
                >
                  <div
                    className={[
                      'w-8 h-8 rounded flex items-center justify-center shrink-0',
                      isAtivo ? 'bg-redenec-verde' : 'bg-gray-100',
                    ].join(' ')}
                  >
                    <Icone
                      size={16}
                      className={isAtivo ? 'text-[#0F6E56]' : 'text-gray-500'}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">
                      {info.titulo}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {info.descricao}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {modeloAberto && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
                <p className="text-xs font-medium text-gray-700">
                  Ajuste os campos em [COLCHETES] antes de enviar
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={copiarTexto}
                    className={[
                      'flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
                      copiado
                        ? 'bg-redenec-verde text-[#0F6E56]'
                        : 'bg-redenec-azul text-white hover:bg-[#0C447C]',
                    ].join(' ')}
                  >
                    {copiado ? (
                      <>
                        <Check size={12} aria-hidden="true" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={12} aria-hidden="true" />
                        Copiar texto
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModeloAberto(null)}
                    className="p-1 text-gray-400 hover:text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
                    aria-label="Fechar modelo"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {texto}
                </pre>
              </div>

              <div className="px-3 py-2 bg-amber-50 border-t border-amber-200">
                <p className="text-xs text-amber-800">
                  <strong>Dica:</strong> substitua os campos entre colchetes
                  [CAMPO] pelos dados específicos antes de enviar. Adapte
                  livremente o tom e conteúdo conforme o contexto da
                  articulação.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
