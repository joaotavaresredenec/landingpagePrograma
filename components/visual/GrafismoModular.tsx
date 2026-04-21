import React from 'react'

export type GrafismoVariante = 'hero' | 'secao' | 'cta' | 'denso'
export type GrafismoCorCirculos = 'verde' | 'azul' | 'coral' | 'petroleo' | 'escuro' | 'misto'
export type GrafismoCorLinhas = 'preto' | 'branco'

export type GrafismoProps = {
  variante: GrafismoVariante
  corCirculos: GrafismoCorCirculos
  corLinhas: GrafismoCorLinhas
  className?: string
}

const CIRCLE_COLORS: Record<GrafismoCorCirculos, string[]> = {
  verde:   ['#1cff9e', '#1cff9e', '#1cff9e'],
  azul:    ['#0086ff', '#0086ff', '#0086ff'],
  coral:   ['#ff8b80', '#ff8b80', '#ff8b80'],
  petroleo:['#1b415e', '#1b415e', '#1b415e'],
  escuro:  ['#243837', '#243837', '#243837'],
  misto:   ['#1cff9e', '#0086ff', '#ff8b80'],
}

const LINE_COLORS: Record<GrafismoCorLinhas, string> = {
  preto:  '#000000',
  branco: '#ffffff',
}

/** Variante hero — grande, canto superior direito, denso em círculos */
function VarianteHero({
  circleFills,
  lineColor,
}: {
  circleFills: string[]
  lineColor: string
}) {
  const [c1, c2, c3] = circleFills
  return (
    <svg
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Background circles */}
      <circle cx="380" cy="60"  r="90"  fill={c1} opacity="0.18" />
      <circle cx="300" cy="180" r="60"  fill={c2} opacity="0.22" />
      <circle cx="420" cy="220" r="50"  fill={c3} opacity="0.16" />
      <circle cx="200" cy="100" r="40"  fill={c1} opacity="0.14" />
      <circle cx="450" cy="340" r="70"  fill={c2} opacity="0.12" />
      <circle cx="150" cy="280" r="30"  fill={c3} opacity="0.20" />

      {/* Solid circles */}
      <circle cx="380" cy="60"  r="28"  fill={c1} />
      <circle cx="300" cy="180" r="20"  fill={c2} />
      <circle cx="420" cy="220" r="16"  fill={c3} />
      <circle cx="200" cy="100" r="12"  fill={c1} opacity="0.7" />
      <circle cx="440" cy="130" r="10"  fill={c2} opacity="0.8" />
      <circle cx="150" cy="280" r="8"   fill={c3} />
      <circle cx="350" cy="300" r="14"  fill={c1} opacity="0.6" />
      <circle cx="260" cy="360" r="10"  fill={c2} opacity="0.7" />
      <circle cx="470" cy="390" r="20"  fill={c3} opacity="0.5" />
      <circle cx="90"  cy="160" r="6"   fill={c1} opacity="0.5" />

      {/* Connector lines */}
      <line x1="380" y1="60"  x2="300" y2="180" stroke={lineColor} strokeWidth="1.5" opacity="0.4" />
      <line x1="300" y1="180" x2="420" y2="220" stroke={lineColor} strokeWidth="1.5" opacity="0.4" />
      <line x1="420" y1="220" x2="350" y2="300" stroke={lineColor} strokeWidth="1"   opacity="0.3" />
      <line x1="350" y1="300" x2="260" y2="360" stroke={lineColor} strokeWidth="1"   opacity="0.3" />
      <line x1="200" y1="100" x2="300" y2="180" stroke={lineColor} strokeWidth="1"   opacity="0.3" />
      <line x1="440" y1="130" x2="380" y2="60"  stroke={lineColor} strokeWidth="1"   opacity="0.3" />
      <line x1="150" y1="280" x2="260" y2="360" stroke={lineColor} strokeWidth="1"   opacity="0.25" />
      <line x1="420" y1="220" x2="470" y2="390" stroke={lineColor} strokeWidth="1"   opacity="0.2" />
      <line x1="90"  y1="160" x2="200" y2="100" stroke={lineColor} strokeWidth="1"   opacity="0.25" />
    </svg>
  )
}

/** Variante secao — médio, uso em seções de conteúdo */
function VarianteSecao({
  circleFills,
  lineColor,
}: {
  circleFills: string[]
  lineColor: string
}) {
  const [c1, c2, c3] = circleFills
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60"  cy="60"  r="50" fill={c1} opacity="0.15" />
      <circle cx="200" cy="80"  r="40" fill={c2} opacity="0.18" />
      <circle cx="280" cy="200" r="55" fill={c3} opacity="0.12" />

      <circle cx="60"  cy="60"  r="16" fill={c1} />
      <circle cx="200" cy="80"  r="12" fill={c2} />
      <circle cx="280" cy="200" r="18" fill={c3} />
      <circle cx="150" cy="180" r="10" fill={c1} opacity="0.7" />
      <circle cx="80"  cy="220" r="8"  fill={c2} opacity="0.6" />
      <circle cx="240" cy="140" r="6"  fill={c3} opacity="0.8" />

      <line x1="60"  y1="60"  x2="200" y2="80"  stroke={lineColor} strokeWidth="1.5" opacity="0.35" />
      <line x1="200" y1="80"  x2="280" y2="200" stroke={lineColor} strokeWidth="1.5" opacity="0.35" />
      <line x1="280" y1="200" x2="150" y2="180" stroke={lineColor} strokeWidth="1"   opacity="0.25" />
      <line x1="150" y1="180" x2="80"  y2="220" stroke={lineColor} strokeWidth="1"   opacity="0.25" />
      <line x1="60"  y1="60"  x2="150" y2="180" stroke={lineColor} strokeWidth="1"   opacity="0.2"  />
    </svg>
  )
}

/** Variante cta — compacto, para banners e botões CTA */
function VarianteCta({
  circleFills,
  lineColor,
}: {
  circleFills: string[]
  lineColor: string
}) {
  const [c1, c2, c3] = circleFills
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="40"  cy="40"  r="35" fill={c1} opacity="0.16" />
      <circle cx="160" cy="140" r="45" fill={c2} opacity="0.14" />

      <circle cx="40"  cy="40"  r="12" fill={c1} />
      <circle cx="160" cy="140" r="14" fill={c2} />
      <circle cx="120" cy="60"  r="8"  fill={c3} />
      <circle cx="60"  cy="140" r="6"  fill={c1} opacity="0.7" />

      <line x1="40"  y1="40"  x2="120" y2="60"  stroke={lineColor} strokeWidth="1.5" opacity="0.35" />
      <line x1="120" y1="60"  x2="160" y2="140" stroke={lineColor} strokeWidth="1.5" opacity="0.35" />
      <line x1="60"  y1="140" x2="160" y2="140" stroke={lineColor} strokeWidth="1"   opacity="0.25" />
    </svg>
  )
}

/** Variante denso — muitos nós, máxima complexidade visual */
function VarianteDenso({
  circleFills,
  lineColor,
}: {
  circleFills: string[]
  lineColor: string
}) {
  const [c1, c2, c3] = circleFills
  const nodes = [
    { cx: 80,  cy: 60,  r: 18, fill: c1 },
    { cx: 200, cy: 40,  r: 12, fill: c2 },
    { cx: 320, cy: 80,  r: 22, fill: c3 },
    { cx: 140, cy: 160, r: 14, fill: c1 },
    { cx: 260, cy: 180, r: 16, fill: c2 },
    { cx: 60,  cy: 240, r: 10, fill: c3 },
    { cx: 360, cy: 240, r: 14, fill: c1 },
    { cx: 200, cy: 280, r: 18, fill: c2 },
    { cx: 100, cy: 340, r: 10, fill: c3 },
    { cx: 300, cy: 340, r: 12, fill: c1 },
  ]
  const edges = [
    [0,1],[1,2],[0,3],[1,3],[2,4],[3,4],[3,5],[4,6],[4,7],[5,7],[6,7],[7,8],[7,9],[8,9],
  ]
  return (
    <svg
      viewBox="0 0 420 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {nodes.map((n, i) => (
        <circle key={`bg-${i}`} cx={n.cx} cy={n.cy} r={n.r * 3} fill={n.fill} opacity="0.1" />
      ))}
      {edges.map(([a, b], i) => (
        <line
          key={`e-${i}`}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke={lineColor}
          strokeWidth="1.2"
          opacity="0.3"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n-${i}`} cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
      ))}
    </svg>
  )
}

export function GrafismoModular({
  variante,
  corCirculos,
  corLinhas,
  className = '',
}: GrafismoProps) {
  const circleFills = CIRCLE_COLORS[corCirculos]
  const lineColor   = LINE_COLORS[corLinhas]

  const props = { circleFills, lineColor }

  return (
    <div className={['select-none pointer-events-none', className].join(' ')}>
      {variante === 'hero'   && <VarianteHero  {...props} />}
      {variante === 'secao'  && <VarianteSecao {...props} />}
      {variante === 'cta'    && <VarianteCta   {...props} />}
      {variante === 'denso'  && <VarianteDenso {...props} />}
    </div>
  )
}
