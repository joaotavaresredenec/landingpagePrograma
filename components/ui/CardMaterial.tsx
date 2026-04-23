import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { MaterialThumbnail } from '@/components/ui/MaterialThumbnail'
import type { Material } from '@/types/material'
import { TIPOS_RECURSO } from '@/config/taxonomia'
import { ORG_LOGOS } from '@/config/orgLogos'

export function CardMaterial({ material }: { material: Material }) {
  const tipoLabel = TIPOS_RECURSO[material.tipo]?.label ?? material.tipo

  return (
    <article className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow">

      <MaterialThumbnail organizacao={material.organizacao} tipo={material.tipo} id={material.id} />

      <div className="flex flex-col gap-3 flex-1 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-micro font-bold text-redenec-petroleo bg-redenec-cinza rounded-pill px-3 py-1 whitespace-nowrap">
            {tipoLabel}
          </span>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-[15px] font-bold text-black leading-snug">
            <Link
              href={`/biblioteca/${material.id}`}
              className="hover:text-redenec-petroleo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde rounded"
            >
              {material.tituloEditorial}
            </Link>
          </h3>
          {ORG_LOGOS[material.organizacao] ? (
            <div className="flex items-center h-6">
              <Image
                src={ORG_LOGOS[material.organizacao].src}
                alt={material.organizacao}
                width={ORG_LOGOS[material.organizacao].width}
                height={ORG_LOGOS[material.organizacao].height}
                className="h-5 w-auto object-contain max-w-[120px]"
              />
            </div>
          ) : (
            <p className="text-[12px] text-gray-400 font-medium">{material.organizacao}</p>
          )}
          <p className="text-[13px] text-gray-600 leading-relaxed flex-1 mt-1">{material.descricaoCard}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {material.links.map((link, i) =>
            link.tipo === 'pendente' ? (
              <span
                key={i}
                className="inline-flex items-center rounded-pill bg-gray-100 px-4 py-2 text-[12px] font-bold text-gray-400 cursor-not-allowed"
                aria-disabled="true"
              >
                Em breve
              </span>
            ) : (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-pill bg-black px-4 py-2 text-[12px] font-bold text-white hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
              >
                {link.rotulo}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            )
          )}
        </div>
      </div>
    </article>
  )
}
