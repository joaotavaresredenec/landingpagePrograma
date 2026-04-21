import React from 'react'

export type CardProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'section' | 'li'
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  padding = 'md',
}: CardProps) {
  return (
    <Tag
      className={[
        'rounded-2xl bg-white shadow-sm border border-gray-100',
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  )
}
