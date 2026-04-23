import { Info } from 'lucide-react'

export function NotaAcordo() {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3 p-4 bg-gray-50 border-l-4 border-redenec-verde rounded-r-md">
        <Info size={18} className="text-redenec-azul shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-gray-700 leading-relaxed italic">
          Em razão do Acordo de Cooperação nº 14/2025 celebrado entre a Rede Nacional
          de Educação Cidadã e o Ministério da Educação, com objetivo de apoiar a
          implementação do Programa Educação para a Cidadania e Sustentabilidade, os
          dados de adesão apresentados neste mapa são compartilhados pelo MEC.
        </p>
      </div>
    </div>
  )
}
