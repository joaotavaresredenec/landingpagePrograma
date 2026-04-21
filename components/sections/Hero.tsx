import React from 'react'
import { copyHero } from '@/config/copy'
import { Button } from '@/components/primitives/Button'
import { Logo } from '@/components/visual/Logo'
import { GrafismoModular } from '@/components/visual/GrafismoModular'
import { ParceirosStrip } from '@/components/visual/ParceirosStrip'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-redenec-cinza"
      aria-labelledby="hero-heading"
    >
      {/* Grafismo — canto superior direito */}
      <div
        className="absolute -right-8 -top-8 w-[300px] md:w-[420px] lg:w-[520px] opacity-80 pointer-events-none"
        aria-hidden="true"
      >
        <GrafismoModular
          variante="hero"
          corCirculos="misto"
          corLinhas="preto"
        />
      </div>

      <div className="container-site section-spacing relative z-10">
        {/* Logo */}
        <div className="mb-10">
          <Logo variant="principal" width={160} height={52} />
        </div>

        {/* Hero content */}
        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className="text-h1-mobile lg:text-h1-desktop font-bold text-black leading-tight mb-6"
          >
            {copyHero.headline}
          </h1>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-xl">
            {copyHero.subheadline}
          </p>

          <Button variant="primary" size="lg" asLink="#formulario">
            {copyHero.ctaLabel}
          </Button>
        </div>

        {/* Parceiros strip */}
        <div className="mt-16 pt-10 border-t border-black/10">
          <p className="text-micro font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
            Parceiros institucionais
          </p>
          <ParceirosStrip />
        </div>
      </div>
    </section>
  )
}
