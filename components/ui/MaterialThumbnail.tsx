import Image from 'next/image'
import { FileText, BookOpen, Play, Gamepad2, type LucideIcon } from 'lucide-react'
import type { TipoRecurso } from '@/types/material'
import { THUMBNAIL_PHOTOS } from '@/config/thumbnails'

type Palette = { bg: string; accent: string; mid: string }

const ORG_PALETTES: Record<string, Palette> = {
  'Fundação Fernando Henrique Cardoso': {
    bg: '#0d3350', accent: '#1cff9e', mid: '#1b7a5e',
  },
  'Fundação Fernando Henrique Cardoso e Porvir': {
    bg: '#0a2a4a', accent: '#38bdf8', mid: '#0369a1',
  },
  'Mobis': {
    bg: '#2d1b69', accent: '#fbbf24', mid: '#7c3aed',
  },
  'Instituto Gilberto Dimenstein': {
    bg: '#431407', accent: '#fb923c', mid: '#9a3412',
  },
  'Movimento Futuro': {
    bg: '#052e16', accent: '#4ade80', mid: '#166534',
  },
  'Educação para Gentileza e Generosidade/Umbigo do Mundo': {
    bg: '#78350f', accent: '#fde68a', mid: '#d97706',
  },
  'Viven': {
    bg: '#3b0764', accent: '#e879f9', mid: '#7e22ce',
  },
  'Instituto Palavra Aberta': {
    bg: '#0c4a6e', accent: '#7dd3fc', mid: '#0369a1',
  },
  'Instituto Auschwitz para a Prevenção do Genocídio e Atrocidades Massivas': {
    bg: '#3b0000', accent: '#fca5a5', mid: '#991b1b',
  },
  'Serenas': {
    bg: '#500724', accent: '#f9a8d4', mid: '#9d174d',
  },
  'Instituto Brasil Solidário': {
    bg: '#052e16', accent: '#86efac', mid: '#15803d',
  },
  'Porvir': {
    bg: '#431407', accent: '#fdba74', mid: '#c2410c',
  },
  'Escola Legislativa de Pouso Alegre': {
    bg: '#172554', accent: '#93c5fd', mid: '#1d4ed8',
  },
}

const DEFAULT_PALETTE: Palette = { bg: '#1b415e', accent: '#1cff9e', mid: '#1b7a5e' }

const TIPO_ICON: Record<string, LucideIcon> = {
  'planos-de-aula': FileText,
  'guias-e-cartilhas': BookOpen,
  'videos-e-recursos-digitais': Play,
  'jogos-e-atividades': Gamepad2,
}

export function MaterialThumbnail({
  organizacao,
  tipo,
  id,
}: {
  organizacao: string
  tipo: TipoRecurso
  id: string
}) {
  const p = ORG_PALETTES[organizacao] ?? DEFAULT_PALETTE
  const Icon = TIPO_ICON[tipo] ?? FileText
  const orgShort = organizacao.replace('Instituto ', 'Inst. ').replace(' para a Prevenção do Genocídio e Atrocidades Massivas', '')
  const photoId = THUMBNAIL_PHOTOS[id]

  return (
    <div
      className="relative w-full overflow-hidden rounded-t-2xl select-none"
      style={{ height: 156, background: p.bg }}
      aria-hidden="true"
    >
      {/* Background photo */}
      {photoId && (
        <Image
          src={`https://images.unsplash.com/photo-${photoId}?w=600&q=70&auto=format&fit=crop`}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}

      {/* Org color overlay — tints the photo with brand identity */}
      <div
        className="absolute inset-0"
        style={{ background: p.bg, opacity: photoId ? 0.72 : 1 }}
      />

      {/* Circle 1 — large, top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          right: -70,
          top: -80,
          background: p.accent,
          opacity: 0.10,
        }}
      />
      {/* Circle 2 — medium, bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 130,
          height: 130,
          left: -40,
          bottom: -50,
          background: p.mid,
          opacity: 0.25,
        }}
      />
      {/* Circle 3 — small accent dot, bottom-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 44,
          height: 44,
          right: 20,
          bottom: 36,
          background: p.accent,
          opacity: 0.35,
        }}
      />
      {/* Circle 4 — tiny, top-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 18,
          height: 18,
          left: 20,
          top: 18,
          background: p.accent,
          opacity: 0.45,
        }}
      />

      {/* Center icon container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: 68,
            height: 68,
            background: 'rgba(255,255,255,0.10)',
            border: `1.5px solid ${p.accent}40`,
          }}
        >
          <Icon size={32} color={p.accent} strokeWidth={1.5} />
        </div>
      </div>

      {/* Bottom strip — org name */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-2"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
      >
        <p
          className="text-[11px] font-bold tracking-wide truncate"
          style={{ color: `${p.accent}cc` }}
        >
          {orgShort}
        </p>
      </div>
    </div>
  )
}
