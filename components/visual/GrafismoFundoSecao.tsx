type Props = {
  variante?: 'leve' | 'medio' | 'denso'
  className?: string
}

export function GrafismoFundoSecao({ variante = 'leve', className = '' }: Props) {
  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none select-none absolute inset-0 overflow-hidden hidden md:block',
        className,
      ].join(' ')}
    >
      {variante === 'leve' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <line x1="120" y1="90" x2="680" y2="500" stroke="black" strokeWidth="0.5" opacity="0.08" />
          <circle cx="120" cy="90" r="38" fill="#1cff9e" opacity="0.09" />
          <circle cx="1340" cy="460" r="58" fill="#0086ff" opacity="0.07" />
          <circle cx="680" cy="500" r="26" fill="#ff8b80" opacity="0.10" />
        </svg>
      )}
      {variante === 'medio' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <line x1="90" y1="110" x2="1120" y2="540" stroke="black" strokeWidth="0.5" opacity="0.09" />
          <line x1="1360" y1="80" x2="700" y2="540" stroke="black" strokeWidth="0.5" opacity="0.07" />
          <circle cx="90" cy="110" r="44" fill="#1cff9e" opacity="0.10" />
          <circle cx="1360" cy="80" r="68" fill="#0086ff" opacity="0.08" />
          <circle cx="220" cy="490" r="32" fill="#ff8b80" opacity="0.10" />
          <circle cx="1120" cy="540" r="48" fill="#1cff9e" opacity="0.07" />
        </svg>
      )}
      {variante === 'denso' && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <line x1="80" y1="100" x2="720" y2="300" stroke="black" strokeWidth="0.5" opacity="0.10" />
          <line x1="720" y1="300" x2="1380" y2="90" stroke="black" strokeWidth="0.5" opacity="0.09" />
          <line x1="200" y1="500" x2="1150" y2="540" stroke="black" strokeWidth="0.5" opacity="0.08" />
          <circle cx="80" cy="100" r="50" fill="#1cff9e" opacity="0.11" />
          <circle cx="1380" cy="90" r="72" fill="#0086ff" opacity="0.09" />
          <circle cx="200" cy="500" r="36" fill="#ff8b80" opacity="0.11" />
          <circle cx="1150" cy="540" r="52" fill="#1cff9e" opacity="0.08" />
          <circle cx="720" cy="300" r="28" fill="#ff8b80" opacity="0.10" />
        </svg>
      )}
    </div>
  )
}
