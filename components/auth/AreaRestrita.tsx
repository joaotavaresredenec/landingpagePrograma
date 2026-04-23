import type { LucideIcon } from 'lucide-react'
import { Formulario } from '@/components/sections/Formulario'

type AreaRestritaProps = {
  titulo: string
  descricao: string
  icone?: LucideIcon
  origem: 'biblioteca' | 'materiais'
}

export function AreaRestrita({ titulo, descricao, icone: Icone, origem }: AreaRestritaProps) {
  return (
    <main className="min-h-screen bg-redenec-cinza">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Hero contextual */}
        <div className="bg-redenec-petroleo text-white rounded-2xl p-8 md:p-12 mb-6 relative overflow-hidden">
          <div className="flex items-start gap-5">
            {Icone && (
              <div className="shrink-0 mt-1">
                <Icone size={44} strokeWidth={1.5} className="text-redenec-verde" aria-hidden="true" />
              </div>
            )}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-redenec-verde mb-2">
                Acesso exclusivo
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                {titulo}
              </h1>
              <p className="text-[15px] text-white/85 leading-relaxed">
                {descricao}
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">
            Cadastre-se para acessar todos os materiais
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Preencha o cadastro abaixo e acesse imediatamente a biblioteca completa.
            Válido por 30 dias sem precisar repetir. Você também recebe um link de acesso por e-mail como backup.
          </p>

          <Formulario variant="embed" origem={origem} redirectAposLogin />
        </div>

      </div>
    </main>
  )
}
