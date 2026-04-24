export type StatusAdesao =
  | 'nao_iniciado'
  | 'em_cadastramento'
  | 'em_analise'
  | 'finalizado'

export type StatusGrupo =
  | 'nao_iniciado'
  | 'iniciou_nao_concluiu'
  | 'aderiu'

export type Regiao =
  | 'Norte'
  | 'Nordeste'
  | 'Centro-Oeste'
  | 'Sudeste'
  | 'Sul'

export type Adesao = {
  codigoIbge: string
  tipo: 'estado' | 'municipio'
  nomeEnte: string
  uf: string
  regiao: Regiao
  status: StatusAdesao
  statusGrupo: StatusGrupo
}

export type MunicipioCoord = {
  codigoIbge: string
  nome: string
  latitude: number
  longitude: number
  capital: boolean
  populacao?: number
}

export type EstatisticasEstado = {
  uf: string
  nome: string
  totalMunicipios: number
  aderidos: number
  iniciouNaoConcluiu: number
  naoIniciado: number
  percentualAderido: number
  percentualComMovimento: number
  statusProprio: StatusGrupo
}

export type EstatisticasNacionais = {
  estadosAderidos: number
  estadosIniciaramNaoConcluiram: number
  totalEstados: number
  municipiosAderidos: number
  municipiosIniciaramNaoConcluiram: number
  totalMunicipios: number
  percentualAderidos: number
  percentualComMovimento: number
}

/**
 * Código IBGE de Brasília como "município" (convenção IBGE).
 * Brasília NÃO é um município — é a capital federal e sede do DF,
 * que é uma UF sem municípios. Este código é usado apenas para
 * identificar e remover Brasília de cálculos onde ela apareceria
 * incorretamente como município.
 */
export const CODIGO_BRASILIA_MUNICIPIO = '5300108'

/** Código IBGE do Distrito Federal como unidade federativa. */
export const CODIGO_DF_ESTADO = '53'
