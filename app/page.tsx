import { Hero } from '@/components/sections/Hero'
import { Desafios } from '@/components/sections/Desafios'
import { BibliotecaPreview } from '@/components/sections/BibliotecaPreview'
import { Orientacoes } from '@/components/sections/Orientacoes'
import { SobrePrograma } from '@/components/sections/SobrePrograma'
import { Formulario } from '@/components/sections/Formulario'
import { Rodape } from '@/components/sections/Rodape'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Desafios />
      <BibliotecaPreview />
      <Orientacoes />
      <SobrePrograma />
      <Formulario />
      <Rodape />
    </main>
  )
}
