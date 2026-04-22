import { Hero } from '@/components/sections/Hero'
import { Desafios } from '@/components/sections/Desafios'
import { BibliotecaPreview } from '@/components/sections/BibliotecaPreview'
import { OrientacoesEFAQ } from '@/components/sections/OrientacoesEFAQ'
import { SobrePrograma } from '@/components/sections/SobrePrograma'
import { Formulario } from '@/components/sections/Formulario'
import { Rodape } from '@/components/sections/Rodape'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Desafios />
      <BibliotecaPreview />
      <OrientacoesEFAQ />
      <SobrePrograma />
      <Formulario />
      <Rodape />
    </main>
  )
}
