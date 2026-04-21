import React from 'react'
import { UserCheck, FileText, BookOpen, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { copyDesafios } from '@/config/copy'
import { CardDesafio } from '@/components/ui/CardDesafio'

const ICONS: LucideIcon[] = [UserCheck, FileText, BookOpen, BarChart2]

export function Desafios() {
  return (
    <section
      className="bg-white"
      aria-labelledby="desafios-heading"
    >
      <div className="container-site section-spacing">
        <h2
          id="desafios-heading"
          className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-4 max-w-3xl"
        >
          {copyDesafios.titulo}
        </h2>

        {copyDesafios.subtitulo && (
          <p className="text-body text-gray-600 mb-10 max-w-2xl">
            {copyDesafios.subtitulo}
          </p>
        )}

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          role="list"
          aria-label="Desafios de implementação"
        >
          {copyDesafios.cards.map((card, i) => (
            <li key={i} className="list-none">
              <CardDesafio
                titulo={card.titulo}
                corpo={card.corpo}
                icone={ICONS[i] ?? BookOpen}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
