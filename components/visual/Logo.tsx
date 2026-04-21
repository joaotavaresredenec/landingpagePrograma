import React from 'react'
import Image from 'next/image'

export type LogoVariant = 'principal' | 'mono-preto' | 'mono-branco'

export type LogoProps = {
  variant?: LogoVariant
  width?: number
  height?: number
  className?: string
}

/**
 * Logo Redenec.
 * - 'principal'   → logo colorida padrão (rede_nec_vetor-01.png)
 * - 'mono-preto'  → mesma imagem com filter para preto (CSS)
 * - 'mono-branco' → mesma imagem com filter para branco (CSS)
 */
export function Logo({
  variant = 'principal',
  width = 160,
  height = 52,
  className = '',
}: LogoProps) {
  const filterClass =
    variant === 'mono-branco'
      ? 'brightness-0 invert'
      : variant === 'mono-preto'
      ? 'brightness-0'
      : ''

  return (
    <Image
      src="/logos/rede_nec_vetor-01.png"
      alt="Logotipo da Rede Nacional de Educação Cidadã (Redenec)"
      width={width}
      height={height}
      className={[filterClass, className].join(' ')}
      priority
    />
  )
}
