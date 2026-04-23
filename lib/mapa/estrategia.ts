import type { Adesao, MunicipioCoord, StatusGrupo } from './tipos'

const LIMITE_MUNICIPIO_GRANDE = 100_000

export type EstadoComMunicipiosNaoIniciados = {
  uf: string
  nome: string
  totalMunicipios: number
  naoIniciados: number
  percentualNaoIniciado: number
}

export type MunicipioGrandeNaoAderido = {
  codigoIbge: string
  nome: string
  uf: string
  populacao: number
  statusGrupo: StatusGrupo
}

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

const CODIGOS_CAPITAIS = new Set([
  '1200401','2704302','1600303','1302603','2927408','2304400','5300108',
  '3205309','5208707','2111300','5103403','5002704','3106200','1501402',
  '2507507','4106902','2611606','2211001','3304557','2408102','4314902',
  '1100205','1400100','4205407','3550308','2800308','1721000',
])

const ALUNOS_REDES_NAO_INICIADAS: Record<string, number> = {
  ES: 190_000,
  MG: 1_600_000,
  MT: 442_000,
  RR: 165_000,
}

/** Top 10 estados com mais municípios em status "não iniciado". */
export function calcularRankingNaoIniciados(adesoes: Adesao[]): EstadoComMunicipiosNaoIniciados[] {
  const ufs = Array.from(new Set(adesoes.filter((a) => a.tipo === 'estado').map((a) => a.uf)))
  return ufs
    .map((uf) => {
      const municipiosUf = adesoes.filter((a) => a.tipo === 'municipio' && a.uf === uf)
      const naoIniciados = municipiosUf.filter((m) => m.statusGrupo === 'nao_iniciado').length
      const total = municipiosUf.length
      return {
        uf,
        nome: UF_NOMES[uf] ?? uf,
        totalMunicipios: total,
        naoIniciados,
        percentualNaoIniciado: total > 0 ? (naoIniciados / total) * 100 : 0,
      }
    })
    .sort((a, b) => b.naoIniciados - a.naoIniciados)
    .slice(0, 10)
}

export function somarMunicipiosNaoIniciados(
  ranking: EstadoComMunicipiosNaoIniciados[],
  topN = 5,
): number {
  return ranking.slice(0, topN).reduce((acc, e) => acc + e.naoIniciados, 0)
}

/** Municípios com pop. >= 100.000 que ainda não aderiram (não iniciaram OU iniciaram sem concluir). */
export function calcularMunicipiosGrandesNaoAderidos(
  adesoes: Adesao[],
  municipiosCoord: Record<string, MunicipioCoord>,
): MunicipioGrandeNaoAderido[] {
  const naoAderidos = adesoes.filter(
    (a) =>
      a.tipo === 'municipio' &&
      (a.statusGrupo === 'nao_iniciado' || a.statusGrupo === 'iniciou_nao_concluiu'),
  )

  const resultado: MunicipioGrandeNaoAderido[] = []
  naoAderidos.forEach((a) => {
    const coord = municipiosCoord[a.codigoIbge]
    if (coord?.populacao && coord.populacao >= LIMITE_MUNICIPIO_GRANDE) {
      resultado.push({
        codigoIbge: a.codigoIbge,
        nome: a.nomeEnte,
        uf: a.uf,
        populacao: coord.populacao,
        statusGrupo: a.statusGrupo,
      })
    }
  })
  return resultado.sort((a, b) => b.populacao - a.populacao)
}

/** Capitais que ainda não aderiram (status diferente de "aderiu"). */
export function calcularCapitaisNaoAderidas(adesoes: Adesao[]): Adesao[] {
  return adesoes.filter(
    (a) =>
      a.tipo === 'municipio' &&
      CODIGOS_CAPITAIS.has(a.codigoIbge) &&
      a.statusGrupo !== 'aderiu',
  )
}

/** Estados (UF) com status "não iniciado" + nº de alunos da rede estadual. */
export function calcularEstadosNaoIniciadosComAlunos(adesoes: Adesao[]) {
  const estadosNaoIniciados = adesoes.filter(
    (a) => a.tipo === 'estado' && a.statusGrupo === 'nao_iniciado',
  )
  return estadosNaoIniciados.map((e) => ({
    uf: e.uf,
    nome: e.nomeEnte,
    alunos: ALUNOS_REDES_NAO_INICIADAS[e.uf] ?? 0,
  }))
}

export function totalAlunosEstadosNaoIniciados(adesoes: Adesao[]): number {
  return calcularEstadosNaoIniciadosComAlunos(adesoes).reduce((acc, e) => acc + e.alunos, 0)
}

export function formatarPopulacao(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',')} mi hab.`
  if (num >= 1_000) return `${Math.round(num / 1_000)} mil hab.`
  return `${num} hab.`
}

export function formatarAlunos(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',')} milhões de alunos`
  if (num >= 1_000) return `${Math.round(num / 1_000)} mil alunos`
  return `${num} alunos`
}
