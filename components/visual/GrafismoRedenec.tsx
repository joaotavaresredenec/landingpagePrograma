import Image from 'next/image'

type Props = {
  className?: string
  rotate?: number
  opacity?: number
  /** 'multiply' funciona em fundos claros; 'screen' em fundos escuros */
  blendMode?: 'multiply' | 'screen' | 'normal'
  size?: number
}

export function GrafismoRedenec({
  className = '',
  rotate = 0,
  opacity = 1,
  blendMode = 'multiply',
  size = 400,
}: Props) {
  return (
    <div
      className={['pointer-events-none select-none', className].join(' ')}
      style={{
        transform: `rotate(${rotate}deg)`,
        opacity,
        mixBlendMode: blendMode,
        width: size,
        height: size * 0.75,
      }}
      aria-hidden="true"
    >
      <Image
        src="/logos/grafismo-redenec.png"
        alt=""
        width={size}
        height={Math.round(size * 0.75)}
        className="w-full h-full object-contain"
      />
    </div>
  )
}
