/**
 * Modelos de texto pré-formatados para incidência institucional
 * relacionada ao Programa Educação para a Cidadania e Sustentabilidade (PECS).
 *
 * Todos os modelos fazem menção ao art. 205 da Constituição Federal,
 * ao caráter suprapartidário do programa, e à complementaridade com
 * iniciativas já em andamento nas redes locais.
 */

export type TipoModelo =
  | 'oficio_publico'
  | 'oficio_privado'
  | 'email_publico'
  | 'email_privado'

export type TipoEnte = 'municipio' | 'estado'

export type DadosEnte = {
  nome: string
  uf: string
  tipo: TipoEnte
  rede: 'municipal' | 'estadual'
}

export const MODELOS_INFO: Record<
  TipoModelo,
  {
    titulo: string
    descricao: string
    icone: 'file-text' | 'mail'
    remetente: 'publico' | 'privado'
  }
> = {
  oficio_publico: {
    titulo: 'Ofício institucional',
    descricao: 'Para instituições públicas (secretarias, conselhos, órgãos)',
    icone: 'file-text',
    remetente: 'publico',
  },
  oficio_privado: {
    titulo: 'Ofício institucional',
    descricao: 'Para organizações privadas (ONGs, associações, empresas)',
    icone: 'file-text',
    remetente: 'privado',
  },
  email_publico: {
    titulo: 'Email de abertura',
    descricao: 'Versão enxuta por email — remetente público',
    icone: 'mail',
    remetente: 'publico',
  },
  email_privado: {
    titulo: 'Email de abertura',
    descricao: 'Versão enxuta por email — remetente privado',
    icone: 'mail',
    remetente: 'privado',
  },
}

function obterDestinatarioSugerido(ente: DadosEnte): {
  tratamento: string
  cargo: string
  orgao: string
} {
  if (ente.tipo === 'municipio') {
    return {
      tratamento: 'Exmo(a). Sr(a).',
      cargo: 'Secretário(a) Municipal de Educação',
      orgao: `Prefeitura Municipal de ${ente.nome}`,
    }
  }
  return {
    tratamento: 'Exmo(a). Sr(a).',
    cargo: 'Secretário(a) de Estado da Educação',
    orgao: `Governo do Estado de ${ente.nome}`,
  }
}

function obterDataAtual(): string {
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ]
  const hoje = new Date()
  return `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`
}

export function gerarTextoModelo(modelo: TipoModelo, ente: DadosEnte): string {
  const dest = obterDestinatarioSugerido(ente)
  const dataAtual = obterDataAtual()
  const entePor = ente.tipo === 'municipio' ? 'do Município de' : 'do Estado de'
  const redeTexto = ente.tipo === 'municipio' ? 'rede municipal' : 'rede estadual'

  switch (modelo) {
    case 'oficio_publico':
      return gerarOficioPublico(ente, dest, dataAtual, entePor, redeTexto)
    case 'oficio_privado':
      return gerarOficioPrivado(ente, dest, dataAtual, entePor, redeTexto)
    case 'email_publico':
      return gerarEmailPublico(ente, dest, redeTexto)
    case 'email_privado':
      return gerarEmailPrivado(ente, dest, redeTexto)
  }
}

function gerarOficioPublico(
  ente: DadosEnte,
  dest: ReturnType<typeof obterDestinatarioSugerido>,
  dataAtual: string,
  entePor: string,
  redeTexto: string,
): string {
  return `Ofício nº [NÚMERO]/[ANO]

[CIDADE], ${dataAtual}

${dest.tratamento}
[NOME DO DESTINATÁRIO]
${dest.cargo}
${dest.orgao}

Assunto: Interesse na adesão ao Programa Educação para a Cidadania e Sustentabilidade (PECS) — Portaria MEC nº 642/2025

Senhor(a) ${dest.cargo.toLowerCase()},

Cumprimentando-o(a) cordialmente, [NOME DA INSTITUIÇÃO REMETENTE] vem, por meio deste, manifestar interesse institucional em dialogar sobre a adesão ${entePor} ${ente.nome} ao Programa Educação para a Cidadania e Sustentabilidade (PECS), instituído pelo Ministério da Educação por meio da Portaria nº 642, de 2025.

O Programa alinha-se ao disposto no art. 205 da Constituição Federal, que reconhece a educação como direito de todos e dever do Estado e da família, a ser promovida e incentivada com a colaboração da sociedade, visando ao pleno desenvolvimento da pessoa, seu preparo para o exercício da cidadania e sua qualificação para o trabalho.

Cabe destacar o caráter suprapartidário desta iniciativa. O PECS tem o propósito de fortalecer — e não substituir — as iniciativas de educação cidadã já desenvolvidas pela ${redeTexto} de ${ente.nome}. A adesão reconhece e incrementa os esforços pedagógicos que as escolas da região já realizam em prol da formação integral de seus estudantes.

Entre os benefícios da adesão, destacam-se:

• Acesso a materiais didáticos e formativos produzidos em articulação com o MEC;
• Participação em rede nacional de apoio pedagógico e institucional;
• Reconhecimento federal das iniciativas locais em educação para a cidadania e sustentabilidade.

Nesse sentido, solicita-se a oportunidade de agendar uma reunião para apresentação detalhada do Programa e discussão dos próximos passos para a adesão formal via SIMEC.

Colocamo-nos à disposição para eventuais esclarecimentos pelos contatos ao final.

Respeitosamente,

[NOME DO SIGNATÁRIO]
[CARGO DO SIGNATÁRIO]
[NOME DA INSTITUIÇÃO REMETENTE]
[TELEFONE]
[EMAIL]`
}

function gerarOficioPrivado(
  ente: DadosEnte,
  dest: ReturnType<typeof obterDestinatarioSugerido>,
  dataAtual: string,
  entePor: string,
  redeTexto: string,
): string {
  return `[CIDADE], ${dataAtual}

${dest.tratamento}
[NOME DO DESTINATÁRIO]
${dest.cargo}
${dest.orgao}

Assunto: Apoio à adesão ao Programa Educação para a Cidadania e Sustentabilidade (PECS)

Prezado(a) ${dest.cargo.toLowerCase()},

A [NOME DA ORGANIZAÇÃO REMETENTE], [breve descrição da organização — ex: organização da sociedade civil dedicada a...], vem, respeitosamente, dirigir-se a Vossa Senhoria para apresentar o Programa Educação para a Cidadania e Sustentabilidade (PECS), instituído pelo Ministério da Educação por meio da Portaria nº 642, de 2025, e manifestar disposição em apoiar a eventual adesão ${entePor} ${ente.nome}.

O Programa ancora-se no art. 205 da Constituição Federal, que estabelece a educação como direito de todos e dever do Estado e da família, com a colaboração da sociedade, voltada ao pleno desenvolvimento da pessoa, seu preparo para o exercício da cidadania e sua qualificação para o trabalho.

Ressaltamos o caráter suprapartidário desta iniciativa. Ao aderir ao PECS, a ${redeTexto} de ${ente.nome} não substitui as ações pedagógicas hoje em curso, mas as fortalece e as insere em uma rede nacional de apoio, reconhecimento e articulação. Entendemos que as escolas locais já desenvolvem um trabalho significativo em temas de cidadania e sustentabilidade, e o Programa vem como instrumento de valorização e potencialização desse trabalho.

Entre os principais benefícios da adesão, destacam-se:

• Materiais didáticos e formativos produzidos em articulação com o MEC;
• Integração a rede nacional de educadores e gestores da educação cidadã;
• Reconhecimento institucional das práticas pedagógicas locais.

Colocamo-nos à disposição para apresentar o Programa em reunião a ser agendada conforme sua disponibilidade e, caso seja de interesse, apoiar o processo de adesão formal via SIMEC.

Agradecemos a atenção e reiteramos protestos de consideração e apreço.

Respeitosamente,

[NOME DO SIGNATÁRIO]
[CARGO NA ORGANIZAÇÃO]
[NOME DA ORGANIZAÇÃO REMETENTE]
[TELEFONE]
[EMAIL]
[SITE OU REDES SOCIAIS — OPCIONAL]`
}

function gerarEmailPublico(
  ente: DadosEnte,
  dest: ReturnType<typeof obterDestinatarioSugerido>,
  redeTexto: string,
): string {
  const entePor = ente.tipo === 'municipio' ? 'do município de' : 'do estado'

  return `Assunto: Adesão ao Programa Educação para a Cidadania e Sustentabilidade — ${ente.nome}

Prezado(a) ${dest.cargo},

Espero que esteja bem.

Entro em contato em nome de [NOME DA INSTITUIÇÃO REMETENTE] para apresentar a Vossa Senhoria o Programa Educação para a Cidadania e Sustentabilidade (PECS), instituído pelo Ministério da Educação por meio da Portaria nº 642/2025, e manifestar interesse em dialogar sobre a adesão ${entePor} ${ente.nome}.

O Programa tem caráter suprapartidário e alinha-se ao art. 205 da Constituição Federal, que reconhece a educação como direito de todos e dever do Estado e da família. A proposta do PECS é fortalecer as iniciativas de educação cidadã já desenvolvidas pela ${redeTexto} de ${ente.nome}, oferecendo materiais pedagógicos, articulação em rede nacional e reconhecimento federal às práticas locais.

Gostaríamos de poder apresentar o programa em reunião a ser agendada conforme sua disponibilidade, para compartilhar os benefícios e esclarecer dúvidas sobre o processo de adesão via SIMEC.

Fico à disposição para agendamento.

Atenciosamente,

[NOME DO SIGNATÁRIO]
[CARGO]
[NOME DA INSTITUIÇÃO REMETENTE]
[TELEFONE] | [EMAIL]`
}

function gerarEmailPrivado(
  ente: DadosEnte,
  dest: ReturnType<typeof obterDestinatarioSugerido>,
  redeTexto: string,
): string {
  const entePor = ente.tipo === 'municipio' ? 'do município de' : 'do estado'

  return `Assunto: Apoio à adesão de ${ente.nome} ao Programa Educação para a Cidadania e Sustentabilidade

Prezado(a) ${dest.cargo},

Espero que esteja bem.

Sou [NOME DO SIGNATÁRIO], da [NOME DA ORGANIZAÇÃO REMETENTE], [breve descrição — ex: uma organização da sociedade civil que atua com...]. Escrevo para apresentar a Vossa Senhoria o Programa Educação para a Cidadania e Sustentabilidade (PECS), criado pelo Ministério da Educação (Portaria nº 642/2025), e para colocar nossa organização à disposição para apoiar a adesão ${entePor} ${ente.nome}.

O programa tem caráter suprapartidário e se ampara no art. 205 da Constituição Federal. Seu propósito é fortalecer — e não substituir — as iniciativas de educação cidadã já em andamento nas escolas da ${redeTexto} de ${ente.nome}. A adesão oferece acesso a materiais pedagógicos, integração a rede nacional e reconhecimento institucional das práticas locais.

Gostaríamos muito de poder conversar sobre o programa em um momento conveniente para a equipe. Fico à disposição para agendar uma reunião.

Grato(a) pela atenção.

Atenciosamente,

[NOME DO SIGNATÁRIO]
[CARGO NA ORGANIZAÇÃO]
[NOME DA ORGANIZAÇÃO REMETENTE]
[TELEFONE] | [EMAIL]`
}
