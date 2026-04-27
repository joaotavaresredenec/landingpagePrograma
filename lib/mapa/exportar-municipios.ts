import type { Adesao, StatusAdesao, StatusGrupo } from './tipos'

const STATUS_GRUPO_LABEL: Record<StatusGrupo, string> = {
  aderiu: 'Aderiu',
  iniciou_nao_concluiu: 'Em adesão',
  nao_iniciado: 'Não iniciado',
}

const STATUS_DETALHADO_LABEL: Record<StatusAdesao, string> = {
  finalizado: 'Finalizado (publicado no DOU)',
  em_analise: 'Em análise pelo MEC',
  em_cadastramento: 'Em cadastramento no SIMEC',
  nao_iniciado: 'Não iniciado',
}

// Ordem de apresentação no CSV: aderidos primeiro, depois em adesão, depois não iniciados.
const ORDEM_GRUPO: StatusGrupo[] = ['aderiu', 'iniciou_nao_concluiu', 'nao_iniciado']

function escaparCampoCSV(valor: string): string {
  // RFC 4180: campos com aspas, vírgula ou quebra de linha precisam ser quotados
  // e aspas internas duplicadas.
  if (/[",\n\r]/.test(valor)) {
    return `"${valor.replace(/"/g, '""')}"`
  }
  return valor
}

export function gerarCsvMunicipiosEstado(
  municipios: Adesao[],
  uf: string,
  nomeEstado: string,
): string {
  const ordenados = [...municipios].sort((a, b) => {
    const ordemA = ORDEM_GRUPO.indexOf(a.statusGrupo)
    const ordemB = ORDEM_GRUPO.indexOf(b.statusGrupo)
    if (ordemA !== ordemB) return ordemA - ordemB
    return a.nomeEnte.localeCompare(b.nomeEnte, 'pt-BR')
  })

  const cabecalho = [
    'Município',
    'UF',
    'Código IBGE',
    'Estágio',
    'Status detalhado',
    'Região',
  ]

  const linhas = ordenados.map((m) =>
    [
      m.nomeEnte,
      m.uf,
      m.codigoIbge,
      STATUS_GRUPO_LABEL[m.statusGrupo],
      STATUS_DETALHADO_LABEL[m.status],
      m.regiao,
    ]
      .map(escaparCampoCSV)
      .join(','),
  )

  const meta = `# Adesão ao PECS — ${nomeEstado} (${uf}) | Gerado em ${new Date().toLocaleString('pt-BR')}`

  return [meta, cabecalho.join(','), ...linhas].join('\r\n')
}

export function baixarCsvMunicipiosEstado(
  municipios: Adesao[],
  uf: string,
  nomeEstado: string,
): void {
  const csv = gerarCsvMunicipiosEstado(municipios, uf, nomeEstado)
  // BOM UTF-8 para Excel reconhecer acentuação corretamente
  const bom = '﻿'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const ano = new Date().getFullYear()
  const mes = String(new Date().getMonth() + 1).padStart(2, '0')
  const dia = String(new Date().getDate()).padStart(2, '0')
  const nomeArquivoBase = nomeEstado
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()

  const link = document.createElement('a')
  link.href = url
  link.download = `adesao-pecs-${nomeArquivoBase}-${ano}${mes}${dia}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
