import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/primitives/Button'
import type { TipoMaterial } from '@/config/materials'
import { TIPO_LABELS } from '@/config/materials'

export type CardMaterialProps = {
  titulo: string
  descricao: string
  icone: LucideIcon
  tipo?: TipoMaterial
  driveUrl?: string
  onAcessar?: () => void
}

export function CardMaterial({
  titulo,
  descricao,
  icone: Icon,
  tipo,
  driveUrl,
  onAcessar,
}: CardMaterialProps) {
  const hasLink = driveUrl && driveUrl !== '#'

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 h-full">
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-redenec-cinza"
          aria-hidden="true"
        >
          <Icon size={24} className="text-redenec-petroleo" />
        </div>
        {tipo && (
          <span className="text-micro font-bold text-redenec-petroleo bg-redenec-cinza rounded-pill px-3 py-1 whitespace-nowrap">
            {TIPO_LABELS[tipo]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-h3 font-bold text-black leading-snug">{titulo}</h3>
        <p className="text-body text-gray-600 leading-relaxed flex-1">{descricao}</p>
      </div>

      {hasLink ? (
        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-pill bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
        >
          Acessar material
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={onAcessar}
          disabled={!onAcessar}
          className="self-start"
          aria-label={`Acessar material: ${titulo} (em breve)`}
        >
          Em breve
        </Button>
      )}
    </article>
  )
}
