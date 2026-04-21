import type { Metadata } from 'next'
import Link from 'next/link'
import { copyPoliticaPrivacidade } from '@/config/copy'
import { Logo } from '@/components/visual/Logo'
import { Rodape } from '@/components/sections/Rodape'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Redenec',
  description:
    'Política de privacidade e tratamento de dados pessoais da Rede Nacional de Educação Cidadã (Redenec), em conformidade com a LGPD.',
  robots: { index: true, follow: true },
}

/**
 * Renderiza o conteúdo Markdown-like da política como HTML formatado.
 * Suporta: ## h2, **bold**, parágrafos separados por \n\n, listas com -
 */
function renderConteudo(raw: string) {
  const paragraphs = raw.split(/\n\n+/)
  return paragraphs.map((block, i) => {
    const trimmed = block.trim()

    // H2
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-xl font-bold text-black mt-8 mb-3">
          {trimmed.replace(/^## /, '')}
        </h2>
      )
    }

    // Lista com -
    if (trimmed.split('\n').every((l) => l.trim().startsWith('- '))) {
      const items = trimmed.split('\n').map((l) => l.trim().replace(/^- /, ''))
      return (
        <ul key={i} className="list-disc pl-6 space-y-1 mb-4 text-gray-700">
          {items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: formatInline(it) }} />
          ))}
        </ul>
      )
    }

    // Parágrafo normal
    return (
      <p
        key={i}
        className="text-base text-gray-700 leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    )
  })
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-redenec-cinza">
      {/* Nav mínima */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-site py-4">
          <Link href="/" aria-label="Voltar para a página inicial">
            <Logo variant="principal" width={130} height={42} />
          </Link>
        </div>
      </header>

      <main>
        <div className="container-site section-spacing">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-12 md:px-12">
            <h1 className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-2">
              {copyPoliticaPrivacidade.titulo}
            </h1>

            <div className="mt-8 flex flex-col">
              {renderConteudo(copyPoliticaPrivacidade.conteudo)}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <Link
                href="/"
                className="text-sm font-bold text-redenec-petroleo hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-sm"
              >
                ← Voltar para o início
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Rodape />
    </div>
  )
}
