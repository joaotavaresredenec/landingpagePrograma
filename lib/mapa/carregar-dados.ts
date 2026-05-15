import Papa from 'papaparse'
import { readFile } from 'fs/promises'
import path from 'path'
import type { Adesao, MunicipioCoord, StatusGrupo, StatusAdesao, Regiao } from './tipos'
import { CODIGO_BRASILIA_MUNICIPIO } from './tipos'

// Regra de negócio: "Em análise do MEC" é etapa burocrática — a decisão
// institucional de aderir já foi tomada. Portanto conta como adesão efetiva.
// As 3 categorias visuais (cores no mapa, legenda, drawer) são preservadas:
//   finalizado / em_analise   -> aderiu                 (verde)
//   em_cadastramento          -> iniciou_nao_concluiu   (azul)
//   nao_iniciado              -> nao_iniciado           (cinza)
function deriveStatusGrupo(status: StatusAdesao): StatusGrupo {
  if (status === 'finalizado' || status === 'em_analise') return 'aderiu'
  if (status === 'em_cadastramento') return 'iniciou_nao_concluiu'
  return 'nao_iniciado'
}

// Vocabulário externo (JSON-fonte) -> vocabulário interno (StatusAdesao).
function normalizarStatus(statusRaw: string): StatusAdesao {
  const s = (statusRaw || '').trim().toLowerCase()
  if (s === 'processo_finalizado' || s === 'finalizado') return 'finalizado'
  if (s === 'em_analise_mec' || s === 'em_analise') return 'em_analise'
  if (s === 'em_cadastramento') return 'em_cadastramento'
  return 'nao_iniciado'
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

const REGIAO_POR_UF: Record<string, Regiao> = {
  AC: 'Norte', AM: 'Norte', AP: 'Norte', PA: 'Norte', RO: 'Norte', RR: 'Norte', TO: 'Norte',
  AL: 'Nordeste', BA: 'Nordeste', CE: 'Nordeste', MA: 'Nordeste',
  PB: 'Nordeste', PE: 'Nordeste', PI: 'Nordeste', RN: 'Nordeste', SE: 'Nordeste',
  DF: 'Centro-Oeste', GO: 'Centro-Oeste', MT: 'Centro-Oeste', MS: 'Centro-Oeste',
  ES: 'Sudeste', MG: 'Sudeste', RJ: 'Sudeste', SP: 'Sudeste',
  PR: 'Sul', RS: 'Sul', SC: 'Sul',
}

type AdesaoJson = {
  cod_ibge: string
  uf: string
  municipio: string | null
  esfera: 'municipal' | 'estadual'
  resposta: 'sim' | 'nao' | 'nao_respondido'
  data_aceite: string | null
  status: string
}

async function lerJson<T>(arquivo: string): Promise<T> {
  const filePath = path.join(process.cwd(), 'public', 'geodata', arquivo)
  return JSON.parse(await readFile(filePath, 'utf-8')) as T
}

function rowToAdesao(row: AdesaoJson): Adesao {
  const tipo: 'estado' | 'municipio' =
    row.esfera === 'estadual' ? 'estado' : 'municipio'
  const status = normalizarStatus(row.status)
  const nomeEnte =
    tipo === 'estado' ? (UF_NOMES[row.uf] ?? row.uf) : (row.municipio ?? '')
  return {
    codigoIbge: String(row.cod_ibge).trim(),
    tipo,
    nomeEnte,
    uf: row.uf,
    regiao: REGIAO_POR_UF[row.uf] ?? 'Centro-Oeste',
    status,
    statusGrupo: deriveStatusGrupo(status),
  }
}

export async function carregarAdesoes(): Promise<Adesao[]> {
  const [estaduais, municipios] = await Promise.all([
    lerJson<AdesaoJson[]>('adesoes-estaduais.json'),
    lerJson<AdesaoJson[]>('adesoes-municipios.json'),
  ])
  return [...estaduais, ...municipios]
    .map(rowToAdesao)
    // Remove Brasília como "município" — é capital/UF, não município autônomo
    .filter((a) => !(a.tipo === 'municipio' && a.codigoIbge === CODIGO_BRASILIA_MUNICIPIO))
}

type MunicipioRow = {
  codigo_ibge: string
  nome: string
  latitude: string
  longitude: string
  capital: string
}

export async function carregarMunicipiosCoord(): Promise<Map<string, MunicipioCoord>> {
  const filePath = path.join(process.cwd(), 'public', 'geodata', 'municipios.csv')
  const csv = await readFile(filePath, 'utf-8')
  const { data } = Papa.parse<MunicipioRow>(csv, {
    header: true,
    skipEmptyLines: true,
  })

  // Carrega populações em paralelo (best-effort)
  const populacoes = await carregarPopulacao()

  const mapa = new Map<string, MunicipioCoord>()
  data.forEach((row) => {
    if (!row.codigo_ibge) return
    const codigo = String(row.codigo_ibge).trim()
    const lat = parseFloat(row.latitude)
    const lng = parseFloat(row.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return
    mapa.set(codigo, {
      codigoIbge: codigo,
      nome: row.nome,
      latitude: lat,
      longitude: lng,
      capital: row.capital === '1' || row.capital === 'true',
      populacao: populacoes.get(codigo),
    })
  })
  return mapa
}

type PopulacaoRow = {
  codigo_ibge: string
  populacao: string
}

export async function carregarPopulacao(): Promise<Map<string, number>> {
  const filePath = path.join(process.cwd(), 'public', 'geodata', 'populacao-municipios.csv')
  try {
    const csv = await readFile(filePath, 'utf-8')
    const { data } = Papa.parse<PopulacaoRow>(csv, {
      header: true,
      skipEmptyLines: true,
    })
    const mapa = new Map<string, number>()
    data.forEach((row) => {
      if (!row.codigo_ibge) return
      const pop = parseInt(row.populacao, 10)
      if (!Number.isNaN(pop)) {
        mapa.set(String(row.codigo_ibge).trim(), pop)
      }
    })
    return mapa
  } catch {
    console.warn('[mapa] populacao-municipios.csv não encontrado — Visualização 3 ficará limitada')
    return new Map()
  }
}
