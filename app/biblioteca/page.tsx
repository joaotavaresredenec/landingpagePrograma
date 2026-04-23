import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import materialsData from '@/config/materials.json'
import type { Material } from '@/types/material'
import { TIPOS_RECURSO, ETAPAS_ENSINO, TEMAS_BNCC } from '@/config/taxonomia'
import { MaterialThumbnail } from '@/components/ui/MaterialThumbnail'
import { GrafismoRedenec } from '@/components/visual/GrafismoRedenec'

export const metadata: Metadata = {
  title: 'Biblioteca de Materiais — PECS | Redenec',
  description:
    'Explore os 36 materiais pedagógicos curados pela Redenec para apoiar a implementação do Programa Educação para a Cidadania e Sustentabilidade (PECS). Planos de aula, guias, vídeos e jogos alinhados à BNCC para todas as etapas da Educação Básica.',
  alternates: { canonical: 'https://cidadaniaesustentabilidade.com.br/biblioteca' },
  openGraph: {
    title: 'Biblioteca de Materiais PECS | Redenec',
    description: '36 materiais pedagógicos para implementação do PECS — curadoria Redenec.',
    url: 'https://cidadaniaesustentabilidade.com.br/biblioteca',
  },
}

const materials = materialsData as Material[]

const TIPO_LABEL_SHORT: Record<string, string> = {
  'planos-de-aula': 'Plano de aula',
  'guias-e-cartilhas': 'Guia',
  'videos-e-recursos-digitais': 'Vídeo/Digital',
  'jogos-e-atividades': 'Jogo/Atividade',
}

export default function BibliotecaPublicaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Biblioteca de Materiais — Programa Educação para a Cidadania e Sustentabilidade',
    description: 'Coleção de 36 recursos pedagógicos curados pela Redenec para implementação do PECS.',
    url: 'https://cidadaniaesustentabilidade.com.br/biblioteca',
    numberOfItems: materials.length,
    publisher: {
      '@type': 'Organization',
      name: 'Rede Nacional de Educação Cidadã (Redenec)',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-redenec-cinza">

        {/* Header */}
        <div className="relative overflow-hidden bg-redenec-petroleo">
          <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
            <GrafismoRedenec rotate={45} opacity={1} blendMode="screen" size={360} />
          </div>
          <div className="container-site py-16 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors"
            >
              ← Início
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-redenec-verde mb-3">
              Curadoria Redenec × MEC — PECS · Portaria 642/2025
            </p>
            <h1 className="text-h2-mobile lg:text-h2-desktop font-bold text-white mb-4 max-w-2xl">
              Biblioteca de Materiais Pedagógicos
            </h1>
            <p className="text-body text-white/75 max-w-2xl mb-8">
              {materials.length} recursos pedagógicos selecionados e avaliados pela Redenec para apoiar secretarias e escolas na implementação do Programa Educação para a Cidadania e Sustentabilidade. Todos alinhados à BNCC, testados por professores em todo o Brasil.
            </p>
            <Link
              href="/#formulario"
              className="inline-flex items-center gap-2 rounded-pill bg-redenec-verde px-6 py-3 text-sm font-bold text-black hover:bg-opacity-90 transition-colors"
            >
              Acesse gratuitamente
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Nota — Acordo de Cooperação */}
        <div className="container-site pt-8">
          <p className="max-w-3xl text-sm text-gray-600 leading-relaxed italic">
            Em razão do Acordo de Cooperação nº 14/2025 celebrado entre a Redenec
            e o Ministério da Educação, os materiais aqui disponibilizados estarão
            em breve também acessíveis nas plataformas AVAMEC e MECRED do Ministério
            da Educação, após curadoria final.
          </p>
          {/* TODO: confirmar URLs oficiais do AVAMEC e MECRED e transformar em <a href> quando validado */}
        </div>

        {/* Grid de materiais */}
        <div className="container-site py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <article
                key={material.id}
                className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <MaterialThumbnail
                  organizacao={material.organizacao}
                  tipo={material.tipo}
                  id={material.id}
                />

                <div className="flex flex-col gap-3 flex-1 p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-redenec-petroleo bg-redenec-cinza rounded-pill px-3 py-1">
                      {TIPOS_RECURSO[material.tipo]?.label}
                    </span>
                    {material.etapas.slice(0, 2).map((e) => (
                      <span key={e} className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded-pill px-2 py-1">
                        {ETAPAS_ENSINO[e]?.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-[15px] font-bold text-black leading-snug mb-1">
                      <Link
                        href={`/materiais/${material.id}`}
                        className="hover:text-redenec-petroleo transition-colors"
                      >
                        {material.tituloEditorial}
                      </Link>
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium mb-2">{material.organizacao}</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3">{material.descricaoCard}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {material.temas.slice(0, 2).map((t) => (
                      <span key={t} className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-pill px-2 py-0.5">
                        {TEMAS_BNCC[t]?.label}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/#formulario"
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-pill bg-redenec-petroleo px-4 py-2 text-[12px] font-bold text-white hover:bg-opacity-90 transition-colors"
                  >
                    Acesse gratuitamente
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-white border-t border-gray-200">
          <div className="container-site py-12 text-center">
            <h2 className="text-h3 font-bold text-black mb-3">
              Acesso completo, gratuito e imediato
            </h2>
            <p className="text-body text-gray-600 mb-6 max-w-xl mx-auto">
              Cadastre-se e receba um link de acesso por e-mail. Você terá acesso às fichas completas de curadoria, análises e todos os recursos organizados por etapa, tema e tipo.
            </p>
            <Link
              href="/#formulario"
              className="inline-flex items-center gap-2 rounded-pill bg-redenec-verde px-6 py-3 text-sm font-bold text-black hover:bg-opacity-90 transition-colors"
            >
              Quero acesso aos materiais
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
