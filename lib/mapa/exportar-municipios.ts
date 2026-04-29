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

// Cores em RGB para corresponder ao design system Redenec
const COR_VERDE: [number, number, number] = [28, 255, 158]
const COR_AZUL: [number, number, number] = [0, 134, 255]
const COR_CORAL: [number, number, number] = [255, 139, 128]
const COR_PETROLEO: [number, number, number] = [27, 65, 94]
const COR_CINZA_TEXTO: [number, number, number] = [80, 80, 80]

const ORDEM_GRUPO: StatusGrupo[] = ['aderiu', 'iniciou_nao_concluiu', 'nao_iniciado']

const COR_POR_GRUPO: Record<StatusGrupo, [number, number, number]> = {
  aderiu: COR_VERDE,
  iniciou_nao_concluiu: COR_AZUL,
  nao_iniciado: COR_CORAL,
}

const ROTULO_ADESAO_ESTADO: Record<StatusGrupo, string> = {
  aderiu: 'Estado aderido ao Programa',
  iniciou_nao_concluiu: 'Estado em processo de adesão',
  nao_iniciado: 'Estado ainda não aderiu ao Programa',
}

// Texto da pílula: branco sobre azul (contraste), petróleo sobre verde/coral
const COR_TEXTO_PILULA: Record<StatusGrupo, [number, number, number]> = {
  aderiu: COR_PETROLEO,
  iniciou_nao_concluiu: [255, 255, 255],
  nao_iniciado: COR_PETROLEO,
}

function nomeArquivoSeguro(nomeEstado: string): string {
  return nomeEstado
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
}

function formatarDataHoraBR(d: Date): string {
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const ano = d.getFullYear()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${ano} ${h}:${m}`
}

export async function baixarPdfMunicipiosEstado(
  municipios: Adesao[],
  uf: string,
  nomeEstado: string,
  statusEstado: StatusGrupo,
): Promise<void> {
  // Dynamic import: evita inflar o bundle inicial — jspdf só carrega quando
  // o usuário clica para exportar.
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const autoTable = autoTableModule.default

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const larguraPagina = doc.internal.pageSize.getWidth()
  const margemX = 14

  // Cabeçalho institucional
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...COR_PETROLEO)
  doc.text('Adesão ao PECS', margemX, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`${nomeEstado} (${uf})`, margemX, 25)

  doc.setFontSize(9)
  doc.setTextColor(...COR_CINZA_TEXTO)
  doc.text(
    'Programa Educação para a Cidadania e Sustentabilidade · Portaria MEC nº 642/2025',
    margemX,
    31,
  )
  doc.text(`Gerado em ${formatarDataHoraBR(new Date())}`, margemX, 36)

  // Pílula com status de adesão do estado
  const rotuloAdesao = ROTULO_ADESAO_ESTADO[statusEstado]
  const corPilula = COR_POR_GRUPO[statusEstado]
  const corTextoPilula = COR_TEXTO_PILULA[statusEstado]
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  const larguraTexto = doc.getTextWidth(rotuloAdesao)
  const paddingX = 4
  const paddingY = 1.8
  const alturaPilula = 6.5
  doc.setFillColor(...corPilula)
  doc.roundedRect(
    margemX,
    40,
    larguraTexto + paddingX * 2,
    alturaPilula,
    1.5,
    1.5,
    'F',
  )
  doc.setTextColor(...corTextoPilula)
  doc.text(rotuloAdesao, margemX + paddingX, 40 + alturaPilula - paddingY)

  // Resumo de contagens
  const grupos: Record<StatusGrupo, Adesao[]> = {
    aderiu: [],
    iniciou_nao_concluiu: [],
    nao_iniciado: [],
  }
  for (const m of municipios) {
    grupos[m.statusGrupo].push(m)
  }
  for (const g of ORDEM_GRUPO) {
    grupos[g].sort((a, b) => a.nomeEnte.localeCompare(b.nomeEnte, 'pt-BR'))
  }

  const total = municipios.length
  const resumoLinhas = [
    `Total de municípios: ${total}`,
    `Aderiu: ${grupos.aderiu.length}  ·  Em adesão: ${grupos.iniciou_nao_concluiu.length}  ·  Não iniciado: ${grupos.nao_iniciado.length}`,
  ]
  doc.setTextColor(...COR_PETROLEO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(resumoLinhas[0], margemX, 54)
  doc.setFont('helvetica', 'normal')
  doc.text(resumoLinhas[1], margemX, 59)

  // Linha separadora
  doc.setDrawColor(220, 220, 220)
  doc.line(margemX, 63, larguraPagina - margemX, 63)

  // Renderiza uma tabela por grupo (somente se houver municípios)
  let posY = 68
  for (const grupo of ORDEM_GRUPO) {
    const lista = grupos[grupo]
    if (lista.length === 0) continue

    const cor = COR_POR_GRUPO[grupo]

    // Título do grupo
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...COR_PETROLEO)
    doc.text(
      `${STATUS_GRUPO_LABEL[grupo]} — ${lista.length} ${lista.length === 1 ? 'município' : 'municípios'}`,
      margemX,
      posY,
    )

    autoTable(doc, {
      startY: posY + 3,
      head: [['#', 'Município', 'Código IBGE', 'Status detalhado']],
      body: lista.map((m, i) => [
        String(i + 1),
        m.nomeEnte,
        m.codigoIbge,
        STATUS_DETALHADO_LABEL[m.status],
      ]),
      headStyles: {
        fillColor: cor,
        textColor: COR_PETROLEO,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [40, 40, 40],
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'right' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
      },
      margin: { left: margemX, right: margemX },
      theme: 'grid',
    })

    // Atualiza Y para o próximo grupo
    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY
    posY = (finalY ?? posY + 10) + 8
  }

  // Rodapé em todas as páginas
  const totalPaginas = doc.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...COR_CINZA_TEXTO)
    const alturaPagina = doc.internal.pageSize.getHeight()
    doc.text(
      'Dados compartilhados via Acordo de Cooperação nº 14/2025 entre MEC e Redenec.',
      margemX,
      alturaPagina - 8,
    )
    doc.text(
      `Página ${i} de ${totalPaginas}`,
      larguraPagina - margemX,
      alturaPagina - 8,
      { align: 'right' },
    )
  }

  const dataIso = new Date()
  const ymd = `${dataIso.getFullYear()}${String(dataIso.getMonth() + 1).padStart(2, '0')}${String(dataIso.getDate()).padStart(2, '0')}`
  doc.save(`adesao-pecs-${nomeArquivoSeguro(nomeEstado)}-${ymd}.pdf`)
}

export async function baixarExcelMunicipiosEstado(
  municipios: Adesao[],
  uf: string,
  nomeEstado: string,
  statusEstado: StatusGrupo,
): Promise<void> {
  // Dynamic import: xlsx (~250KB) so carrega quando o usuario clica em exportar.
  const XLSX = await import('xlsx')

  const ordenados = [...municipios].sort((a, b) => {
    const ordemA = ORDEM_GRUPO.indexOf(a.statusGrupo)
    const ordemB = ORDEM_GRUPO.indexOf(b.statusGrupo)
    if (ordemA !== ordemB) return ordemA - ordemB
    return a.nomeEnte.localeCompare(b.nomeEnte, 'pt-BR')
  })

  const aderiuCount = municipios.filter((m) => m.statusGrupo === 'aderiu').length
  const emAdesaoCount = municipios.filter(
    (m) => m.statusGrupo === 'iniciou_nao_concluiu',
  ).length
  const naoIniciadoCount = municipios.filter(
    (m) => m.statusGrupo === 'nao_iniciado',
  ).length

  // Aba 1 — Resumo
  const resumoLinhas: (string | number)[][] = [
    [`Adesão ao PECS — ${nomeEstado} (${uf})`],
    ['Programa Educação para a Cidadania e Sustentabilidade · Portaria MEC nº 642/2025'],
    [`Gerado em ${formatarDataHoraBR(new Date())}`],
    [`Situação do estado: ${ROTULO_ADESAO_ESTADO[statusEstado]}`],
    [],
    ['Estágio', 'Total'],
    ['Aderiu', aderiuCount],
    ['Em adesão', emAdesaoCount],
    ['Não iniciado', naoIniciadoCount],
    ['Total geral', municipios.length],
    [],
    ['Dados compartilhados via Acordo de Cooperação nº 14/2025 entre MEC e Redenec.'],
  ]
  const wsResumo = XLSX.utils.aoa_to_sheet(resumoLinhas)
  wsResumo['!cols'] = [{ wch: 36 }, { wch: 14 }]
  // Mescla titulo e linhas informativas em uma so coluna
  wsResumo['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
    { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
  ]

  // Aba 2 — Municipios completos
  const cabecalho = [
    'Município',
    'UF',
    'Código IBGE',
    'Estágio',
    'Status detalhado',
    'Região',
  ]
  const linhasMunicipios = ordenados.map((m) => [
    m.nomeEnte,
    m.uf,
    m.codigoIbge,
    STATUS_GRUPO_LABEL[m.statusGrupo],
    STATUS_DETALHADO_LABEL[m.status],
    m.regiao,
  ])
  const wsMunicipios = XLSX.utils.aoa_to_sheet([cabecalho, ...linhasMunicipios])
  wsMunicipios['!cols'] = [
    { wch: 32 },
    { wch: 5 },
    { wch: 14 },
    { wch: 14 },
    { wch: 32 },
    { wch: 14 },
  ]
  // Auto-filtro nas colunas (permite filtrar diretamente no Excel)
  wsMunicipios['!autofilter'] = {
    ref: `A1:F${linhasMunicipios.length + 1}`,
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')
  XLSX.utils.book_append_sheet(wb, wsMunicipios, 'Municípios')

  const dataIso = new Date()
  const ymd = `${dataIso.getFullYear()}${String(dataIso.getMonth() + 1).padStart(2, '0')}${String(dataIso.getDate()).padStart(2, '0')}`
  XLSX.writeFile(wb, `adesao-pecs-${nomeArquivoSeguro(nomeEstado)}-${ymd}.xlsx`)
}
