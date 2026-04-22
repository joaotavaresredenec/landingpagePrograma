'use client'

import { Printer } from 'lucide-react'

export default function PlanoDeAcaoPage() {
  return (
    <>
      {/* Barra de ação — não aparece na impressão */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-3">
        <span className="text-sm font-semibold text-gray-700">
          Modelo de Plano de Ação — Programa PECS / Redenec
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-pill bg-redenec-petroleo px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-colors"
        >
          <Printer size={15} aria-hidden="true" />
          Imprimir / Salvar como PDF
        </button>
      </div>

      {/* Documento */}
      <main className="mx-auto max-w-[780px] px-8 py-10 print:px-0 print:py-0 font-sans text-gray-900">

        {/* Cabeçalho do documento */}
        <div className="mb-8 flex items-start justify-between gap-6 border-b-2 border-gray-900 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              Programa Educação para a Cidadania e Sustentabilidade
            </p>
            <h1 className="text-2xl font-bold leading-snug">
              Modelo de Plano de Ação
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Curadoria: Rede Nacional de Educação Cidadã (Redenec) · 2026
            </p>
          </div>
          <div className="text-right text-xs text-gray-400 shrink-0">
            <p>Portaria MEC nº 642/2025</p>
            <p className="mt-1">cidadaniaesustentabilidade.com.br</p>
          </div>
        </div>

        {/* Identificação */}
        <section className="mb-8">
          <h2 className="section-title">1. Identificação da rede</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Secretaria de Educação" />
            <Field label="Estado (UF)" />
            <Field label="Município" />
            <Field label="Nome do ponto focal" />
            <Field label="Cargo / função do ponto focal" />
            <Field label="E-mail do ponto focal" />
            <Field label="Telefone de contato" />
            <Field label="Data de elaboração do plano" />
          </div>
        </section>

        {/* Objetivo geral */}
        <section className="mb-8">
          <h2 className="section-title">2. Objetivo geral</h2>
          <p className="text-xs text-gray-500 mb-2">
            Descreva em uma frase o que a rede pretende alcançar com o Programa ao longo do período coberto pelo plano.
          </p>
          <div className="h-20 w-full rounded border border-gray-300 bg-gray-50" />
        </section>

        {/* Diagnóstico */}
        <section className="mb-8">
          <h2 className="section-title">3. Diagnóstico inicial</h2>
          <p className="text-xs text-gray-500 mb-3">
            Indique o estado atual da rede em relação aos temas do Programa. Quantas escolas? Quais etapas? Há experiências anteriores?
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Field label="Nº total de escolas na rede" />
            <Field label="Nº de escolas no escopo inicial" />
            <Field label="Etapas de ensino contempladas" />
          </div>
          <Field label="Experiências anteriores com temas de cidadania / sustentabilidade na rede" tall />
        </section>

        {/* Metas */}
        <section className="mb-8">
          <h2 className="section-title">4. Metas e indicadores</h2>
          <p className="text-xs text-gray-500 mb-3">
            Liste as metas do plano. Cada meta deve ser mensurável e ter um indicador claro. Acrescente linhas conforme necessário.
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <Th>Nº</Th>
                <Th wide>Descrição da meta</Th>
                <Th>Indicador</Th>
                <Th>Prazo</Th>
                <Th>Responsável</Th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((n) => (
                <tr key={n} className="border-b border-gray-200">
                  <Td center>{n}</Td>
                  <Td wide />
                  <Td />
                  <Td />
                  <Td />
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Plano de ações */}
        <section className="mb-8">
          <h2 className="section-title">5. Plano de ações</h2>
          <p className="text-xs text-gray-500 mb-3">
            Detalhe as ações que serão realizadas para atingir as metas. Inclua formação de professores, mobilização de escolas, seleção de materiais etc.
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <Th>Meta</Th>
                <Th wide>Ação</Th>
                <Th>Período</Th>
                <Th>Responsável</Th>
                <Th>Recursos necessários</Th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <tr key={n} className="border-b border-gray-200">
                  <Td center />
                  <Td wide />
                  <Td />
                  <Td />
                  <Td />
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Cronograma */}
        <section className="mb-8">
          <h2 className="section-title">6. Cronograma resumido</h2>
          <p className="text-xs text-gray-500 mb-3">
            Marque com ✓ os bimestres previstos para cada ação principal.
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <Th wide>Ação</Th>
                <Th>1º Bim</Th>
                <Th>2º Bim</Th>
                <Th>3º Bim</Th>
                <Th>4º Bim</Th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <tr key={n} className="border-b border-gray-200">
                  <Td wide />
                  <Td center />
                  <Td center />
                  <Td center />
                  <Td center />
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Monitoramento */}
        <section className="mb-8">
          <h2 className="section-title">7. Estratégia de monitoramento</h2>
          <p className="text-xs text-gray-500 mb-2">
            Como a rede vai acompanhar a execução? Com que frequência? Quem será responsável pelos registros?
          </p>
          <div className="h-24 w-full rounded border border-gray-300 bg-gray-50" />
        </section>

        {/* Assinaturas */}
        <section className="mb-2">
          <h2 className="section-title">8. Aprovação</h2>
          <div className="grid grid-cols-2 gap-10 mt-6">
            <AssinaturaBox label="Ponto focal do Programa" />
            <AssinaturaBox label="Secretário(a) de Educação" />
          </div>
        </section>

        {/* Rodapé */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-[10px] text-gray-400 flex justify-between">
          <span>Programa Educação para a Cidadania e Sustentabilidade · Portaria MEC nº 642/2025</span>
          <span>Redenec · cidadaniaesustentabilidade.com.br</span>
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 18mm 16mm; }
          body { font-size: 11px; }
        }
        .section-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1b415e;
          border-left: 3px solid #1cff9e;
          padding-left: 10px;
          margin-bottom: 12px;
        }
      `}</style>
    </>
  )
}

function Field({ label, tall }: { label: string; tall?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <div className={`w-full rounded border border-gray-300 bg-gray-50 ${tall ? 'h-16' : 'h-8'}`} />
    </div>
  )
}

function Th({ children, wide, center }: { children?: React.ReactNode; wide?: boolean; center?: boolean }) {
  return (
    <th className={`border border-gray-200 px-2 py-1.5 text-left text-xs font-semibold text-gray-600 ${wide ? 'w-1/3' : ''} ${center ? 'text-center' : ''}`}>
      {children}
    </th>
  )
}

function Td({ children, wide, center }: { children?: React.ReactNode; wide?: boolean; center?: boolean }) {
  return (
    <td className={`border border-gray-200 px-2 py-3 text-xs text-gray-400 ${wide ? 'w-1/3' : ''} ${center ? 'text-center' : ''}`}>
      {children}
    </td>
  )
}

function AssinaturaBox({ label }: { label: string }) {
  return (
    <div>
      <div className="h-12 border-b border-gray-400" />
      <p className="mt-2 text-xs text-gray-500">{label}</p>
      <div className="mt-3 h-6 border-b border-gray-300" />
      <p className="mt-1 text-xs text-gray-400">Data</p>
    </div>
  )
}
