import Papa from 'papaparse'
import { readFile } from 'fs/promises'
import path from 'path'
import type { Adesao, MunicipioCoord, StatusGrupo, StatusAdesao, Regiao } from './tipos'

// Mapping baseado no CSV real:
//   finalizado  -> aderiu
//   em_processo (em_analise/em_cadastramento) -> iniciou_nao_concluiu
//   nao_iniciado -> nao_iniciado
function normalizarStatusGrupo(statusGrupoRaw: string): StatusGrupo {
  const s = (statusGrupoRaw || '').trim().toLowerCase()
  if (s === 'finalizado' || s === 'aderiu') return 'aderiu'
  if (s === 'em_processo' || s === 'iniciou_nao_concluiu') return 'iniciou_nao_concluiu'
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
    .map((row) => ({
      codigoIbge: String(row.codigo_ibge).trim(),
      tipo: row.tipo === 'estado' ? 'estado' : 'municipio',
      nomeEnte: row.nome_ente,
      uf: row.uf,
      regiao: row.regiao as Regiao,
      status: normalizarStatus(row.status),
      statusGrupo: normalizarStatusGrupo(row.status_grupo),
    }))
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
    })
  })
  return mapa
}
