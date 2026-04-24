import { MetadataRoute } from 'next'

const BASE = 'https://cidadaniaesustentabilidade.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  // Páginas de materiais individuais (/biblioteca/[slug]) exigem sessão e
  // não devem ser indexadas — ficam fora do sitemap.
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/biblioteca`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/mapa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/sobre-o-programa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/plano-de-acao`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/obrigado`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]
}
