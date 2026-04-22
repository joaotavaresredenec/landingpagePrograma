type Props = {
  size?: number
}

export function GrafismoHero({ size = 220 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="pointer-events-none select-none"
    >
      {/* Connecting lines */}
      <line x1="110" y1="110" x2="38" y2="38" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="110" y1="110" x2="182" y2="48" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="110" y1="110" x2="192" y2="152" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="110" y1="110" x2="58" y2="178" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="38" y1="38" x2="182" y2="48" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="182" y1="48" x2="192" y2="152" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="58" y1="178" x2="192" y2="152" stroke="white" strokeWidth="1" strokeOpacity="0.4" />

      {/* Circles */}
      <circle cx="110" cy="110" r="22" fill="#1cff9e" />
      <circle cx="38" cy="38" r="14" fill="#1cff9e" />
      <circle cx="182" cy="48" r="18" fill="#1cff9e" />
      <circle cx="192" cy="152" r="12" fill="#1cff9e" />
      <circle cx="58" cy="178" r="16" fill="#1cff9e" />
    </svg>
  )
}
