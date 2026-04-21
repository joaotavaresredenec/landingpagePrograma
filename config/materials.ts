export type TipoMaterial =
  | 'guia'
  | 'modelo'
  | 'trilha'
  | 'recurso'
  | 'jogo'
  | 'boas-praticas'

export type EtapaEnsino = 'ef-inicial' | 'ef-final' | 'em' | 'eja' | 'todas'

export const TIPO_LABELS: Record<TipoMaterial, string> = {
  'guia': 'Guia',
  'modelo': 'Modelo',
  'trilha': 'Trilha pedagógica',
  'recurso': 'Recurso didático',
  'jogo': 'Jogo/Dinâmica',
  'boas-praticas': 'Boas práticas',
}

export const ETAPA_LABELS: Record<EtapaEnsino, string> = {
  'ef-inicial': 'EF anos iniciais',
  'ef-final': 'EF anos finais',
  'em': 'Ensino Médio',
  'eja': 'EJA',
  'todas': 'Todas as etapas',
}

export type Material = {
  id: string
  titulo: string
  resumo: string
  icone: string // nome do ícone Lucide
  driveUrl: string
  tipo: TipoMaterial
  etapas: EtapaEnsino[]
  dataPublicacao: string // ISO date YYYY-MM-DD
}

export const materials: Material[] = [
  {
    id: 'guia-ponto-focal',
    titulo: 'Guia do Ponto Focal',
    resumo:
      'Documento com atribuições, cronograma sugerido e orientações para quem vai coordenar o Programa dentro da secretaria ou escola.',
    icone: 'Users',
    driveUrl: '#',
    tipo: 'guia',
    etapas: ['todas'],
    dataPublicacao: '2026-04-21',
  },
  {
    id: 'modelo-plano-acao',
    titulo: 'Modelo de Plano de Ação',
    resumo:
      'Template editável com estrutura aprovada, exemplos de metas e indicadores alinhados ao que o MEC solicita.',
    icone: 'ClipboardList',
    driveUrl: '#',
    tipo: 'modelo',
    etapas: ['todas'],
    dataPublicacao: '2026-04-21',
  },
  {
    id: 'trilhas-pedagogicas',
    titulo: 'Trilhas Pedagógicas',
    resumo:
      'Sequências de atividades por eixo temático e etapa de ensino, com indicação das habilidades da BNCC.',
    icone: 'Route',
    driveUrl: '#',
    tipo: 'trilha',
    etapas: ['ef-inicial', 'ef-final', 'em', 'eja'],
    dataPublicacao: '2026-04-21',
  },
  {
    id: 'recursos-didaticos',
    titulo: 'Recursos Didáticos',
    resumo:
      'Textos, vídeos e fichas de apoio para professores, prontos para uso em sala ou para adaptação ao contexto local.',
    icone: 'Layers',
    driveUrl: '#',
    tipo: 'recurso',
    etapas: ['ef-inicial', 'ef-final', 'em', 'eja'],
    dataPublicacao: '2026-04-21',
  },
  {
    id: 'jogos-dinamicas',
    titulo: 'Jogos e Dinâmicas',
    resumo:
      'Atividades interativas para trabalhar cidadania e sustentabilidade de forma participativa com estudantes.',
    icone: 'Gamepad2',
    driveUrl: '#',
    tipo: 'jogo',
    etapas: ['ef-inicial', 'ef-final', 'em'],
    dataPublicacao: '2026-04-21',
  },
  {
    id: 'banco-boas-praticas',
    titulo: 'Banco de Boas Práticas',
    resumo:
      'Experiências documentadas de redes que já implementam o Programa, com contexto, estratégia e resultados.',
    icone: 'Star',
    driveUrl: '#',
    tipo: 'boas-praticas',
    etapas: ['todas'],
    dataPublicacao: '2026-04-21',
  },
]
