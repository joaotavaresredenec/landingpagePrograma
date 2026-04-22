import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react'
import { copyRodape } from '@/config/copy'
import { Logo } from '@/components/visual/Logo'

// TODO: Add ABEL logo when /public/logos/abel.png is available
const PARCEIROS_RODAPE = [
  { src: '/logos/rede_nec_vetor-01.png', alt: 'Redenec', width: 120, height: 40, cls: 'h-8 w-auto' },
  { src: '/logos/cnj-icone.jpg', alt: 'CNJ', width: 100, height: 100, cls: 'h-8 w-8 rounded' },
  { src: '/logos/cnmp.png', alt: 'CNMP', width: 140, height: 60, cls: 'h-8 w-auto' },
  { src: '/logos/UNESCO_logo.jpg', alt: 'UNESCO', width: 100, height: 40, cls: 'h-7 w-auto' },
  { src: '/logos/undime-colorido.png', alt: 'Undime', width: 110, height: 110, cls: 'h-8 w-8 rounded' },
  { src: '/logos/consed-horizontal.png', alt: 'Consed', width: 240, height: 50, cls: 'h-6 w-auto' },
]

export function Rodape() {
  return (
    <footer className="bg-redenec-escuro text-white" aria-label="Rodapé do site">
      <div className="container-site py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Logo variant="mono-branco" width={140} height={46} />
            <p className="text-micro text-white/70 leading-relaxed max-w-xs">
              {copyRodape.descricaoRedenec}
            </p>
            {/* OBC teaser */}
            <p className="text-micro font-bold text-redenec-verde mt-2">
              {copyRodape.textoObc}
            </p>
          </div>

          {/* Col 2 — Contato MEC */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              Contato MEC
            </h3>
            <a
              href={`mailto:${copyRodape.contatoMec.email}`}
              className="inline-flex items-center gap-2 text-micro text-white/80 hover:text-redenec-verde transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-sm"
            >
              <Mail size={14} aria-hidden="true" />
              {copyRodape.contatoMec.email}
            </a>
            <a
              href={`tel:${copyRodape.contatoMec.telefone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 text-micro text-white/80 hover:text-redenec-verde transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-sm"
            >
              <Phone size={14} aria-hidden="true" />
              {copyRodape.contatoMec.telefone}
            </a>
          </div>

          {/* Col 3 — Links e redes */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              Links
            </h3>
            <nav aria-label="Links institucionais">
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href={copyRodape.linkPolitica}
                    className="text-micro text-white/80 hover:text-redenec-verde transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-sm"
                  >
                    {copyRodape.linkPoliticaLabel}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://redenec.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-micro text-white/80 hover:text-redenec-verde transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded-sm"
                  >
                    Site Redenec
                  </a>
                </li>
              </ul>
            </nav>

            {/* Redes sociais */}
            <div className="flex gap-3 mt-2">
              <a
                href="https://instagram.com/redenec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Redenec (abre em nova aba)"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-redenec-verde hover:text-redenec-verde transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
              >
                <Instagram size={16} aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/company/redenec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Redenec (abre em nova aba)"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-redenec-verde hover:text-redenec-verde transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
              >
                <Linkedin size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Logos dos parceiros — versão branca */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 text-center mb-5">
            Parceiros institucionais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {PARCEIROS_RODAPE.map(({ src, alt, width, height, cls }) => (
              <Image
                key={alt}
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`${cls} object-contain logo-branco`}
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-micro text-white/50">
            {copyRodape.avisoLgpd}
          </p>
          <p className="text-micro text-white/40 shrink-0">
            © {new Date().getFullYear()} Redenec. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
