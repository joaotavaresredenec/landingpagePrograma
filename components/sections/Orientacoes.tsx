import React from 'react'
import { copyOrientacoes } from '@/config/copy'
import { Accordion } from '@/components/ui/Accordion'

export function Orientacoes() {
  return (
    <section
      className="bg-white"
      aria-labelledby="orientacoes-heading"
    >
      <div className="container-site section-spacing">
        <div className="max-w-2xl mb-10">
          <h2
            id="orientacoes-heading"
            className="text-h2-mobile lg:text-h2-desktop font-bold text-black"
          >
            {copyOrientacoes.titulo}
          </h2>
        </div>

        <div className="max-w-3xl">
          <Accordion itens={copyOrientacoes.itens} allowMultiple={false} />
        </div>
      </div>
    </section>
  )
}
