import React from 'react'
import { ExternalLink } from 'lucide-react'
import { copySobre } from '@/config/copy'
import { ParceirosStrip } from '@/components/visual/ParceirosStrip'
import { GrafismoModular } from '@/components/visual/GrafismoModular'

export function SobrePrograma() {
  return (
    <section
      className="relative overflow-hidden bg-redenec-petroleo text-white"
      aria-labelledby="sobre-heading"
    >
      {/* Grafismo decorativo */}
      <div
        className="absolute right-0 bottom-0 w-[280px] md:w-[360px] opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <GrafismoModular
          variante="secao"
          corCirculos="verde"
          corLinhas="branco"
        />
      </div>

      <div className="container-site section-spacing relative z-10">
        {/* Heading */}
        <h2
          id="sobre-heading"
          className="text-h2-mobile lg:text-h2-desktop font-bold text-white mb-6 max-w-2xl"
        >
          {copySobre.titulo}
        </h2>

        {/* Body text */}
        <p className="text-body text-white/85 leading-relaxed mb-6 max-w-3xl">
          {copySobre.texto}
        </p>

        {/* Link MEC */}
        <a
          href={copySobre.linkMec}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'inline-flex items-center gap-2 text-redenec-verde font-bold text-base',
            'hover:underline underline-offset-4',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde focus-visible:ring-offset-2 focus-visible:ring-offset-redenec-petroleo rounded-sm',
          ].join(' ')}
        >
          {copySobre.linkLabel}
          <ExternalLink size={16} aria-hidden="true" />
        </a>

        {/* Parceiros */}
        <div className="mt-14 pt-10 border-t border-white/20">
          <p className="text-micro font-bold text-white/60 uppercase tracking-widest mb-6 text-center">
            Parceiros institucionais
          </p>
          <ParceirosStrip invertColors />
        </div>
      </div>
    </section>
  )
}
