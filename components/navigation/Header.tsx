'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Mapa', href: '/mapa' },
  { label: 'Biblioteca', href: '/biblioteca' },
  { label: 'Sobre o Programa', href: '/sobre-o-programa' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-[#e5e4e9] print:hidden"
      aria-label="Navegação principal"
    >
      <div className="container-site flex items-center justify-between h-16">

        {/* Logo */}
        <Link
          href="/"
          aria-label="Início — Programa Educação para a Cidadania e Sustentabilidade"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logos/rede_nec_vetor-01.png"
            alt=""
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Nav links desktop */}
        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded',
                  active ? 'text-redenec-petroleo' : 'text-gray-600 hover:text-redenec-petroleo',
                ].join(' ')}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-4 right-4 -bottom-[17px] h-[2px] bg-redenec-verde"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Hamburger mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="md:hidden flex items-center justify-center w-10 h-10 text-redenec-petroleo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[#e5e4e9] bg-white"
        >
          <nav aria-label="Menu principal — versão mobile" className="container-site py-3 flex flex-col">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
                    active
                      ? 'text-redenec-petroleo bg-redenec-cinza border-l-2 border-redenec-verde'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-redenec-petroleo',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
