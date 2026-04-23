import Image from 'next/image'
import { Accordion } from '@/components/ui/Accordion'
import { copyOrientacoes } from '@/config/copy'
import { GrafismoRedenec } from '@/components/visual/GrafismoRedenec'
import { GrafismoFundoSecao } from '@/components/visual/GrafismoFundoSecao'

const FAQ_ITENS = [
  {
    pergunta: 'O que é a Portaria MEC nº 642/2025?',
    resposta: `A Portaria nº 642, publicada pelo Ministério da Educação em 2025, institui e regulamenta o **Programa Educação para a Cidadania e Sustentabilidade (PECS)**. Ela define os objetivos do Programa, os eixos temáticos, os compromissos das redes de ensino que aderirem, as formas de monitoramento e o papel dos parceiros institucionais.

O Programa tem caráter nacional, abrange todas as etapas da Educação Básica e é de adesão voluntária por parte dos sistemas estaduais, distrital e municipais de ensino.`,
  },
  {
    pergunta: 'A adesão ao Programa é obrigatória?',
    resposta: `Não. A adesão ao Programa é **voluntária**. Nenhuma rede é obrigada a participar.

No entanto, uma vez que o secretário de educação assina o Termo de Adesão, a rede assume compromissos formais com o MEC:

1. Indicar um ponto focal responsável pela coordenação interna.
2. Elaborar e entregar um plano de ação.
3. Executar as atividades previstas no plano nas escolas da rede.

O não cumprimento desses compromissos pode implicar em consequências previstas no próprio instrumento de adesão.`,
  },
  {
    pergunta: 'Quais são os eixos temáticos do Programa?',
    resposta: `O Programa estrutura-se em torno de eixos que integram temas de cidadania, direitos humanos e sustentabilidade ao currículo escolar. Os principais eixos previstos no âmbito do PECS são:

- **Cidadania e democracia:** participação social, direitos e deveres, convivência democrática.
- **Direitos humanos e diversidade:** respeito às diferenças, combate a preconceitos, inclusão.
- **Sustentabilidade e meio ambiente:** consciência ambiental, consumo responsável, justiça climática.
- **Ciência, tecnologia e inovação:** pensamento crítico, letramento digital, uso ético da tecnologia.
- **Saúde integral:** saúde mental, educação sexual, bem-estar físico e emocional.

Esses eixos devem ser integrados ao currículo existente, e não tratados como componentes isolados.`,
  },
  {
    pergunta: 'O que é o plano de ação e qual é o prazo para entregá-lo?',
    resposta: `O plano de ação é o documento que formaliza como a rede vai implementar o Programa. Ele deve conter:

- **Objetivo geral** da rede para o período.
- **Metas** mensuráveis com indicadores claros.
- **Ações** detalhadas, com responsáveis e cronograma.
- **Estratégia de monitoramento** da execução nas escolas.

O prazo para entrega é comunicado pelo MEC após a adesão. Em caso de dúvida, o contato direto é **cogeb@mec.gov.br** ou **(61) 2022-7940**.

A Redenec disponibiliza um **Modelo de Plano de Ação** comentado neste portal, que pode ser usado como ponto de partida e adaptado ao contexto de cada rede.`,
  },
  {
    pergunta: 'Quem deve ser indicado como ponto focal?',
    resposta: `O ponto focal é o profissional da secretaria responsável por coordenar internamente a implementação do Programa. Não há exigência de cargo específico, mas o perfil recomendado inclui:

- Lotação na secretaria de educação (pode ser em coordenadoria pedagógica ou regional).
- Boa articulação com diretores e coordenadores das escolas.
- Familiaridade com a rotina de programas e projetos educacionais.
- Capacidade de manter registros e acompanhar cronogramas.

**O ponto focal não precisa** ter formação específica em cidadania ou sustentabilidade, nem trabalhar exclusivamente no Programa.`,
  },
  {
    pergunta: 'Os materiais desta biblioteca são oficiais do MEC?',
    resposta: `**Não.** Os materiais disponibilizados nesta biblioteca foram curados pela **Rede Nacional de Educação Cidadã (Redenec)**, uma organização da sociedade civil que atua como parceira institucional do MEC.

A seleção, análise e disponibilização dos recursos é de **responsabilidade exclusiva da Redenec**. Os materiais não representam posições oficiais do Ministério da Educação.

Para publicações e comunicados oficiais do Programa, consulte o site do MEC em **gov.br/mec**.`,
  },
  {
    pergunta: 'O Programa substitui componentes curriculares existentes?',
    resposta: `Não. O Programa **não é um componente curricular novo** e não substitui nenhuma disciplina existente.

Sua proposta é de **integração transversal**: os temas de cidadania, direitos humanos e sustentabilidade são trabalhados dentro dos componentes já existentes (História, Ciências, Língua Portuguesa, etc.) e por meio de projetos interdisciplinares, alinhados às competências e habilidades da BNCC.

Cada rede define, no seu plano de ação, como essa integração será feita de acordo com a sua realidade curricular.`,
  },
  {
    pergunta: 'Municípios pequenos conseguem implementar o Programa?',
    resposta: `Sim. O Programa foi desenhado para ser **adaptável ao porte e à capacidade de cada rede**.

Redes menores podem:

1. Começar com um piloto em poucas escolas e ampliar gradualmente.
2. Usar o Modelo de Plano de Ação simplificado disponível neste portal.
3. Consultar o Banco de Boas Práticas para ver experiências de municípios de diferentes tamanhos.

A Redenec também acompanha redes parceiras e pode indicar caminhos de implementação adaptados ao contexto local. Entre em contato pelo e-mail **contato@redenec.org**.`,
  },
  {
    pergunta: 'Como é feito o monitoramento pelo MEC?',
    resposta: `O MEC acompanha a execução por meio do plano de ação entregue pelas redes e de relatórios periódicos. O Programa prevê:

- **Entrega do plano de ação** no prazo definido após a adesão.
- **Relatórios de execução** ao longo do período, com registros das atividades realizadas.
- **Comunicação com o ponto focal** indicado pela rede.

Internamente, recomenda-se que a própria rede estabeleça instrumentos de monitoramento — formulários de acompanhamento, reuniões periódicas com as escolas e registro de evidências (fotos, atas, relatos de professores).`,
  },
  {
    pergunta: 'Posso compartilhar os materiais com professores e diretores?',
    resposta: `Sim. Os materiais disponibilizados neste portal foram organizados para **circular dentro da rede**.

Incentivamos o compartilhamento com equipes pedagógicas, gestores escolares e professores. Cada material indica suas condições de uso e licença, quando disponível.`,
  },
]

// Orientações práticas — todos os itens exceto o último ("Perguntas frequentes"),
// que é coberto pela seção de FAQ abaixo.
const ORIENTACOES_ITENS = copyOrientacoes.itens.slice(0, -1)

export function OrientacoesEFAQ() {
  return (
    <section className="relative overflow-hidden bg-redenec-cinza" aria-labelledby="orientacoes-faq-heading">
      <GrafismoFundoSecao variante="leve" />
      <div className="absolute -left-12 bottom-0 opacity-30 pointer-events-none">
        <GrafismoRedenec rotate={180} opacity={1} blendMode="multiply" size={260} />
      </div>
      <div className="container-site section-spacing relative z-10">

        <div className="max-w-2xl mb-10">
          <h2
            id="orientacoes-faq-heading"
            className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-4"
          >
            Orientações e perguntas frequentes
          </h2>
          <p className="text-body text-gray-600">
            Guia prático para implementar o Programa e respostas às principais dúvidas sobre o PECS e a adesão das redes.
          </p>
        </div>

        <div className="max-w-3xl flex flex-col gap-8">

          {/* Bloco 1 — Guia de implementação */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-redenec-petroleo bg-redenec-cinza px-3 py-1 rounded-pill mb-3">
                Guia de implementação
              </span>
              <h3 className="text-[18px] font-bold text-black leading-snug">
                O que fazer depois da adesão
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Passos práticos e orientações para secretarias que já aderiram ao Programa.
              </p>
            </div>
            <div className="px-8 py-6">
              <Accordion itens={ORIENTACOES_ITENS} allowMultiple={false} />
            </div>
          </div>

          {/* Bloco 2 — Perguntas frequentes */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-redenec-petroleo bg-redenec-cinza px-3 py-1 rounded-pill mb-3">
                Perguntas frequentes
              </span>
              <h3 className="text-[18px] font-bold text-black leading-snug">
                Dúvidas sobre o Programa PECS
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                O que é o Programa, como funciona a adesão e o que esperar do MEC.
              </p>
            </div>
            <div className="px-6 py-4">
              <Accordion itens={FAQ_ITENS} allowMultiple={false} />
            </div>
          </div>

          {/* Download da portaria */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-16 shrink-0 items-center justify-center">
              <Image
                src="/logos/diariooficialdauniao.png"
                alt="Diário Oficial da União"
                width={64}
                height={48}
                className="h-10 md:h-12 w-auto object-contain logo-sem-fundo-branco"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Portaria MEC nº 642/2025</p>
              <p className="text-sm text-gray-500">Documento oficial que institui o Programa Educação para a Cidadania e Sustentabilidade</p>
            </div>
            <a
              href="/portaria-642-2025-pecs.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="shrink-0 inline-flex items-center gap-2 rounded-pill bg-redenec-petroleo px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
            >
              Baixar PDF
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
