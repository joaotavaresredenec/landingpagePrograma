import type { Adesao, EstatisticasEstado, EstatisticasNacionais } from './tipos'

const UF_NOMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
  MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco',
  PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe',
  TO: 'Tocantins',
}

export function calcularEstatisticasEstado(adesoes: Adesao[], uf: string): EstatisticasEstado {
  const municipios = adesoes.filter((a) => a.tipo === 'municipio' && a.uf === uf)
  const estado = adesoes.find((a) => a.tipo === 'estado' && a.uf === uf)

  const aderidos = municipios.filter((m) => m.statusGrupo === 'aderiu').length
  const iniciouNaoConcluiu = municipios.filter((m) => m.statusGrupo === 'iniciou_nao_concluiu').length
  const naoIniciado = municipios.filter((m) => m.statusGrupo === 'nao_iniciado').length
  const total = municipios.length

  return {
    uf,
    nome: UF_NOMES[uf] ?? uf,
    totalMunicipios: total,
    aderidos,
    iniciouNaoConcluiu,
    naoIniciado,
    percentualAderido: total > 0 ? (aderidos / total) * 100 : 0,
    percentualComMovimento: total > 0 ? ((aderidos + iniciouNaoConcluiu) / total) * 100 : 0,
    statusProprio: estado?.statusGrupo ?? 'nao_iniciado',
  }
}

export function calcularEstatisticasNacionais(adesoes: Adesao[]): EstatisticasNacionais {
  const estados = adesoes.filter((a) => a.tipo === 'estado')
  const municipios = adesoes.filter((a) => a.tipo === 'municipio')

  const estadosAderidos = estados.filter((e) => e.statusGrupo === 'aderiu').length
  const estadosIniciaram = estados.filter((e) => e.statusGrupo === 'iniciou_nao_concluiu').length

  const munAderidos = municipios.filter((m) => m.statusGrupo === 'aderiu').length
  const munIniciaram = municipios.filter((m) => m.statusGrupo === 'iniciou_nao_concluiu').length

  const totalMunicipios = municipios.length

  return {
    estadosAderidos,
    estadosIniciaramNaoConcluiram: estadosIniciaram,
    totalEstados: estados.length,
    municipiosAderidos: munAderidos,
    municipiosIniciaramNaoConcluiram: munIniciaram,
    totalMunicipios,
    percentualAderidos: totalMunicipios > 0 ? (munAderidos / totalMunicipios) * 100 : 0,
    percentualComMovimento:
      totalMunicipios > 0 ? ((munAderidos + munIniciaram) / totalMunicipios) * 100 : 0,
  }
}

export function calcularRankingEstados(adesoes: Adesao[]): EstatisticasEstado[] {
  const ufs = Array.from(new Set(adesoes.filter((a) => a.tipo === 'estado').map((a) => a.uf)))
  return ufs
    .map((uf) => calcularEstatisticasEstado(adesoes, uf))
    .sort((a, b) => b.percentualAderido - a.percentualAderido)
}
