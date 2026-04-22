import { MetadataRoute } from 'next'
import materialsData from '@/config/materials.json'
import type { Material } from '@/types/material'

const materials = materialsData as Material[]
const BASE = 'https://cidadaniaesustentabilidade.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/biblioteca`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/sobre-o-programa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/plano-de-acao`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/obrigado`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const materialRoutes: MetadataRoute.Sitemap = materials.map((m) => ({
    url: `${BASE}/materiais/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...materialRoutes]
}
