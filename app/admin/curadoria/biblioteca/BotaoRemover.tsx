'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { removerMaterialPublicado } from './actions'

export function BotaoRemover({
  slug,
  titulo,
}: {
  slug: string
  titulo: string
}) {
  const [pending, start] = useTransition()

  function handleClick() {
    if (pending) return
    const ok = window.confirm(
      `Tem certeza? O material será removido da biblioteca permanentemente.\n\n"${titulo}"`,
    )
    if (!ok) return
    start(async () => {
      try {
        await removerMaterialPublicado(slug)
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
      aria-label={`Remover "${titulo}" da biblioteca`}
      className="inline-flex items-center gap-1.5 rounded-pill border border-redenec-coral/40 px-4 py-2 text-xs font-bold text-redenec-petroleo transition-colors hover:border-redenec-coral hover:bg-redenec-coral/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-coral disabled:opacity-50"
    >
      <Trash2 size={14} aria-hidden="true" />
      {pending ? 'Removendo…' : 'Remover'}
    </button>
  )
}
