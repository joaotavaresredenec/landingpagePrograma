import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://cidadaniaesustentabilidade.com.br'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/biblioteca', '/sobre-o-programa', '/plano-de-acao', '/politica-de-privacidade'],
        // /biblioteca/[slug] exige sessão e não deve ser indexado
        // /materiais redireciona para /biblioteca — fora do índice
        disallow: ['/biblioteca/', '/materiais', '/materiais/', '/api/', '/obrigado'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
