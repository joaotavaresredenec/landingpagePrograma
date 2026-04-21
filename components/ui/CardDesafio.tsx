import React from 'react'
import type { LucideIcon } from 'lucide-react'

export type CardDesafioProps = {
  titulo: string
  corpo: string
  icone: LucideIcon
}

export function CardDesafio({ titulo, corpo, icone: Icon }: CardDesafioProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-redenec-verde/20"
        aria-hidden="true"
      >
        <Icon size={24} className="text-redenec-petroleo" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 font-bold text-black leading-snug">{titulo}</h3>
        <p className="text-body text-gray-600 leading-relaxed">{corpo}</p>
      </div>
    </article>
  )
}
