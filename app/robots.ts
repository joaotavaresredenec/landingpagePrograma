import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://cidadaniaesustentabilidade.com.br'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/biblioteca', '/sobre-o-programa', '/plano-de-acao', '/politica-de-privacidade', '/materiais/'],
        disallow: ['/materiais$', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
