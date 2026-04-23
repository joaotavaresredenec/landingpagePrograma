import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { temSessaoMapa } from '@/lib/sessao-mapa'
import { TelaSenhaMapa } from '@/components/mapa/TelaSenhaMapa'

export const metadata: Metadata = {
  title: 'Mapa de Adesão | Programa Educação para a Cidadania e Sustentabilidade',
  description: 'Visualize os estados e municípios que aderiram ao Programa PECS — Portaria MEC nº 642/2025.',
  robots: { index: false, follow: false },
}

export default async function MapaPage() {
  const autenticado = await temSessaoMapa()

  if (!autenticado) {
    return <TelaSenhaMapa />
  }

  return (
    <main className="min-h-screen bg-redenec-cinza">
      <div className="container-site section-spacing">

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-redenec-petroleo mb-8 transition-colors"
        >
          ← Início
        </Link>

        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-redenec-petroleo mb-3">
            Portaria MEC nº 642/2025
          </p>
          <h1 className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-4 leading-tight">
            Mapa de Adesão ao Programa
          </h1>
          <p className="text-body text-gray-600 mb-10 max-w-xl">
            Visualize os estados e municípios que aderiram ao Programa Educação
            para a Cidadania e Sustentabilidade.
          </p>
        </div>

        {/* Placeholder — mapa interativo virá aqui */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-12 md:p-16 text-center max-w-3xl">
          <MapPin
            size={48}
            strokeWidth={1.5}
            className="text-redenec-petroleo/30 mx-auto mb-6"
            aria-hidden="true"
          />
          <h2 className="text-xl font-bold text-black mb-3">Em breve</h2>
          <p className="text-body text-gray-600 max-w-md mx-auto mb-2">
            O mapa interativo com todos os estados e municípios aderidos ao Programa
            estará disponível em breve.
          </p>
          <p className="text-sm text-gray-400">
            Estamos finalizando a integração com os dados do Ministério da Educação.
          </p>
          {/* TODO: Implementar mapa interativo (Leaflet ou similar) quando a planilha do MEC estiver disponível */}
        </div>

      </div>
    </main>
  )
}
