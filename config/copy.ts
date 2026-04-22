// config/copy.ts
// Conteúdo textual — Programa Educação para a Cidadania e Sustentabilidade
// Redenec × MEC — Sprint 1 (SP1-01 a SP1-06)

// ─────────────────────────────────────────────
// SP1-01 — Hero e faixa de parceiros
// ─────────────────────────────────────────────

export const copyHero = {
  headline: 'Sua rede aderiu ao Programa. E agora?',
  subheadline:
    'A Redenec, parceira institucional do MEC, reúne materiais e orientações práticas para apoiar a implementação na sua rede.',
  ctaLabel: 'Quero acesso aos materiais',
  parceirosAltTexts: {
    mec: 'Logotipo do Ministério da Educação (MEC)',
    redenec: 'Logotipo da Rede Nacional de Educação Cidadã (Redenec)',
    cnj: 'Logotipo do Conselho Nacional de Justiça (CNJ)',
    cnmp: 'Logotipo do Conselho Nacional do Ministério Público (CNMP)',
    cgu: 'Logotipo da Controladoria-Geral da União (CGU)',
    unesco: 'Logotipo da Organização das Nações Unidas para a Educação, a Ciência e a Cultura (UNESCO)',
    undime: 'Logotipo da União Nacional dos Dirigentes Municipais de Educação (Undime)',
    consed: 'Logotipo do Conselho Nacional de Secretários de Educação (Consed)',
  },
}

// ─────────────────────────────────────────────
// SP1-02 — Seção de desafios (4 cards)
// ─────────────────────────────────────────────

export const copyDesafios = {
  titulo: 'Implementar um programa nacional é complexo. Você não precisa fazer isso sozinho.',
  subtitulo: 'Reunimos respostas práticas para os principais desafios que aparecem depois da adesão.',
  cards: [
    {
      titulo: 'Indicar e orientar o ponto focal',
      corpo:
        'Escolher a pessoa certa e prepará-la para conduzir o Programa dentro da rede exige critérios claros. Oferecemos um guia com o perfil recomendado, atribuições e orientações para o primeiro mês de atuação.',
    },
    {
      titulo: 'Elaborar um plano de ação eficaz',
      corpo:
        'O plano de ação é o principal instrumento de compromisso com o MEC, mas muitas redes chegam a esse momento sem um modelo de referência. Disponibilizamos um modelo comentado, com exemplos de metas e indicadores adequados à escala de cada rede.',
    },
    {
      titulo: 'Encontrar materiais prontos para sala de aula',
      corpo:
        'Professores precisam de recursos que cheguem prontos para uso, alinhados à BNCC e às etapas que a rede atende. Reunimos trilhas pedagógicas, recursos didáticos e dinâmicas organizados por etapa e por eixo temático do Programa.',
    },
    {
      titulo: 'Monitorar a execução na rede',
      corpo:
        'Acompanhar o que acontece nas escolas depois da adesão é o passo mais difícil de estruturar. Compartilhamos instrumentos de monitoramento e boas práticas de redes que já estão em fase de execução.',
    },
  ],
}

// ─────────────────────────────────────────────
// SP1-03 — Biblioteca de materiais (6 cards de prévia)
// ─────────────────────────────────────────────

export const copyBiblioteca = {
  titulo: 'O que você encontra aqui',
  subtitulo:
    'Materiais organizados pela Redenec para apoiar cada etapa da implementação — do planejamento à sala de aula.',
  cards: [
    {
      titulo: 'Guia do ponto focal',
      descricao:
        'Documento com atribuições, cronograma sugerido e orientações para quem vai coordenar o Programa dentro da secretaria ou da escola.',
    },
    {
      titulo: 'Modelo de plano de ação',
      descricao:
        'Template editável com estrutura aprovada, exemplos de metas, indicadores e campos alinhados ao que o MEC solicita na entrega.',
    },
    {
      titulo: 'Trilhas pedagógicas',
      descricao:
        'Sequências de atividades organizadas por eixo temático e etapa de ensino, com indicação de habilidades da BNCC correspondentes.',
    },
    {
      titulo: 'Recursos didáticos',
      descricao:
        'Textos, vídeos e fichas de apoio para professores, prontos para uso em sala ou para adaptação ao contexto local da rede.',
    },
    {
      titulo: 'Jogos e dinâmicas',
      descricao:
        'Atividades interativas para trabalhar cidadania e sustentabilidade de forma participativa com estudantes de diferentes etapas.',
    },
    {
      titulo: 'Banco de boas práticas',
      descricao:
        'Experiências documentadas de redes que já estão implementando o Programa, com descrição de contexto, estratégia e resultados observados.',
    },
  ],
}

// ─────────────────────────────────────────────
// SP1-04 — Orientações práticas (accordion, 6 itens)
// ─────────────────────────────────────────────

export const copyOrientacoes = {
  titulo: 'O que fazer depois da adesão',
  itens: [
    {
      pergunta: 'Passo a passo pós-adesão',
      resposta: `Depois que o secretário assina o termo de adesão, a rede assume três compromissos formais com o MEC: indicar um ponto focal, elaborar um plano de ação e executá-lo nas escolas. A sequência prática é a seguinte:

1. **Comunique internamente.** Informe as equipes pedagógica e administrativa sobre a adesão e o que ela implica. Quanto antes as lideranças intermediárias souberem, mais fácil é mobilizar apoio.

2. **Indique o ponto focal.** Escolha a pessoa que vai coordenar o Programa dentro da secretaria. Ela será o canal de comunicação com o MEC e com a Redenec. Consulte o Guia do Ponto Focal disponível neste portal para orientações sobre perfil e atribuições.

3. **Elabore o plano de ação.** Use o Modelo de Plano de Ação disponível aqui como ponto de partida. O plano deve conter objetivos, metas, cronograma e indicadores. Redes de menor porte podem começar com um plano mais simples e aprofundá-lo ao longo do ano.

4. **Entregue o plano ao MEC.** O prazo e o canal de entrega são indicados na comunicação oficial recebida pela secretaria após a adesão. Em caso de dúvida, o contato do MEC é cogeb@mec.gov.br ou (61) 2022-7940.

5. **Inicie a execução nas escolas.** Com o plano aprovado, articule com diretores e coordenadores pedagógicos a integração das atividades do Programa ao calendário escolar.

6. **Acesse os materiais de apoio.** Este portal reúne recursos para cada etapa — do planejamento à sala de aula. Faça o cadastro para acesso completo.`,
    },
    {
      pergunta: 'Como elaborar o plano de ação',
      resposta: `O plano de ação é o documento que formaliza como a rede vai implementar o Programa em suas escolas. Ele não precisa ser extenso — precisa ser claro, realista e consistente com a capacidade da rede.

**Estrutura recomendada:**

- **Objetivo geral:** o que a rede pretende alcançar com o Programa ao longo do período.
- **Metas:** resultados esperados, descritos de forma mensurável. Exemplo: "Implementar atividades do Programa em 30% das escolas de ensino fundamental até o segundo semestre."
- **Ações:** o que será feito, por quem e quando. Inclua formação de professores, produção ou seleção de materiais e articulação com as escolas.
- **Indicadores de acompanhamento:** como a secretaria vai saber que as ações estão sendo realizadas. Podem ser simples: número de escolas que participaram, número de professores formados, registros de atividades realizadas.
- **Cronograma:** distribuição das ações ao longo do ano letivo.
- **Responsáveis:** nome ou cargo de quem coordena cada ação.

O Modelo de Plano de Ação disponível neste portal já vem com esses campos estruturados e exemplos preenchidos. Ele pode ser adaptado livremente ao contexto de cada rede.

Se tiver dúvidas sobre o que o MEC espera receber, o contato direto é cogeb@mec.gov.br.`,
    },
    {
      pergunta: 'Como escolher o ponto focal',
      resposta: `O ponto focal é a pessoa responsável por coordenar internamente a implementação do Programa na rede. Essa função não exige dedicação exclusiva, mas requer disponibilidade, articulação com diferentes equipes e familiaridade com a rotina pedagógica da secretaria.

**Perfil recomendado:**

- Lotado na secretaria de educação (não necessariamente no nível central — pode ser em uma regional ou coordenadoria pedagógica).
- Com boa comunicação com diretores e coordenadores das escolas.
- Familiarizado com programas ou projetos educacionais em execução na rede.
- Organizado para manter registros e acompanhar cronogramas.

**O ponto focal não precisa:**

- Ter formação específica em cidadania ou sustentabilidade.
- Ser o técnico mais sênior da secretaria.
- Trabalhar exclusivamente no Programa.

**Primeiros passos depois da indicação:**

1. Apresente o Programa e os materiais disponíveis neste portal.
2. Defina canais de comunicação internos (reuniões, e-mail, grupos de trabalho).
3. Estabeleça um calendário mínimo de acompanhamento com a gestão da secretaria.

O Guia do Ponto Focal, disponível na biblioteca deste portal, traz orientações detalhadas para os primeiros 30, 60 e 90 dias de atuação.`,
    },
    {
      pergunta: 'Como monitorar a execução na rede',
      resposta: `Monitorar não significa controlar cada detalhe — significa saber se o Programa está acontecendo, identificar onde há dificuldades e agir antes que elas se tornem obstáculos maiores.

**Três perguntas simples para começar:**

1. Quais escolas já iniciaram atividades relacionadas ao Programa?
2. Quais professores participaram de alguma formação ou receberam os materiais?
3. Há registros (fotos, relatos, atas) dessas atividades?

**Instrumentos que ajudam:**

- **Formulário de acompanhamento mensal:** um formulário simples enviado às escolas, com campos para número de turmas ativas, atividades realizadas e dificuldades encontradas. O Banco de Boas Práticas deste portal traz modelos que outras redes usam.
- **Reunião de ponto focal:** encontros periódicos (mensais ou bimestrais) do ponto focal da secretaria com os referentes nas escolas, presencialmente ou por videoconferência.
- **Registro de evidências:** incentivar professores a registrar atividades com fotos ou relatos breves. Além de apoiar o monitoramento, esses registros compõem o relatório que pode ser enviado ao MEC.

O monitoramento não precisa ser sofisticado para ser eficaz. Redes com menos estrutura administrativa conseguem acompanhar a execução com instrumentos simples, desde que aplicados com regularidade.`,
    },
    {
      pergunta: 'Integração com a BNCC',
      resposta: `O Programa Educação para a Cidadania e Sustentabilidade não é um componente curricular à parte — ele se integra ao currículo existente, articulando competências e habilidades já previstas na Base Nacional Comum Curricular (BNCC).

**Competências gerais da BNCC diretamente relacionadas:**

- **Competência 1** (conhecimento): mobilizar saberes para compreender o mundo natural, social e tecnológico.
- **Competência 6** (trabalho e projeto de vida): valorizar a diversidade de saberes e vivências culturais.
- **Competência 9** (empatia e cooperação): exercitar a empatia, o diálogo, a resolução de conflitos e a cooperação.
- **Competência 10** (responsabilidade e cidadania): agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade, resiliência e determinação.

**Como articular na prática:**

- Identifique, no plano de ação da rede, as etapas e áreas de conhecimento em que as atividades do Programa serão desenvolvidas.
- Nas trilhas pedagógicas disponíveis neste portal, cada atividade já traz a indicação das habilidades da BNCC que contribui para desenvolver.
- Oriente os professores a registrar essa articulação no planejamento das aulas, facilitando a prestação de contas pedagógica.

A integração com a BNCC também fortalece a sustentabilidade do Programa dentro da rede: atividades ancoradas no currículo têm mais chance de continuidade independentemente de rotatividade de gestão.`,
    },
    {
      pergunta: 'Perguntas frequentes',
      resposta: `**O Programa é obrigatório para redes que aderiram?**
Sim, no sentido de que a adesão implica um compromisso formal. Ao assinar o termo, o secretário de educação assume os três compromissos: indicar o ponto focal, elaborar e entregar o plano de ação, e executar as atividades nas escolas. O Programa em si é voluntário — nenhuma rede é obrigada a aderir —, mas depois da adesão, há responsabilidades assumidas.

**Qual é o prazo para entregar o plano de ação ao MEC?**
O prazo é informado na comunicação oficial enviada pelo MEC após a adesão. Se sua rede não recebeu essa comunicação ou tem dúvidas sobre o prazo, entre em contato diretamente com o MEC: cogeb@mec.gov.br ou (61) 2022-7940.

**Os materiais disponíveis neste portal são materiais oficiais do MEC?**
Os materiais foram coletados pela Redenec junto ao ecossistema de educação cidadã e estão sendo disponibilizados aqui como complemento aos canais oficiais, no âmbito do Acordo de Cooperação celebrado com o MEC. Para acessar as publicações e comunicados oficiais do Ministério, consulte o site do Programa em gov.br/mec.

**Municípios pequenos conseguem implementar o Programa?**
Sim. O Programa é desenhado para ser adaptável ao porte e à capacidade de cada rede. Redes menores podem começar com atividades em poucas escolas e ampliar gradualmente. O Banco de Boas Práticas deste portal inclui experiências de municípios de diferentes tamanhos.

**Posso compartilhar os materiais com professores e diretores das escolas?**
Sim. Os materiais disponibilizados neste portal foram organizados para circular dentro da rede. Incentivamos o compartilhamento com equipes pedagógicas e gestores escolares.

**Há formação disponível para o ponto focal?**
A Redenec acompanha as redes parceiras e pode indicar caminhos de formação conforme a demanda. Caso tenha interesse, entre em contato pelo e-mail contato@redenec.org informando o nome da rede e o perfil do ponto focal.`,
    },
  ],
}

// ─────────────────────────────────────────────
// SP1-05a — Sobre o Programa
// ─────────────────────────────────────────────

export const copySobre = {
  titulo: 'Sobre o Programa',
  texto:
    'O Programa Educação para a Cidadania e Sustentabilidade é uma iniciativa do Ministério da Educação que convida redes estaduais, distritais e municipais a integrar, de forma sistemática, temas de cidadania, direitos humanos e sustentabilidade ao cotidiano escolar. A adesão é voluntária e se dá por meio de termo assinado pelo secretário de educação. Com mais de 2.500 municípios e 20 estados já aderidos, o Programa cresce a cada semestre. A Redenec atua como parceira institucional do MEC, apoiando a implementação com materiais, orientações e articulação junto às redes.',
  linkMec: 'https://www.gov.br/mec/pt-br/programa-educacao-cidadania-sustentabilidade',
  linkLabel: 'Saiba mais no site oficial do MEC',
}

// ─────────────────────────────────────────────
// SP1-05b — Formulário de captação
// ─────────────────────────────────────────────

export const copyFormulario = {
  titulo: 'Acesse os materiais gratuitamente',
  subtitulo:
    'Preencha o formulário abaixo. Você receberá um link de acesso no e-mail informado, válido por 30 dias.',
  campos: {
    nome: {
      label: 'Nome completo',
      placeholder: 'Seu nome completo',
      erro: 'Informe seu nome completo.',
    },
    email: {
      label: 'E-mail institucional',
      placeholder: 'seu@email.gov.br',
      erro: 'Informe um endereço de e-mail válido.',
    },
    perfil: {
      label: 'Qual é o seu perfil?',
      placeholder: 'Selecione uma opção',
      erro: 'Selecione o perfil que melhor descreve sua função.',
      opcoes: ['Técnico de secretaria', 'Gestor escolar', 'Professor', 'Estudante', 'Terceiro setor', 'Pesquisador', 'Outro servidor público', 'Outro'],
    },
    uf: {
      label: 'Estado (UF)',
      placeholder: 'Selecione o estado',
      erro: 'Selecione o estado onde você atua.',
    },
    municipio: {
      label: 'Município',
      placeholder: 'Nome do seu município',
      erro: 'Informe o município onde você atua.',
    },
    etapa: {
      label: 'Etapa de ensino (opcional)',
      placeholder: 'Selecione uma opção',
      erro: 'Selecione a etapa de ensino com a qual você trabalha.',
      opcoes: ['EF anos iniciais', 'EF anos finais', 'Ensino Médio', 'EJA', 'Todas', 'Não se aplica'],
    },
  },
  checkboxLgpd:
    'Concordo com a política de privacidade e autorizo o uso dos meus dados para recebimento de informações sobre o Programa e iniciativas relacionadas. Seus dados são tratados conforme a Lei nº 13.709/2018 (LGPD). Dúvidas ou solicitações: contato@redenec.org.',
  botaoSubmit: 'Quero acesso aos materiais e orientações',
}

// ─────────────────────────────────────────────
// SP1-05c — Rodapé
// ─────────────────────────────────────────────

export const copyRodape = {
  descricaoRedenec:
    'A Rede Nacional de Educação Cidadã (Redenec) é uma organização da sociedade civil que atua em parceria com o poder público para fortalecer a educação cidadã nas redes de ensino de todo o Brasil.',
  textoObc: 'Em breve: Olimpíada Brasileira de Cidadania (OBC)',
  avisoLgpd:
    'Este site coleta dados pessoais estritamente para as finalidades declaradas na política de privacidade, em conformidade com a Lei nº 13.709/2018 (LGPD).',
  linkPolitica: '/politica-de-privacidade',
  linkPoliticaLabel: 'Política de privacidade',
  contatoMec: {
    email: 'cogeb@mec.gov.br',
    telefone: '(61) 2022-7940',
  },
}

// ─────────────────────────────────────────────
// SP1-05d — Página /obrigado
// ─────────────────────────────────────────────

export const copyObrigado = {
  headline: 'Cadastro recebido!',
  subheadline:
    'Em instantes você receberá um e-mail com o link de acesso aos materiais. O link é válido por 30 dias e permite quantos acessos quiser durante esse período.',
  instrucaoEmail:
    'Verifique sua caixa de entrada — e, se não encontrar a mensagem em alguns minutos, confira também a pasta de spam ou lixo eletrônico. O e-mail é enviado por contato@redenec.org.',
}

// ─────────────────────────────────────────────
// SP1-05e — Página /politica-de-privacidade
// ─────────────────────────────────────────────

export const copyPoliticaPrivacidade = {
  titulo: 'Política de privacidade',
  conteudo: `**Última atualização:** 21 de abril de 2026

## 1. Quem somos

Este portal é mantido pela **Rede Nacional de Educação Cidadã (Redenec)**, pessoa jurídica de direito privado, com sede no Brasil, parceira institucional do Ministério da Educação (MEC) no âmbito do Programa Educação para a Cidadania e Sustentabilidade.

Contato do responsável pelo tratamento de dados:
- E-mail: contato@redenec.org
- Site: cidadaniaesustentabilidade.com.br

## 2. Quais dados coletamos

Ao preencher o formulário de cadastro, coletamos os seguintes dados pessoais:

- Nome completo
- Endereço de e-mail
- Perfil profissional (técnico de secretaria, gestor escolar, professor ou estudante)
- Estado (UF)
- Município
- Etapa de ensino com a qual o usuário trabalha

Não coletamos dados sensíveis, documentos de identificação, dados financeiros nem informações de menores de 18 anos sem autorização do responsável legal.

## 3. Para que usamos os dados

Os dados coletados são utilizados exclusivamente para:

a) Enviar o link de acesso aos materiais do Programa (magic link por e-mail);
b) Segmentar o envio de informações sobre o Programa Educação para a Cidadania e Sustentabilidade e iniciativas relacionadas da Redenec, conforme o perfil e a localização do usuário;
c) Comunicar sobre a Olimpíada Brasileira de Cidadania (OBC) e outras iniciativas educacionais da Redenec.

Os dados **não são compartilhados com terceiros para fins comerciais** nem vendidos a qualquer empresa ou organização.

## 4. Base legal para o tratamento

O tratamento dos dados pessoais coletados neste portal tem como base legal o **consentimento do titular** (art. 7º, inciso I, da Lei nº 13.709/2018 — LGPD), manifestado por meio do checkbox obrigatório no formulário de cadastro.

O usuário pode retirar o consentimento a qualquer momento, conforme descrito na seção 7 desta política.

## 5. Por quanto tempo armazenamos os dados

Os dados pessoais são armazenados enquanto o usuário mantiver o consentimento ativo ou enquanto for necessário para cumprir as finalidades declaradas nesta política.

O token de acesso (magic link) é armazenado por **30 dias** a partir do envio, sendo descartado automaticamente após esse prazo.

## 6. Segurança dos dados

Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acesso não autorizado, perda ou divulgação indevida, incluindo:

- Transmissão de dados por protocolo HTTPS (TLS);
- Armazenamento de tokens com prazo de expiração automática;
- Acesso restrito aos dados por parte da equipe da Redenec, com base na necessidade de conhecimento.

## 7. Direitos do titular

Nos termos da LGPD, o titular dos dados tem direito a:

- **Confirmar** a existência do tratamento de seus dados;
- **Acessar** os dados que possuímos sobre você;
- **Corrigir** dados incompletos, inexatos ou desatualizados;
- **Solicitar a eliminação** dos dados pessoais tratados com base no consentimento;
- **Revogar o consentimento** a qualquer momento, sem prejuízo da licitude do tratamento realizado até então;
- **Obter informações** sobre as entidades com as quais compartilhamos dados.

Para exercer qualquer desses direitos, entre em contato pelo e-mail **contato@redenec.org**, identificando-se e descrevendo sua solicitação. Responderemos em até 15 dias úteis.

## 8. Cookies e rastreamento

Este portal pode utilizar cookies técnicos estritamente necessários para o funcionamento das páginas. Não utilizamos cookies de rastreamento para fins publicitários.

## 9. Alterações nesta política

Esta política pode ser atualizada periodicamente. Em caso de alterações relevantes, comunicaremos os usuários cadastrados por e-mail. A data da última atualização está indicada no início do documento.

## 10. Contato e canal para exclusão de dados

Para dúvidas, solicitações de acesso, correção ou exclusão de dados, utilize o canal:

**E-mail:** contato@redenec.org
**Assunto sugerido:** Solicitação LGPD — [descreva sua solicitação]

Nos comprometemos a responder todas as solicitações em até 15 dias úteis.`,
}

// ─────────────────────────────────────────────
// SP2 — Página /materiais (biblioteca completa)
// ─────────────────────────────────────────────

export const copyPaginaBiblioteca = {
  titulo: 'Biblioteca de materiais',
  subtitulo: 'Recursos pedagógicos curados pela Redenec para apoiar a implementação do Programa nas redes de ensino.',
  intro: [
    'Esta biblioteca reúne 36 recursos pedagógicos avaliados e organizados pela Redenec em parceria com o Ministério da Educação. Cada material passou por curadoria especializada que considerou qualidade pedagógica, alinhamento à BNCC, potencial de aplicação em diferentes contextos escolares e adequação aos temas do Programa.',
    'Os recursos cobrem todas as etapas da Educação Básica — da Educação Infantil ao Ensino Médio — e estão organizados por tipo, etapa de ensino e tema, permitindo que professores, coordenadores e gestores encontrem rapidamente o que é mais adequado ao seu contexto. Todos os materiais são de acesso gratuito.',
    'Para cada material, o curador da Redenec elaborou uma análise que destaca os pontos fortes, as condições de uso recomendadas e eventuais limitações a considerar antes da adoção. Essas observações estão disponíveis na página de cada recurso.',
  ],
  buscaAriaLabel: 'Buscar materiais na biblioteca',
  buscaPlaceholder: 'Buscar por título ou organização...',
}

// ─────────────────────────────────────────────
// SP1-06 — E-mail transacional (magic link)
// ─────────────────────────────────────────────

export const copyEmailMagicLink = {
  assunto: 'Seu acesso aos materiais do Programa está pronto',
  preheader:
    'Clique no botão abaixo para acessar guias, modelos e recursos pedagógicos do Programa.',
  corpo: {
    saudacao: 'Olá, {NOME}!',
    instrucao:
      'Recebemos seu cadastro no portal do Programa Educação para a Cidadania e Sustentabilidade. Clique no botão abaixo para acessar os materiais organizados pela Redenec — guias, modelos de plano de ação, trilhas pedagógicas e muito mais.',
    ctaLabel: 'Acessar meus materiais',
    avisoExpiracao:
      'Este link é válido por 30 dias a partir do recebimento deste e-mail. Você pode acessá-lo quantas vezes quiser durante esse período, no mesmo dispositivo ou em outro.',
    assinatura: `Atenciosamente,

Equipe Redenec
Rede Nacional de Educação Cidadã
contato@redenec.org
cidadaniaesustentabilidade.com.br`,
    fallbackUrl:
      'Se o botão não funcionar, copie e cole o endereço abaixo diretamente no seu navegador:\n{MAGIC_LINK_URL}',
  },
}
