import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Mail } from 'lucide-react'
import { copyObrigado } from '@/config/copy'
import { Logo } from '@/components/visual/Logo'
import { Button } from '@/components/primitives/Button'
import { GrafismoModular } from '@/components/visual/GrafismoModular'

export const metadata: Metadata = {
  title: 'Cadastro recebido — Programa Educação para a Cidadania e Sustentabilidade',
  description:
    'Seu cadastro foi recebido. Em instantes você receberá um e-mail com o link de acesso aos materiais.',
  robots: { index: false, follow: false },
}

export default function ObrigadoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-redenec-cinza flex flex-col">
      {/* Grafismo decorativo */}
      <div
        className="absolute right-0 top-0 w-[280px] md:w-[380px] opacity-60 pointer-events-none"
        aria-hidden="true"
      >
        <GrafismoModular variante="hero" corCirculos="misto" corLinhas="preto" />
      </div>

      {/* Nav mínima */}
      <header className="container-site py-6">
        <Link href="/" aria-label="Voltar para a página inicial">
          <Logo variant="principal" width={140} height={46} />
        </Link>
      </header>

      {/* Conteúdo central */}
      <div className="container-site flex flex-1 items-center justify-center py-16">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-redenec-verde mx-auto mb-6"
            aria-hidden="true"
          >
            <CheckCircle size={32} className="text-black" />
          </div>

          <h1 className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-4">
            {copyObrigado.headline}
          </h1>

          <p className="text-body text-gray-600 mb-4 leading-relaxed">
            {copyObrigado.subheadline}
          </p>

          <div className="flex items-start gap-3 bg-redenec-cinza rounded-xl p-4 text-left mb-8">
            <Mail size={18} className="text-redenec-petroleo mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {copyObrigado.instrucaoEmail}
            </p>
          </div>

          <Button variant="secondary" size="md" asLink="/" className="w-full">
            Voltar para o início
          </Button>
        </div>
      </div>
    </main>
  )
}
