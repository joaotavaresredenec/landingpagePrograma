import Image from 'next/image'

export function HeroMapa() {
  return (
    <div className="bg-redenec-petroleo text-white rounded-2xl p-6 md:p-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-redenec-verde mb-2">
            Acervo Redenec · Portaria MEC nº 642/2025
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            Mapa Nacional de Adesão ao PECS
          </h1>
          <p className="text-[15px] text-white/85 leading-relaxed max-w-2xl">
            Acompanhe o avanço do Programa Educação para a Cidadania e Sustentabilidade
            em todos os estados e municípios brasileiros.
          </p>
        </div>

        <div className="flex items-center gap-6 md:gap-8 justify-center md:justify-end flex-wrap">
          <Image
            src="/logos/logoMECMAPA.png"
            alt="Ministério da Educação"
            width={180}
            height={56}
            className="h-12 md:h-14 w-auto object-contain"
          />
          <Image
            src="/logos/programaeducacaoparaacidadanialogo.png"
            alt="Programa Educação para a Cidadania e Sustentabilidade"
            width={180}
            height={56}
            className="h-12 md:h-14 w-auto object-contain"
          />
          <Image
            src="/logos/redenecbranco.png"
            alt="Rede Nacional de Educação Cidadã"
            width={180}
            height={56}
            className="h-12 md:h-14 w-auto object-contain"
          />
        </div>

      </div>
    </div>
  )
}
