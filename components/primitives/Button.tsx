'use client'

import React from 'react'
import Link from 'next/link'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  variant: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  asLink?: string
  className?: string
  'aria-label'?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-black text-white hover:bg-redenec-petroleo focus-visible:ring-2 focus-visible:ring-redenec-verde disabled:bg-gray-400',
  secondary:
    'bg-redenec-verde text-black hover:brightness-90 focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50',
  ghost:
    'bg-transparent text-black border border-black hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base font-bold',
}

export function Button({
  variant,
  size = 'md',
  children,
  onClick,
  type = 'button',
  disabled = false,
  asLink,
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-pill font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 cursor-pointer select-none'

  const classes = [base, variantClasses[variant], sizeClasses[size], className].join(' ')

  if (asLink) {
    return (
      <Link href={asLink} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
