export type TipoRecurso =
  | 'planos-de-aula'
  | 'guias-e-cartilhas'
  | 'videos-e-recursos-digitais'
  | 'jogos-e-atividades'

export type EtapaEnsino =
  | 'educacao-infantil'
  | 'ensino-fundamental-i'
  | 'ensino-fundamental-ii'
  | 'ensino-medio'
  | 'ensino-superior'

export type TemaBNCC =
  | 'cidadania-e-civismo'
  | 'multiculturalismo'
  | 'ciencia-e-tecnologia'
  | 'meio-ambiente'
  | 'saude'

export type LinkTipo = 'url' | 'pendente'

export type MaterialLink = {
  rotulo: string
  url: string
  tipo: LinkTipo
}

export type Recomendacao = 'incluir' | 'incluir-com-ajustes'

export type Material = {
  id: string
  titulo: string
  tituloEditorial: string
  organizacao: string
  descricao: string
  descricaoCard: string
  sinopse: string
  pontosChave: string[]
  tipo: TipoRecurso
  formato: string
  etapas: EtapaEnsino[]
  temas: TemaBNCC[]
  licenca: string
  links: MaterialLink[]
  recomendacao: Recomendacao
  observacoesCurador: string
}
