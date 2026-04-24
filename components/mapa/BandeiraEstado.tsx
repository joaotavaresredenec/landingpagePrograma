import { getBandeiraUrl } from '@/lib/mapa/bandeiras'

type Props = {
  uf: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  showFallback?: boolean
}

const TAMANHOS = {
  xs: { width: 16, height: 12 },
  sm: { width: 20, height: 14 },
  md: { width: 28, height: 20 },
  lg: { width: 40, height: 28 },
}

export function BandeiraEstado({
  uf,
  size = 'sm',
  className = '',
  showFallback = true,
}: Props) {
  const url = getBandeiraUrl(uf)
  const dims = TAMANHOS[size]

  if (!url) {
    if (!showFallback) return null
    return (
      <span
        aria-label={`Bandeira de ${uf} (indisponível)`}
        className={[
          'inline-flex items-center justify-center bg-gray-200 text-gray-500 font-bold rounded-sm shrink-0',
          className,
        ].join(' ')}
        style={{
          width: dims.width,
          height: dims.height,
          fontSize: Math.max(8, Math.round(dims.width * 0.5)),
        }}
      >
        {uf}
      </span>
    )
  }

  return (
    <span
      className={[
        'inline-flex items-center justify-center bg-white rounded-sm overflow-hidden shrink-0',
        className,
      ].join(' ')}
      style={{
        width: dims.width,
        height: dims.height,
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {/* Image standard pra evitar custos de revalidação Next/Image em assets pequenos repetidos */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Bandeira de ${uf}`}
        width={dims.width}
        height={dims.height}
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </span>
  )
}
