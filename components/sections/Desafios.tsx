import React from 'react'
import { UserCheck, FileText, BookOpen, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { copyDesafios } from '@/config/copy'
import { CardDesafio } from '@/components/ui/CardDesafio'
import { GrafismoRedenec } from '@/components/visual/GrafismoRedenec'

const ICONS: LucideIcon[] = [UserCheck, FileText, BookOpen, BarChart2]

export function Desafios() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="desafios-heading"
    >
      <div className="absolute right-0 top-0 opacity-30 pointer-events-none">
        <GrafismoRedenec rotate={90} opacity={1} blendMode="multiply" size={280} />
      </div>
      <div className="container-site section-spacing relative z-10">
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
