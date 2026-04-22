import type { TipoRecurso, EtapaEnsino, TemaBNCC } from '@/types/material'

// ── Tipos de recurso ────────────────────────────────────────────────────────

export const TIPOS_RECURSO: Record<TipoRecurso, { label: string; descricao: string; ordem: number }> = {
  'planos-de-aula': {
    label: 'Planos de aula',
    descricao: 'Sequências didáticas e roteiros prontos para aplicação em sala de aula',
    ordem: 1,
  },
  'guias-e-cartilhas': {
    label: 'Guias e cartilhas',
    descricao: 'Materiais de referência, manuais e publicações para gestores e educadores',
    ordem: 2,
  },
  'videos-e-recursos-digitais': {
    label: 'Vídeos e recursos digitais',
    descricao: 'Conteúdos audiovisuais, podcasts, ferramentas interativas e recursos online',
    ordem: 3,
  },
  'jogos-e-atividades': {
    label: 'Jogos e atividades',
    descricao: 'Materiais lúdicos e dinâmicas para engajamento e aprendizagem ativa',
    ordem: 4,
  },
}

// ── Etapas de ensino ────────────────────────────────────────────────────────

export const ETAPAS_ENSINO: Record<EtapaEnsino, { label: string; labelCompleto: string; ordem: number }> = {
  'educacao-infantil': {
    label: 'Ed. Infantil',
    labelCompleto: 'Educação Infantil',
    ordem: 1,
  },
  'ensino-fundamental-i': {
    label: 'EF I',
    labelCompleto: 'Ensino Fundamental I (1º ao 5º ano)',
    ordem: 2,
  },
  'ensino-fundamental-ii': {
    label: 'EF II',
    labelCompleto: 'Ensino Fundamental II (6º ao 9º ano)',
    ordem: 3,
  },
  'ensino-medio': {
    label: 'Ensino Médio',
    labelCompleto: 'Ensino Médio',
    ordem: 4,
  },
  'ensino-superior': {
    label: 'Ensino Superior',
    labelCompleto: 'Ensino Superior',
    ordem: 5,
  },
}

// ── Temas Contemporâneos Transversais (BNCC) ────────────────────────────────
// Fonte: Temas Contemporâneos Transversais na BNCC — MEC, 2019
// Não inclui subáreas disciplinares — apenas os temas-mãe

export const TEMAS_BNCC: Record<TemaBNCC, { label: string; ordem: number }> = {
  'cidadania-e-civismo': {
    label: 'Cidadania e Civismo',
    ordem: 1,
  },
  'multiculturalismo': {
    label: 'Multiculturalismo',
    ordem: 2,
  },
  'ciencia-e-tecnologia': {
    label: 'Ciência e Tecnologia',
    ordem: 3,
  },
  'meio-ambiente': {
    label: 'Meio Ambiente',
    ordem: 4,
  },
  'saude': {
    label: 'Saúde',
    ordem: 5,
  },
}

// ── Regras de facetamento ───────────────────────────────────────────────────
//
// Filtros dentro do mesmo grupo (ex: duas etapas) → OR
// Filtros entre grupos diferentes (ex: etapa + tema) → AND
//
// Exemplo: usuário seleciona [EF II, EM] + [Meio Ambiente]
// → mostra materiais que atendem (EF II OU EM) E (Meio Ambiente)

export const FACETING_RULE = 'AND_between_groups_OR_within_group' as const

// ── Mensagens de interface ──────────────────────────────────────────────────

export const COPY_BIBLIOTECA = {
  semResultados: 'Nenhum material encontrado com os filtros selecionados.',
  semResultadosSugestao: 'Tente remover alguns filtros para ampliar a busca.',
  limparFiltros: 'Limpar filtros',
  resultadosSingular: 'material encontrado',
  resultadosPlural: 'materiais encontrados',
  buscaPlaceholder: 'Buscar por título, organização...',
  emBreve: 'Em breve',
} as const
