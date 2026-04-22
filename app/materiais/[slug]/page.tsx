import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import materialsData from '@/config/materials.json'
import { TIPOS_RECURSO, ETAPAS_ENSINO, TEMAS_BNCC } from '@/config/taxonomia'
import { MaterialThumbnail } from '@/components/ui/MaterialThumbnail'
import type { Material } from '@/types/material'

const materials = materialsData as Material[]

function getMaterial(slug: string): Material | undefined {
  return materials.find((m) => m.id === slug)
}

export async function generateStaticParams() {
  return materials.map((m) => ({ slug: m.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}): Promise<Metadata> {
  const { slug } = 'then' in params ? await params : params
  const material = getMaterial(slug)
  if (!material) return {}
  return {
    title: `${material.tituloEditorial} — Biblioteca Redenec`,
    description: material.descricaoCard,
    robots: { index: false, follow: false },
  }
}

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const { slug } = 'then' in params ? await params : params
  const material = getMaterial(slug)

  if (!material) notFound()

  const tipoLabel = TIPOS_RECURSO[material.tipo]?.label

  return (
    <div className="min-h-screen bg-redenec-cinza">
      <div className="container-site section-spacing">

        {/* Breadcrumb */}
        <nav aria-label="Navegação estrutural" className="mb-8">
          <ol className="flex items-center gap-1 text-[13px] text-gray-500 flex-wrap">
            <li>
              <Link href="/materiais" className="hover:text-redenec-petroleo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded">
                Biblioteca Nacional de Educação Cidadã
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300 select-none px-0.5">›</li>
            <li className="text-gray-500">{tipoLabel}</li>
            <li aria-hidden="true" className="text-gray-300 select-none px-0.5">›</li>
            <li aria-current="page" className="text-redenec-petroleo font-bold truncate max-w-[200px] sm:max-w-xs">
              {material.tituloEditorial}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">

          {/* Header card with thumbnail */}
          <div className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <MaterialThumbnail organizacao={material.organizacao} tipo={material.tipo} id={material.id} />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-micro font-bold text-redenec-petroleo bg-redenec-cinza rounded-pill px-3 py-1">
                  {tipoLabel}
                </span>
              </div>
              <h1 className="text-h2-mobile lg:text-[32px] font-bold text-black mb-1 leading-snug">
                {material.tituloEditorial}
              </h1>
              <p className="text-body text-gray-500">{material.organizacao}</p>
            </div>
          </div>

          {/* Tags de etapa e tema */}
          {(material.etapas.length > 0 || material.temas.length > 0) && (
            <div className="mb-8 flex flex-wrap gap-2">
              {material.etapas.map((etapa) => (
                <span
                  key={etapa}
                  className="text-micro font-bold text-redenec-petroleo bg-white border border-gray-200 rounded-pill px-3 py-1"
                >
                  {ETAPAS_ENSINO[etapa]?.label ?? etapa}
                </span>
              ))}
              {material.temas.map((tema) => (
                <span
                  key={tema}
                  className="text-micro font-bold text-redenec-petroleo bg-white border border-gray-200 rounded-pill px-3 py-1"
                >
                  {TEMAS_BNCC[tema]?.label ?? tema}
                </span>
              ))}
            </div>
          )}

          {/* Sinopse */}
          <div className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-h3 font-bold text-black mb-4">Sobre o material</h2>
            <div className="text-body text-gray-700 leading-relaxed space-y-3">
              {material.sinopse.split('\n\n').map((parag, i) => (
                <p key={i}>{parag}</p>
              ))}
            </div>
          </div>

          {/* Pontos-chave */}
          {material.pontosChave.length > 0 && (
            <div className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h2 className="text-h3 font-bold text-black mb-4">O que você vai encontrar</h2>
              <ul className="space-y-3">
                {material.pontosChave.map((ponto, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-redenec-petroleo shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-body text-gray-700">{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botões de acesso */}
          <div className="flex flex-wrap gap-3">
            {material.links.map((link, i) =>
              link.tipo === 'pendente' ? (
                <span
                  key={i}
                  className="inline-flex items-center rounded-pill bg-gray-100 px-5 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                  aria-disabled="true"
                >
                  Em breve
                </span>
              ) : (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill bg-redenec-petroleo px-5 py-3 text-sm font-bold text-white hover:bg-opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
                >
                  {link.rotulo}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )
            )}
          </div>

          {/* Licença */}
          {material.licenca && (
            <p className="mt-6 text-micro text-gray-400">
              Licença: {material.licenca}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
