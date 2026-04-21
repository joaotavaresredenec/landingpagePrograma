import React from 'react'
import Image from 'next/image'

export type Parceiro = {
  nome: string
  src?: string
  alt: string
  width?: number
  height?: number
}

export type ParceirosStripProps = {
  parceiros?: Parceiro[]
  className?: string
  /** Quando true, usa filtro branco (para fundos escuros) */
  invertColors?: boolean
}

const DEFAULT_PARCEIROS: Parceiro[] = [
  {
    nome: 'MEC',
    // TODO: Adicionar logo MEC quando disponível em /public/logos/
    alt: 'Ministério da Educação (MEC)',
  },
  {
    nome: 'Redenec',
    src: '/logos/rede_nec_vetor-01.png',
    alt: 'Rede Nacional de Educação Cidadã (Redenec)',
    width: 120,
    height: 40,
  },
  {
    nome: 'CNJ',
    src: '/logos/cnj.png',
    alt: 'Conselho Nacional de Justiça (CNJ)',
    width: 80,
    height: 40,
  },
  {
    nome: 'CNMP',
    // TODO: Adicionar logo CNMP quando disponível
    alt: 'Conselho Nacional do Ministério Público (CNMP)',
  },
  {
    nome: 'CGU',
    // TODO: Adicionar logo CGU quando disponível
    alt: 'Controladoria-Geral da União (CGU)',
  },
  {
    nome: 'UNESCO',
    src: '/logos/UNESCO_logo.jpg',
    alt: 'Organização das Nações Unidas para a Educação, a Ciência e a Cultura (UNESCO)',
    width: 100,
    height: 40,
  },
  {
    nome: 'Undime',
    src: '/logos/logo-undime.webp',
    alt: 'União Nacional dos Dirigentes Municipais de Educação (Undime)',
    width: 110,
    height: 40,
  },
  {
    nome: 'Consed',
    src: '/logos/logo-consed.png',
    alt: 'Conselho Nacional de Secretários de Educação (Consed)',
    width: 100,
    height: 40,
  },
]

function ParceiroPlaceholder({
  nome,
  invertColors,
}: {
  nome: string
  invertColors?: boolean
}) {
  return (
    <div
      aria-label={nome}
      title={nome}
      className={[
        'flex h-10 min-w-[80px] items-center justify-center rounded-lg border px-3',
        'text-micro font-bold tracking-wide select-none',
        invertColors
          ? 'border-white/30 text-white/70'
          : 'border-gray-300 text-gray-500',
      ].join(' ')}
    >
      {nome}
    </div>
  )
}

export function ParceirosStrip({
  parceiros = DEFAULT_PARCEIROS,
  className = '',
  invertColors = false,
}: ParceirosStripProps) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-center gap-6 md:gap-8',
        className,
      ].join(' ')}
      role="list"
      aria-label="Parceiros institucionais"
    >
      {parceiros.map((p) => (
        <div key={p.nome} role="listitem">
          {p.src ? (
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width ?? 100}
              height={p.height ?? 40}
              className={[
                'h-10 w-auto object-contain',
                invertColors ? 'brightness-0 invert' : '',
              ].join(' ')}
            />
          ) : (
            <ParceiroPlaceholder nome={p.nome} invertColors={invertColors} />
          )}
        </div>
      ))}
    </div>
  )
}
