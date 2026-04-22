import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Programa Educação para a Cidadania e Sustentabilidade | Redenec'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1b415e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles — grafismo Redenec */}
        <div style={{ position: 'absolute', right: '80px', top: '60px', width: '220px', height: '220px', background: '#1cff9e', opacity: 0.18, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '200px', top: '240px', width: '130px', height: '130px', background: '#1cff9e', opacity: 0.25, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '60px', top: '380px', width: '90px', height: '90px', background: '#ff8b80', opacity: 0.3, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', left: '-40px', bottom: '-40px', width: '180px', height: '180px', background: '#0086ff', opacity: 0.12, borderRadius: '50%' }} />

        {/* Badge */}
        <div style={{ display: 'flex', marginBottom: '28px' }}>
          <div style={{ background: '#1cff9e', borderRadius: '24px', padding: '8px 20px', fontSize: '15px', fontWeight: 700, color: '#1b415e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Redenec × MEC · Portaria 642/2025
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: '54px', fontWeight: 700, color: '#ffffff', lineHeight: 1.1, maxWidth: '820px', marginBottom: '28px' }}>
          Programa Educação para a Cidadania e Sustentabilidade
        </div>

        {/* Description */}
        <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.72)', maxWidth: '720px', lineHeight: 1.5, marginBottom: '48px' }}>
          Materiais e orientações práticas para secretarias e escolas que aderiram ao PECS
        </div>

        {/* URL */}
        <div style={{ fontSize: '17px', color: '#1cff9e', fontWeight: 600, letterSpacing: '0.02em' }}>
          cidadaniaesustentabilidade.com.br
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
