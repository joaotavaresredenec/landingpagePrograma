// 13 critérios de curadoria — 12 padrão (claude.md.md) + 1 fit_biblioteca.
// Os 3 críticos (neutralidade, cidadania, direitos autorais) determinam
// não-inclusão automática quando recebem "insuficiente".

export type ResultadoCriterio = 'completo' | 'satisfatorio' | 'insuficiente'

export type SlugCriterio =
  | 'neutralidade_pluralidade'
  | 'clareza_coerencia'
  | 'justificativa_pedagogica'
  | 'detalhamento_replicabilidade'
  | 'fontes_evidencias'
  | 'potencial_impacto'
  | 'contribuicao_cidadania'
  | 'originalidade'
  | 'adequacao_tecnica'
  | 'direitos_autorais'
  | 'completude_documental'
  | 'sustentabilidade'
  | 'fit_biblioteca'

export type Recomendacao = 'incluir' | 'incluir_ressalvas' | 'nao_incluir'

export type DefinicaoCriterio = {
  numero: number
  slug: SlugCriterio
  label: string
  critico: boolean
  descricoes: {
    completo: string
    satisfatorio: string
    insuficiente: string
  }
}

export const CRITERIOS: DefinicaoCriterio[] = [
  {
    numero: 1,
    slug: 'neutralidade_pluralidade',
    label: 'Neutralidade e pluralidade',
    critico: true,
    descricoes: {
      completo:
        'O material apresenta múltiplas perspectivas sobre temas controversos, sem favorecer posição política, religiosa ou ideológica. Linguagem equânime, fontes diversas.',
      satisfatorio:
        'Predominantemente neutro, mas com eventuais desequilíbrios de perspectiva que não chegam a comprometer o caráter educacional.',
      insuficiente:
        'Material claramente parcial, panfletário, com viés político-partidário, religioso ou ideológico explícito.',
    },
  },
  {
    numero: 2,
    slug: 'clareza_coerencia',
    label: 'Clareza e coerência da proposta',
    critico: false,
    descricoes: {
      completo:
        'Objetivos claros, linguagem adequada ao público-alvo, estrutura lógica e progressiva. Fácil entender o que o material propõe e como.',
      satisfatorio:
        'Proposta compreensível mas com trechos confusos ou estrutura irregular que exige esforço adicional do educador.',
      insuficiente:
        'Objetivos ausentes ou obscuros, linguagem inacessível ao público declarado, estrutura incoerente.',
    },
  },
  {
    numero: 3,
    slug: 'justificativa_pedagogica',
    label: 'Justificativa pedagógica e conceitual',
    critico: false,
    descricoes: {
      completo:
        'Fundamentação teórica explícita, alinhamento com abordagens pedagógicas reconhecidas (construtivismo, aprendizagem ativa etc.), conceitos-chave definidos com clareza.',
      satisfatorio:
        'Base pedagógica presente mas implícita ou parcialmente desenvolvida. Conceitos usados sem definição suficiente.',
      insuficiente:
        'Ausência de fundamentação pedagógica ou conceitual. Material aplicativo sem base teórica identificável.',
    },
  },
  {
    numero: 4,
    slug: 'detalhamento_replicabilidade',
    label: 'Detalhamento e replicabilidade',
    critico: false,
    descricoes: {
      completo:
        'Qualquer educador sem contato prévio com o material consegue aplicá-lo seguindo as instruções. Tempo, recursos, dinâmicas e adaptações detalhados.',
      satisfatorio:
        'Replicável com esforço adicional de interpretação. Faltam alguns detalhes operacionais mas a estrutura é clara.',
      insuficiente:
        'Instruções insuficientes para replicação independente. Dependência excessiva de formação específica não oferecida pelo material.',
    },
  },
  {
    numero: 5,
    slug: 'fontes_evidencias',
    label: 'Fontes e evidências',
    critico: false,
    descricoes: {
      completo:
        'Afirmações baseadas em fontes identificadas e confiáveis (pesquisas, dados públicos, legislação, autores referenciados). Referências acessíveis ao leitor.',
      satisfatorio:
        'Fontes presentes mas incompletas (algumas afirmações sem referência, referências sem dados suficientes para localização).',
      insuficiente:
        'Afirmações sem embasamento, dados não referenciados, ausência total de fontes ou uso de fontes não confiáveis.',
    },
  },
  {
    numero: 6,
    slug: 'potencial_impacto',
    label: 'Potencial de impacto e aplicabilidade',
    critico: false,
    descricoes: {
      completo:
        'Alta probabilidade de gerar aprendizagem significativa e mudança de comportamento. Aplicável em contextos reais de sala de aula sem adaptações significativas.',
      satisfatorio:
        'Impacto potencial presente mas limitado por escopo restrito, complexidade de implementação ou dependência de recursos específicos.',
      insuficiente:
        'Impacto improvável dado o formato, complexidade ou distância da realidade educacional brasileira.',
    },
  },
  {
    numero: 7,
    slug: 'contribuicao_cidadania',
    label: 'Contribuição à cidadania e à diversidade',
    critico: true,
    descricoes: {
      completo:
        'Material fortalece ativamente a formação cidadã, reconhece e valoriza a diversidade (étnica, regional, de gênero etc.) e está alinhado com os princípios democráticos.',
      satisfatorio:
        'Contribuição cidadã presente mas superficial. Diversidade não contrariada mas também não afirmada.',
      insuficiente:
        'Material neutro em relação à formação cidadã (não contribui para os objetivos da biblioteca) ou apresenta viés discriminatório.',
    },
  },
  {
    numero: 8,
    slug: 'originalidade',
    label: 'Originalidade e inovação',
    critico: false,
    descricoes: {
      completo:
        'Abordagem, formato ou perspectiva diferenciada em relação ao que já existe na biblioteca. Contribuição nova ao acervo.',
      satisfatorio:
        'Conteúdo válido mas semelhante ao que já existe. Adiciona com redundância aceitável.',
      insuficiente:
        'Duplicata evidente de material já existente ou abordagem completamente genérica sem nenhum diferencial.',
    },
  },
  {
    numero: 9,
    slug: 'adequacao_tecnica',
    label: 'Adequação técnica e acessibilidade',
    critico: false,
    descricoes: {
      completo:
        'Tecnicamente bem produzido, legível, contraste adequado, linguagem acessível, sem erros ortográficos relevantes. Funciona em dispositivos de baixa performance quando digital.',
      satisfatorio:
        'Qualidade técnica aceitável com problemas menores (alguns erros, formatação irregular, levemente pesado para download).',
      insuficiente:
        'Problemas técnicos que comprometem o uso (arquivo corrompido, ilegível, erros graves de português, tamanho proibitivo para conexões lentas).',
    },
  },
  {
    numero: 10,
    slug: 'direitos_autorais',
    label: 'Direitos autorais e uso',
    critico: true,
    descricoes: {
      completo:
        'Material original ou com autorização documentada. Licença de uso explicitada (Creative Commons ou equivalente). Imagens e conteúdos de terceiros devidamente creditados.',
      satisfatorio:
        'Autoria clara mas licença não explicitada. Uso de conteúdos de terceiros com crédito mas sem indicação de licença.',
      insuficiente:
        'Indícios de uso não autorizado de conteúdos de terceiros, ausência de informação de autoria ou licença incompatível com distribuição gratuita.',
    },
  },
  {
    numero: 11,
    slug: 'completude_documental',
    label: 'Completude documental',
    critico: false,
    descricoes: {
      completo:
        'Submissão acompanhada de todos os elementos esperados — descrição adequada, público-alvo definido, eixo da Matriz de Saberes indicado, arquivo do material disponível e acessível.',
      satisfatorio:
        'Maioria dos elementos presentes mas com lacunas menores que podem ser sanadas com uma solicitação ao parceiro.',
      insuficiente:
        'Submissão incompleta a ponto de inviabilizar a avaliação ou a publicação sem retrabalho significativo.',
    },
  },
  {
    numero: 12,
    slug: 'sustentabilidade',
    label: 'Sustentabilidade e escalabilidade',
    critico: false,
    descricoes: {
      completo:
        'Material perene ou com atualização facilitada. Não depende de recursos esgotáveis, tecnologias proprietárias ou contextos políticos transitórios.',
      satisfatorio:
        'Material útil no médio prazo com algumas dependências de contexto que podem desatualizá-lo.',
      insuficiente:
        'Material com prazo de validade curto ou dependência de plataformas, eventos ou políticas que podem deixar de existir.',
    },
  },
  {
    numero: 13,
    slug: 'fit_biblioteca',
    label: 'Aderência ao perfil da biblioteca',
    critico: false,
    descricoes: {
      completo:
        'Etapa de ensino, eixo da Matriz e tipo de recurso convergem com lacunas reais do acervo e com a demanda observada (etapas mais acessadas, perfil do público cadastrado). Preenche um espaço que a biblioteca hoje atende mal ou não atende.',
      satisfatorio:
        'Material útil para um público já bem servido pelo acervo — adiciona valor incremental sem cobrir lacuna evidente.',
      insuficiente:
        'Material desencaixado do perfil da biblioteca (etapa, eixo ou público pouco relevantes ao acervo) ou redundante em relação ao que já existe.',
    },
  },
]

export const CRITERIOS_CRITICOS: SlugCriterio[] = CRITERIOS
  .filter((c) => c.critico)
  .map((c) => c.slug)
