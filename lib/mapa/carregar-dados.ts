import Papa from 'papaparse'
import { readFile } from 'fs/promises'
import path from 'path'
import type { Adesao, MunicipioCoord, StatusGrupo, StatusAdesao, Regiao } from './tipos'
import { CODIGO_BRASILIA_MUNICIPIO } from './tipos'

// Regra de negócio: "Em análise do MEC" é etapa burocrática — a decisão
// institucional de aderir já foi tomada. Portanto ela conta como adesão efetiva.
//   finalizado        -> aderiu
//   em_analise        -> aderiu  (etapa formal pós-decisão)
//   em_cadastramento  -> iniciou_nao_concluiu
//   nao_iniciado      -> nao_iniciado
//
// A coluna `status_grupo` do CSV é ignorada — usamos `status` para derivar
// o grupo, já que o CSV agrupava em_analise junto de em_cadastramento.
function deriveStatusGrupo(status: StatusAdesao): StatusGrupo {
  if (status === 'finalizado' || status === 'em_analise') return 'aderiu'
  if (status === 'em_cadastramento') return 'iniciou_nao_concluiu'
  return 'nao_iniciado'
}

function normalizarStatus(statusRaw: string): StatusAdesao {
  const s = (statusRaw || '').trim().toLowerCase()
  if (s === 'finalizado') return 'finalizado'
  if (s === 'em_analise') return 'em_analise'
  if (s === 'em_cadastramento') return 'em_cadastramento'
  return 'nao_iniciado'
}

type AdesaoRow = {
  codigo_ibge: string
  tipo: string
  nome_ente: string
  uf: string
  regiao: string
  status: string
  status_grupo: string
}

export async function carregarAdesoes(): Promise<Adesao[]> {
  const filePath = path.join(process.cwd(), 'public', 'geodata', 'adesoes-pecs.csv')
  const csv = await readFile(filePath, 'utf-8')
  const { data } = Papa.parse<AdesaoRow>(csv, {
    header: true,
    skipEmptyLines: true,
  })
  return data
    .filter((r) => r.codigo_ibge && r.tipo)
    .map((row) => {
      const status = normalizarStatus(row.status)
      return {
        codigoIbge: String(row.codigo_ibge).trim(),
        tipo: row.tipo === 'estado' ? ('estado' as const) : ('municipio' as const),
        nomeEnte: row.nome_ente,
        uf: row.uf,
        regiao: row.regiao as Regiao,
        status,
        statusGrupo: deriveStatusGrupo(status),
      }
    })
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
