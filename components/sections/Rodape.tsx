import React from 'react'
import Link from 'next/link'
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react'
import { copyRodape } from '@/config/copy'
import { Logo } from '@/components/visual/Logo'

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
