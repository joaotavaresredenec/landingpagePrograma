import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink, FileDown } from 'lucide-react'
import Image from 'next/image'
import { GrafismoRedenec } from '@/components/visual/GrafismoRedenec'

export const metadata: Metadata = {
  title: 'Sobre o Programa PECS — Portaria MEC 642/2025 | Redenec',
  description:
    'Conheça o Programa Educação para a Cidadania e Sustentabilidade (PECS), instituído pela Portaria MEC nº 642/2025. Saiba como aderir, quais são os compromissos das redes de ensino e como a Redenec apoia a implementação.',
  alternates: { canonical: 'https://cidadaniaesustentabilidade.com.br/sobre-o-programa' },
  openGraph: {
    title: 'Sobre o Programa PECS | Redenec',
    description: 'Portaria MEC nº 642/2025 — o que é o PECS, como aderir e como implementar.',
    url: 'https://cidadaniaesustentabilidade.com.br/sobre-o-programa',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sobre o Programa PECS — Portaria MEC 642/2025',
  url: 'https://cidadaniaesustentabilidade.com.br/sobre-o-programa',
  about: {
    '@type': 'GovernmentService',
    name: 'Programa Educação para a Cidadania e Sustentabilidade (PECS)',
    alternateName: 'PECS',
    description: 'Programa do Ministério da Educação instituído pela Portaria nº 642/2025 para integrar temas de cidadania, direitos humanos e sustentabilidade ao currículo escolar.',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Ministério da Educação (MEC)',
      url: 'https://www.gov.br/mec',
    },
    serviceType: 'Programa educacional nacional',
    areaServed: 'BR',
  },
}

const EIXOS = [
  { titulo: 'Cidadania e Democracia', desc: 'Participação social, direitos e deveres, convivência democrática e cultura da paz.' },
  { titulo: 'Direitos Humanos e Diversidade', desc: 'Respeito às diferenças, combate a preconceitos, inclusão e valorização da diversidade.' },
  { titulo: 'Sustentabilidade e Meio Ambiente', desc: 'Consciência ambiental, consumo responsável e justiça climática.' },
  { titulo: 'Ciência, Tecnologia e Inovação', desc: 'Pensamento crítico, letramento digital e uso ético da tecnologia.' },
  { titulo: 'Saúde Integral', desc: 'Saúde mental, bem-estar físico e emocional e prevenção de violências.' },
]

const COMPROMISSOS = [
  { n: '1', titulo: 'Indicar um ponto focal', desc: 'Profissional da secretaria responsável por coordenar a implementação internamente.' },
  { n: '2', titulo: 'Elaborar um plano de ação', desc: 'Documento com objetivos, metas, ações, cronograma e estratégia de monitoramento.' },
  { n: '3', titulo: 'Executar nas escolas', desc: 'Implementar as atividades previstas no plano dentro das escolas da rede.' },
]

export default function SobreProgramaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen">

        {/* Header */}
        <div className="relative overflow-hidden bg-redenec-petroleo">
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <GrafismoRedenec rotate={135} opacity={1} blendMode="screen" size={400} />
          </div>
          <div className="container-site py-16 relative z-10">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              ← Início
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-redenec-verde mb-3">
              Portaria MEC nº 642/2025
            </p>
            <h1 className="text-h2-mobile lg:text-h2-desktop font-bold text-white mb-4 max-w-3xl leading-tight">
              Programa Educação para a Cidadania e Sustentabilidade (PECS)
            </h1>
            <p className="text-body text-white/75 max-w-2xl">
              Uma iniciativa do Ministério da Educação para integrar, de forma sistemática, temas de cidadania, direitos humanos e sustentabilidade ao cotidiano escolar em todo o Brasil.
            </p>
          </div>
        </div>

        {/* O que é */}
        <section className="bg-white">
          <div className="container-site section-spacing max-w-3xl">
            <h2 className="text-h2-mobile lg:text-h3 font-bold text-black mb-4">O que é o PECS?</h2>
            <p className="text-body text-gray-700 mb-4 leading-relaxed">
              O <strong>Programa Educação para a Cidadania e Sustentabilidade (PECS)</strong> foi instituído pelo Ministério da Educação por meio da <strong>Portaria nº 642, de 2025</strong>. O Programa convida redes estaduais, distritais e municipais de ensino a integrar, de forma sistemática, temas de cidadania, direitos humanos e sustentabilidade ao currículo escolar existente — sem criar novos componentes curriculares.
            </p>
            <p className="text-body text-gray-700 mb-4 leading-relaxed">
              A adesão ao PECS é <strong>voluntária</strong>: o secretário de educação assina um Termo de Adesão e, a partir daí, a rede assume três compromissos formais com o MEC. Com mais de 2.500 municípios e 20 estados já aderidos, o Programa cresce a cada semestre e está presente em todas as regiões do Brasil.
            </p>
            <p className="text-body text-gray-700 leading-relaxed">
              Os temas são trabalhados de forma <strong>transversal e interdisciplinar</strong>, integrando competências e habilidades já previstas na Base Nacional Comum Curricular (BNCC) — especialmente as Competências Gerais 9 (empatia e cooperação) e 10 (responsabilidade e cidadania).
            </p>
          </div>
        </section>

        {/* Eixos temáticos */}
        <section className="bg-redenec-cinza relative overflow-hidden">
          <div className="absolute left-0 top-0 opacity-40 pointer-events-none">
            <GrafismoRedenec rotate={0} opacity={0.5} blendMode="multiply" size={300} />
          </div>
          <div className="container-site section-spacing relative z-10">
            <h2 className="text-h2-mobile lg:text-h3 font-bold text-black mb-2 max-w-2xl">Eixos temáticos do Programa</h2>
            <p className="text-body text-gray-600 mb-8 max-w-2xl">Cinco grandes eixos que devem ser integrados ao currículo já existente em cada rede.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {EIXOS.map((e) => (
                <div key={e.titulo} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <div className="w-8 h-1 bg-redenec-verde rounded-full mb-3" />
                  <h3 className="text-[15px] font-bold text-redenec-petroleo mb-2">{e.titulo}</h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compromissos pós-adesão */}
        <section className="bg-white">
          <div className="container-site section-spacing max-w-3xl">
            <h2 className="text-h2-mobile lg:text-h3 font-bold text-black mb-2">Compromissos da rede após a adesão</h2>
            <p className="text-body text-gray-600 mb-8">Ao assinar o Termo de Adesão, o secretário de educação assume formalmente com o MEC:</p>
            <div className="flex flex-col gap-4">
              {COMPROMISSOS.map((c) => (
                <div key={c.n} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-redenec-petroleo">
                    <span className="text-sm font-bold text-white">{c.n}</span>
                  </div>
                  <div>
                    <p className="font-bold text-black mb-1">{c.titulo}</p>
                    <p className="text-sm text-gray-600">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Dúvidas sobre prazos ou entrega do plano de ação: <strong>cogeb@mec.gov.br</strong> · (61) 2022-7940
            </p>
          </div>
        </section>

        {/* Papel da Redenec */}
        <section className="bg-redenec-petroleo text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
            <GrafismoRedenec rotate={270} opacity={1} blendMode="screen" size={350} />
          </div>
          <div className="container-site section-spacing max-w-3xl relative z-10">
            <h2 className="text-h2-mobile lg:text-h3 font-bold text-white mb-4">O papel da Redenec</h2>
            <p className="text-body text-white/85 leading-relaxed mb-4">
              A <strong className="text-redenec-verde">Rede Nacional de Educação Cidadã (Redenec)</strong> é uma organização da sociedade civil que atua como parceira institucional do MEC no âmbito do PECS. Ao longo de quatro anos, a Redenec articulou um ecossistema de organizações, institutos e fundações comprometidos com a educação cidadã para curar e organizar materiais pedagógicos alinhados aos eixos do Programa.
            </p>
            <p className="text-body text-white/85 leading-relaxed mb-6">
              Os materiais reunidos neste portal já foram testados por milhares de professores em todo o Brasil, prezam pelo <strong>suprapartidarismo</strong> e estão alinhados às competências da BNCC. O MEC avaliará a convergência pedagógica de cada um deles e os incluirá nas plataformas oficiais do Ministério em breve.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#formulario"
                className="inline-flex items-center gap-2 rounded-pill bg-redenec-verde px-5 py-2.5 text-sm font-bold text-black hover:bg-opacity-90 transition-colors"
              >
                Acesse os materiais gratuitamente
                <ArrowRight size={14} />
              </Link>
              <a
                href="https://www.gov.br/mec/pt-br/programa-educacao-cidadania-sustentabilidade"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:border-white/60 transition-colors"
              >
                Site oficial MEC
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* Download portaria */}
        <section className="bg-white border-t border-gray-200">
          <div className="container-site py-10 max-w-3xl">
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-redenec-petroleo/10">
                <FileDown size={22} className="text-redenec-petroleo" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Portaria MEC nº 642/2025</p>
                <p className="text-sm text-gray-500">Documento oficial que institui o Programa PECS</p>
              </div>
              <a
                href="/portaria-642-2025-pecs.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="shrink-0 inline-flex items-center gap-2 rounded-pill bg-redenec-petroleo px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-colors"
              >
                Baixar PDF
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
