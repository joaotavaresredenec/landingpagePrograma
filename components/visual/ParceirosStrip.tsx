import Image from 'next/image'

// TODO: Add /public/logos/abel.png — ABEL (Associação Brasileira das Escolas Legislativas)
// when the file is available, uncomment the ABEL section below and remove the placeholder

const MEC = {
  nome: 'MEC',
  src: '/logos/mec-gov.png',
  alt: 'Ministério da Educação — Governo Federal',
  width: 260,
  height: 60,
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
    src: '/logos/cnj-icone.jpg',
    alt: 'Conselho Nacional de Justiça (CNJ)',
    width: 100,
    height: 100,
    imageClass: 'h-10 w-10 object-contain rounded-lg',
  },
  {
    nome: 'CNMP',
    src: '/logos/cnmp.png',
    alt: 'Conselho Nacional do Ministério Público (CNMP)',
    width: 140,
    height: 60,
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
    src: '/logos/undime-colorido.png',
    alt: 'União Nacional dos Dirigentes Municipais de Educação (Undime)',
    width: 110,
    height: 110,
    imageClass: 'h-10 w-10 object-contain rounded-lg',
  },
  {
    nome: 'Consed',
    src: '/logos/consed-horizontal.png',
    alt: 'Conselho Nacional de Secretários de Educação (Consed)',
    width: 240,
    height: 50,
    imageClass: 'h-7 w-auto object-contain',
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
          <Image
            src={MEC.src}
            alt={MEC.alt}
            width={MEC.width}
            height={MEC.height}
            className={`h-16 w-auto object-contain ${invertColors ? 'logo-branco' : 'logo-sem-fundo-branco'}`}
          />
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

      <div className={`border-t ${dividerCls}`} />

      {/* Seção 3 — Apoio institucional */}
      <div className="text-center">
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${labelCls}`}>
          Apoio institucional
        </p>
        <p className={`text-[11px] mb-6 ${subCls}`}>
          Instituições que apoiam a implementação do Programa
        </p>
        {/* TODO: Replace placeholder when /public/logos/abel.png is available:
            <Image src="/logos/abel.png" alt="ABEL — Associação Brasileira das Escolas Legislativas"
              width={120} height={40} className={`h-10 w-auto object-contain ${invertColors ? 'logo-branco' : 'logo-sem-fundo-branco'}`} />
        */}
        <div className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-xs font-bold ${invertColors ? 'border-white/20 text-white/40' : 'border-gray-200 text-gray-400'}`}>
          ABEL — logo pendente
        </div>
      </div>

    </div>
  )
}
