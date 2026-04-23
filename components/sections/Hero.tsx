import React from 'react'
import { copyHero } from '@/config/copy'
import { Button } from '@/components/primitives/Button'
import { Logo } from '@/components/visual/Logo'
import { GrafismoModular } from '@/components/visual/GrafismoModular'
import { GrafismoRedenec } from '@/components/visual/GrafismoRedenec'
import { ParceirosStrip } from '@/components/visual/ParceirosStrip'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-redenec-cinza"
      aria-labelledby="hero-heading"
    >
      {/* Grafismo modular — canto superior direito */}
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

      {/* Grafismo Redenec — canto inferior esquerdo, girado */}
      <div className="absolute -left-16 -bottom-10 pointer-events-none opacity-60">
        <GrafismoRedenec rotate={210} opacity={0.55} blendMode="multiply" size={320} />
      </div>

      <div className="container-site pt-4 md:pt-6 pb-12 md:pb-20 relative z-10">
        {/* Logo */}
        <div className="mb-4">
          <Logo variant="principal" width={160} height={52} />
        </div>

        {/* Hero content */}
        <div className="max-w-2xl pt-32 md:pt-40">
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

        {/* Parceiros institucionais */}
        <div className="mt-16 pt-10 border-t border-black/10">
          <ParceirosStrip />
        </div>
      </div>
    </section>
  )
}
