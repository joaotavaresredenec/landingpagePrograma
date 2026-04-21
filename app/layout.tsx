import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-figtree',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Programa Educação para a Cidadania e Sustentabilidade',
  description:
    'A Redenec, parceira institucional do MEC, reúne materiais e orientações práticas para apoiar a implementação na sua rede.',
  metadataBase: new URL('https://cidadaniaesustentabilidade.com.br'),
  openGraph: {
    title: 'Programa Educação para a Cidadania e Sustentabilidade',
    description:
      'A Redenec, parceira institucional do MEC, reúne materiais e orientações práticas para apoiar a implementação na sua rede.',
    url: 'https://cidadaniaesustentabilidade.com.br',
    siteName: 'Educação para a Cidadania e Sustentabilidade',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programa Educação para a Cidadania e Sustentabilidade',
    description:
      'A Redenec, parceira institucional do MEC, reúne materiais e orientações práticas para apoiar a implementação na sua rede.',
  },
  robots: {
    index: true,
    follow: true,
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
        {children}
      </body>
    </html>
  )
}
