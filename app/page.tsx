import { Hero } from '@/components/sections/Hero'
import { Desafios } from '@/components/sections/Desafios'
import { BibliotecaPreview } from '@/components/sections/BibliotecaPreview'
import { OrientacoesEFAQ } from '@/components/sections/OrientacoesEFAQ'
import { SobrePrograma } from '@/components/sections/SobrePrograma'
import { Formulario } from '@/components/sections/Formulario'
import { Rodape } from '@/components/sections/Rodape'

const BASE_URL = 'https://cidadaniaesustentabilidade.com.br'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Rede Nacional de Educação Cidadã (Redenec)',
    alternateName: 'Redenec',
    url: BASE_URL,
    logo: `${BASE_URL}/logos/rede_nec_vetor-01.png`,
    description: 'Organização da sociedade civil parceira institucional do MEC no âmbito do Programa Educação para a Cidadania e Sustentabilidade (PECS), instituído pela Portaria MEC nº 642/2025.',
    address: { '@type': 'PostalAddress', addressCountry: 'BR' },
    sameAs: ['https://www.gov.br/mec/pt-br/programa-educacao-cidadania-sustentabilidade'],
    subjectOf: {
      '@type': 'GovernmentService',
      name: 'Programa Educação para a Cidadania e Sustentabilidade (PECS)',
      description: 'Programa do Ministério da Educação para fortalecer a educação cidadã e a sustentabilidade nas redes públicas brasileiras.',
      serviceType: 'Programa Educacional',
      provider: {
        '@type': 'GovernmentOrganization',
        name: 'Ministério da Educação',
        url: 'https://www.gov.br/mec',
      },
      legislation: {
        '@type': 'Legislation',
        name: 'Portaria MEC nº 642 de 2025',
        datePublished: '2025',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Programa Educação para a Cidadania e Sustentabilidade | Redenec',
    url: BASE_URL,
    description: 'Materiais e orientações práticas para secretarias e escolas que aderiram ao PECS do MEC.',
    publisher: {
      '@type': 'Organization',
      name: 'Rede Nacional de Educação Cidadã (Redenec)',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/biblioteca` },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Programa Educação para a Cidadania e Sustentabilidade | Redenec',
    url: BASE_URL,
    description: 'Materiais pedagógicos curados pela Redenec para apoiar a implementação do PECS — Portaria MEC nº 642/2025.',
    about: {
      '@type': 'GovernmentService',
      name: 'Programa Educação para a Cidadania e Sustentabilidade (PECS)',
      provider: { '@type': 'GovernmentOrganization', name: 'Ministério da Educação (MEC)' },
    },
  },
]

export default function HomePage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main>
        <Hero />
        <Desafios />
        <BibliotecaPreview />
        <OrientacoesEFAQ />
        <SobrePrograma />
        <Formulario />
        <Rodape />
      </main>
    </>
  )
}
