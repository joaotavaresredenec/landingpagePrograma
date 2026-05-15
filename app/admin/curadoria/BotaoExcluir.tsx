'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { excluirSubmissao } from './actions'

export function BotaoExcluir({
  id,
  titulo,
}: {
  id: string
  titulo: string
}) {
  const [pending, start] = useTransition()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    const ok = window.confirm(
      `Tem certeza? Esta ação não pode ser desfeita.\n\n"${titulo}" será excluída permanentemente.`,
    )
    if (!ok) return
    start(async () => {
      try {
        await excluirSubmissao(id)
      } catch (err) {
        alert((err as Error).message)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={`Excluir submissão "${titulo}"`}
      className="rounded-lg p-1.5 text-redenec-petroleo/40 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
    >
      <Trash2 size={16} aria-hidden="true" />
    </button>
  )
}
