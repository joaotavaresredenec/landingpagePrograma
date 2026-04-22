import React from 'react'
import { Users, ClipboardList, Route, Layers, Gamepad2, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { copyBiblioteca } from '@/config/copy'
import { Button } from '@/components/primitives/Button'

const ICONS: LucideIcon[] = [Users, ClipboardList, Route, Layers, Gamepad2, Star]

export function BibliotecaPreview() {
  return (
    <section
      className="bg-redenec-cinza"
      aria-labelledby="biblioteca-heading"
    >
      <div className="container-site section-spacing">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <h2
            id="biblioteca-heading"
            className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-4"
          >
            {copyBiblioteca.titulo}
          </h2>
          <p className="text-body text-gray-600">{copyBiblioteca.subtitulo}</p>
        </div>

        {/* Grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Materiais disponíveis"
        >
          {copyBiblioteca.cards.map((card, i) => {
            const Icon = ICONS[i] ?? Star
            return (
              <li key={i} className="list-none flex">
                <article className="flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 w-full">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-redenec-verde/20"
                    aria-hidden="true"
                  >
                    <Icon size={24} className="text-redenec-petroleo" />
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-h3 font-bold text-black leading-snug">
                      {card.titulo}
                    </h3>
                    <p className="text-body text-gray-600 leading-relaxed flex-1">
                      {card.descricao}
                    </p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        {/* CTA global */}
        <div className="mt-10 text-center">
          <Button variant="primary" size="lg" asLink="#formulario">
            Ver todos os materiais
          </Button>
        </div>
      </div>
    </section>
  )
}
