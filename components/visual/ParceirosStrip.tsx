import Image from 'next/image'

const MEC_URL = 'https://www.gov.br/mec/pt-br/programa-educacao-cidadania-sustentabilidade'

const MEC = {
  nome: 'MEC',
  src: '/logos/MEC2025.png',
  alt: 'Ministério da Educação (MEC) — Governo Federal',
  width: 320,
  height: 80,
}

type LogoEntry = {
  nome: string
  src: string
  alt: string
  width: number
  height: number
  imageClass?: string
}

const PARCEIROS: LogoEntry[] = [
  {
    nome: 'Redenec',
    src: '/logos/rede_nec_vetor-01.png',
    alt: 'Rede Nacional de Educação Cidadã (Redenec)',
    width: 120,
    height: 40,
  },
  {
    nome: 'CNJ',
    src: '/logos/cnjlogo.png',
    alt: 'Conselho Nacional de Justiça (CNJ)',
    width: 140,
    height: 60,
  },
  {
    nome: 'CNMP',
    src: '/logos/logocnmp.png',
    alt: 'Conselho Nacional do Ministério Público (CNMP)',
    width: 140,
    height: 60,
  },
  {
    nome: 'UNESCO',
    src: '/logos/unescologo.png',
    alt: 'Organização das Nações Unidas para a Educação, a Ciência e a Cultura (UNESCO)',
    width: 140,
    height: 50,
  },
  {
    nome: 'Undime',
    src: '/logos/undimelogo.png',
    alt: 'União Nacional dos Dirigentes Municipais de Educação (Undime)',
    width: 140,
    height: 50,
  },
  {
    nome: 'Consed',
    src: '/logos/consed-horizontal.png',
    alt: 'Conselho Nacional de Secretários de Educação (Consed)',
    width: 240,
    height: 50,
    imageClass: 'h-7 w-auto object-contain',
  },
  {
    nome: 'Viven',
    src: '/logos/orgs/viven.png',
    alt: 'Viven',
    width: 120,
    height: 40,
  },
  {
    nome: 'ABEL',
    src: '/logos/abel.png',
    alt: 'Associação Brasileira das Escolas Legislativas (ABEL)',
    width: 160,
    height: 50,
  },
]

function LogoImg({ p, invertColors }: { p: LogoEntry; invertColors?: boolean }) {
  const base = p.imageClass ?? 'h-10 w-auto object-contain'
  const blend = invertColors ? 'logo-branco' : 'logo-sem-fundo-branco'
  return (
    <Image
      src={p.src}
      alt={p.alt}
      width={p.width}
      height={p.height}
      className={[base, blend].join(' ')}
    />
  )
}

type Props = {
  invertColors?: boolean
  className?: string
}

export function ParceirosStrip({ invertColors = false, className = '' }: Props) {
  const labelCls = invertColors ? 'text-white/50' : 'text-gray-400'
  const subCls = invertColors ? 'text-white/35' : 'text-gray-400'
  const dividerCls = invertColors ? 'border-white/10' : 'border-black/[0.08]'

  return (
    <div className={['space-y-10', className].join(' ')}>

      {/* Seção 1 — Realização do Programa */}
      <div className="text-center">
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${labelCls}`}>
          Realização do Programa
        </p>
        <p className={`text-[11px] mb-6 ${subCls}`}>
          Programa Educação para a Cidadania e Sustentabilidade — Portaria MEC nº 642/2025
        </p>
        <div className="flex justify-center">
          <a
            href={MEC_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Site oficial do Programa no MEC (abre em nova aba)"
            title="Acessar o site oficial do Programa no MEC"
            className="inline-block hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
          >
            <Image
              src={MEC.src}
              alt={MEC.alt}
              width={MEC.width}
              height={MEC.height}
              className={`h-20 w-auto object-contain ${invertColors ? 'logo-branco' : 'logo-sem-fundo-branco'}`}
            />
          </a>
        </div>
      </div>

      <div className={`border-t ${dividerCls}`} />

      {/* Seção 2 — Parceiros institucionais */}
      <div className="text-center">
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${labelCls}`}>
          Parceiros institucionais
        </p>
        <p className={`text-[11px] mb-6 ${subCls}`}>
          Organizações parceiras na implementação do PECS junto às redes de ensino
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
          role="list"
          aria-label="Parceiros institucionais do Programa"
        >
          {PARCEIROS.map((p) => (
            <div key={p.nome} role="listitem">
              <LogoImg p={p} invertColors={invertColors} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
