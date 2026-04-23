import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { Header } from '@/components/navigation/Header'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-figtree',
  display: 'swap',
})

const BASE_URL = 'https://cidadaniaesustentabilidade.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Programa Educação para a Cidadania e Sustentabilidade | Redenec',
    template: '%s | Redenec · PECS',
  },
  description:
    'Materiais e orientações práticas para secretarias e escolas que aderiram ao Programa Educação para a Cidadania e Sustentabilidade (PECS) do MEC. Acesso gratuito a guias, planos de ação e trilhas pedagógicas curados pela Redenec, parceira institucional do MEC.',
  keywords: [
    'PECS',
    'Portaria 642/2025',
    'educação cidadã',
    'plano de ação MEC',
    'Redenec',
    'cidadania na escola',
    'BNCC cidadania',
    'Programa Educação para a Cidadania e Sustentabilidade',
    'ponto focal MEC',
    'adesão PECS',
    'materiais pedagógicos cidadania',
    'educação para a sustentabilidade',
  ],
  authors: [{ name: 'Rede Nacional de Educação Cidadã (Redenec)', url: BASE_URL }],
  creator: 'Redenec',
  publisher: 'Redenec',
  openGraph: {
    title: 'Programa Educação para a Cidadania e Sustentabilidade | Redenec',
    description:
      'Materiais e orientações práticas para secretarias e escolas que aderiram ao PECS do MEC. Guias, planos de ação e trilhas pedagógicas curados pela Redenec.',
    url: BASE_URL,
    siteName: 'Programa Educação para a Cidadania e Sustentabilidade',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Programa Educação para a Cidadania e Sustentabilidade | Redenec',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programa Educação para a Cidadania e Sustentabilidade | Redenec',
    description:
      'Materiais e orientações práticas para secretarias e escolas que aderiram ao PECS do MEC.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={figtree.variable}>
      <body className="font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}
