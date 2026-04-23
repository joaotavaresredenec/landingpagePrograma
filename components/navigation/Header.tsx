'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Início' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/biblioteca', label: 'Biblioteca' },
  { href: '/sobre-o-programa', label: 'Sobre o Programa' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // Mobile open → sempre estado "sólido" para legibilidade
  const solid = scrolled || mobileOpen

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-all duration-300 print:hidden',
        solid
          ? 'bg-white border-b border-[#e5e4e9] shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
      aria-label="Navegação principal"
    >
      <div className="container-site flex items-center justify-between h-16">

        {/* Logo — visível apenas no estado sólido */}
        <Link
          href="/"
          aria-label="Início — Redenec"
          className={[
            'flex items-center gap-2 rounded transition-opacity duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
            solid ? 'opacity-100' : 'opacity-0 pointer-events-none',
          ].join(' ')}
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logos/rede_nec_vetor-01.png"
            alt="Rede Nacional de Educação Cidadã"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Nav links desktop */}
        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative text-sm font-bold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded',
                  solid ? 'text-black hover:text-redenec-petroleo' : 'text-black drop-shadow-sm hover:opacity-70',
                ].join(' ')}
                style={!solid ? { textShadow: '0 1px 2px rgba(255,255,255,0.6)' } : undefined}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[8px] h-[2px] bg-redenec-verde"
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
          className={[
            'md:hidden flex items-center justify-center w-10 h-10 rounded transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
            solid ? 'text-redenec-petroleo' : 'text-black',
          ].join(' ')}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[#e5e4e9] bg-white">
          <nav aria-label="Menu mobile" className="container-site py-3 flex flex-col">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'px-3 py-3 text-sm font-bold rounded-lg transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde',
                    active
                      ? 'text-redenec-petroleo bg-redenec-cinza border-l-2 border-redenec-verde'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-redenec-petroleo',
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
