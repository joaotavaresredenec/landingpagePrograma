import Image from 'next/image'
import materialsData from '@/config/materials.json'
import { TEMAS_BNCC } from '@/config/taxonomia'
import type { Material } from '@/types/material'
import { GrafismoHero } from './GrafismoHero'

const materials = materialsData as Material[]

const STATS = [
  { num: String(materials.length), label: 'Recursos curados' },
  {
    num: String(new Set(materials.map((m) => m.organizacao)).size),
    label: 'Organizações autoras',
  },
  { num: String(Object.keys(TEMAS_BNCC).length), label: 'Temas BNCC' },
  { num: '100%', label: 'Acesso gratuito' },
]

type Props = {
  primeiroNome?: string
}

export function HeroBiblioteca({ primeiroNome }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-redenec-petroleo mb-6 px-8 py-12 sm:px-12 sm:py-14">

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">

        {/* Coluna esquerda — conteúdo */}
        <div className="max-w-[560px]">

          {/* Saudação */}
          {primeiroNome && (
            <p className="text-[13px] text-white/75 mb-5">
              Olá, {primeiroNome}. Seu acesso é válido por 30 dias.
            </p>
          )}

          {/* Eyebrow */}
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-redenec-verde mb-3">
            Acervo Redenec
          </p>

          {/* Título */}
          <h1 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold text-white leading-[1.1] mb-3">
            Biblioteca Nacional de Educação Cidadã
          </h1>

          {/* Subtítulo */}
          <p className="text-[15px] text-white/85 leading-relaxed mb-8">
            {materials.length} recursos pedagógicos curados para apoiar secretarias, escolas e educadores
            na implementação do Programa Educação para a Cidadania e Sustentabilidade.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-5">
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <p className="text-[28px] font-bold text-redenec-verde leading-none">{num}</p>
                <p className="text-[11px] text-white/75 mt-1">{label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Coluna direita — grafismo + logos */}
        <div className="flex flex-col items-center gap-8">

          {/* Grafismo decorativo — apenas desktop */}
          <div className="absolute top-0 right-0 opacity-[0.15] pointer-events-none hidden lg:block" aria-hidden="true">
            <GrafismoHero size={200} />
          </div>

          {/* Logo Redenec grande — branca */}
          <div className="relative z-10">
            <Image
              src="/logos/rede_nec_vetor-01.png"
              alt="Rede Nacional de Educação Cidadã"
              width={200}
              height={65}
              className="h-20 w-auto object-contain logo-branco"
            />
          </div>

          {/* Apoio — Instituto Unibanco */}
          <div className="relative z-10 text-center border-t border-white/15 pt-6 w-full flex flex-col items-center gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">
              Apoio
            </p>
            <Image
              src="/logos/instituto-unibanco.png"
              alt="Instituto Unibanco"
              width={150}
              height={50}
              className="h-12 w-auto object-contain logo-branco"
            />
          </div>

        </div>

      </div>

      {/* Grafismo mobile — canto inferior direito */}
      <div className="absolute bottom-0 right-0 opacity-[0.08] pointer-events-none lg:hidden" aria-hidden="true">
        <GrafismoHero size={120} />
      </div>

    </div>
  )
}
