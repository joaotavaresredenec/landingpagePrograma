import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CAPAS_DIR = path.join(ROOT, 'public', 'logos', 'capas')
const ORIGINAIS_DIR = path.join(CAPAS_DIR, '_originais')
const THUMB_DIR = path.join(CAPAS_DIR, 'optimized', 'thumb')
const FULL_DIR = path.join(CAPAS_DIR, 'optimized', 'full')
const JPG_DIR = path.join(CAPAS_DIR, 'optimized', 'jpg')

const RENAMES = {
  'FundacaoFHC_direitoàeducacao.png': 'FundacaoFHC_direitoaeducacao.png',
  'FundacaoFHC_direitoslgbtqpn+.png': 'FundacaoFHC_direitoslgbtqiapn.png',
  'FundacaoFHC_Linhas do tempo.png': 'FundacaoFHC_linhasdotempo.png',
}

const MAPEAMENTO = {
  'amarelinhaeemmiudos.png': { id: 'amarelinha-em-miudos', titulo: 'Amarelinha em Miúdos' },
  'Auschwitzescolalugardepertencer.png': { id: 'kit-de-atividades-escola-e-lugar-de-pertencer', titulo: 'Escola é lugar de pertencer' },
  'cidadaniaedemocraciadesdeaescolacadernometodologico.png': { id: 'caderno-metodologico-cidadania-e-democracia-desde-a-escola', titulo: 'Cidadania e Democracia desde a Escola' },
  'cursoeadcidadaniaepoliticaspublicas.png': { id: 'curso-ead-cidadania-e-politicas-publicas', titulo: 'Curso EaD: Cidadania e Políticas Públicas' },
  'direitosecidadaniacadernosprofessoreletivaauschwitz.png': { id: 'direitos-e-cidadania-cadernos-do-professor', titulo: 'Direitos e Cidadania: cadernos do professor' },
  'FundacaoFHC_caminhosustentaveis.png': { id: 'roteiros-pedagogicos---caminhos-sustentaveis-acoes-locais-im', titulo: 'Caminhos Sustentáveis' },
  'FundacaoFHC_direitoàeducacao.png': { id: 'roteiros-pedagogicos---direito-a-educacao', titulo: 'Direito à Educação' },
  'FundacaoFHC_direitosindigenas.png': { id: 'roteiros-pedagogicos---direitos-indigenas-em-foco', titulo: 'Direitos Indígenas em Foco' },
  'FundacaoFHC_direitoslgbtqpn+.png': { id: 'roteiros-pedagogicos---direitos-lgbtqiapn', titulo: 'Direitos LGBTQIAPN+' },
  'FundacaoFHC_educaremtemposdeIA.png': { id: 'colecao-coracoes-e-mentes---vol-4-educar-em-tempos-de-inteli', titulo: 'Educar em Tempos de IA (Vol. 4)' },
  'FundacaoFHC_ensinoreligoso.png': { id: 'colecao-coracoes-e-mentes---vol-2-ensino-religioso-e-valores', titulo: 'Ensino Religioso e Valores Democráticos (Vol. 2)' },
  'FundacaoFHC_internetedemocracia.png': { id: 'colecao-coracoes-e-mentes---vol-1-pensando-de-forma-autonoma', titulo: 'Pensando de forma autônoma (Vol. 1)' },
  'FundacaoFHC_Linhas do tempo.png': { id: 'linhas-do-tempo', titulo: 'Linhas do Tempo' },
  'FundacaoFHC_minidocumentarios.png': { id: 'vale-a-pena-perguntar', titulo: 'Vale a Pena Perguntar (mini-docs)' },
  'FundacaoFHC_mulheresemfoco.png': { id: 'roteiros-pedagogicos---mulheres-em-foco-caminhos-para-a-equi', titulo: 'Mulheres em Foco' },
  'FundacaoFHC_nacionalismo.png': { id: 'colecao-coracoes-e-mentes---vol-3-nacionalismo-e-democracia', titulo: 'Nacionalismo e Democracia (Vol. 3)' },
  'FundacaoFHC_pessoascomdeficiencia.png': { id: 'roteiros-pedagogicos---pessoas-com-deficiencia-em-foco', titulo: 'Pessoas com Deficiência em Foco' },
  'FundacaoFHC_questoesraciaisemfoco.png': { id: 'roteiros-pedagogicos---questoes-raciais-em-foco', titulo: 'Questões Raciais em Foco' },
  'FundacaoFHC_susnaescola.png': { id: 'roteiros-pedagogicos---saude-para-todos-enfrentando-desafios', titulo: 'SUS na Escola' },
  'FundacaoFHC_transparenciaecontrole.png': { id: 'roteiros-pedagogicos---transparencia-e-controle-social', titulo: 'Transparência e Controle Social' },
  'kitdeatividadesdemocraciaebemdetodosnos.png': { id: 'kit-de-atividades-democracia-e-bem-de-todos-nos', titulo: 'Democracia é bem de todos nós' },
  'Mobis_Cidadaniademocraciaparticipacao.png': { id: 'cidadania-democracia-e-participacao-praticas-pedagogicas-par', titulo: 'Cidadania, Democracia e Participação' },
  'palavraabertaebiblitecaeducamidia.png': { id: 'biblioteca-educamidia-educacao-midiatica-e-temas-transversai', titulo: 'Biblioteca EducaMídia' },
  'palavraabertakitdecartassociedade2.0.png': { id: 'kit-de-cartas-sociedade-conectada', titulo: 'Kit Sociedade Conectada 2.0' },
  'palavraabertaminhavoznasredes.png': { id: 'planos-de-aula-minha-voz-nas-redes-a-forca-das-hashtags-e-au', titulo: 'Minha Voz nas Redes' },
  'porvirfuturoancestralnaescola.png': { id: 'futuro-ancestral-na-escola', titulo: 'Futuro Ancestral na Escola' },
  'serenascartilhaparaprofissionais.png': { id: 'cartilha-violencia-contra-mulher-nao-e-normal', titulo: 'Violência Contra Mulher Não é Normal' },
  'serenastrilhasformativas.png': { id: 'trilhas-formativas-online-sobre-prevencao-e-enfrentamento-de', titulo: 'Trilhas Formativas' },
  'serenasviolenciaalagoas.png': { id: 'guia-para-prevencao-as-violencias-contra-meninas-na-educacao', titulo: 'Guia Prevenção Alagoas' },
  'vivenbaralhoeoutrashistorias.png': { id: 'baralho-outras-historias-novas-identidades', titulo: 'Baralho Outras Histórias' },
  'vivencidademejogo.png': { id: 'cidade-em-jogo', titulo: 'Cidade em Jogo' },
  'vivensankofaananse.png': { id: 'sankofa-ananse-guia-de-letramento-racial-para-educadores', titulo: 'Sankofa Ananse' },
  'fundacaofhc_infograficoshistoriadedemocracia.png': { id: 'infograficos', titulo: 'Infográficos Histórias de Democracia' },
  'institutogilbertodimensteinjuventudes.png': { id: 'chega-junto-juventudes', titulo: 'Chega Junto Juventudes (podcast)' },
  'metodologiagentilezagenorisdade.png': { id: 'metodologia-7pegg', titulo: 'Metodologia 7PEGG' },
  'movimentofuturoplanodeaula.png': { id: 'sequencia-de-planos-de-aula', titulo: 'Três Planos de Aula' },
}

function nomeFinal(arquivoOriginal) {
  return RENAMES[arquivoOriginal] ?? arquivoOriginal
}

async function ensureDirs() {
  for (const d of [ORIGINAIS_DIR, THUMB_DIR, FULL_DIR, JPG_DIR]) {
    await fs.mkdir(d, { recursive: true })
  }
}

async function processarUm(arquivoOriginal) {
  const final = nomeFinal(arquivoOriginal)
  const baseFinal = final.replace(/\.png$/i, '')
  const inputPath = path.join(CAPAS_DIR, arquivoOriginal)
  const backupPath = path.join(ORIGINAIS_DIR, arquivoOriginal)
  const thumbPath = path.join(THUMB_DIR, `${baseFinal}.webp`)
  const fullPath = path.join(FULL_DIR, `${baseFinal}.webp`)
  const jpgPath = path.join(JPG_DIR, `${baseFinal}.jpg`)

  const inputStat = await fs.stat(inputPath)
  const buffer = await fs.readFile(inputPath)

  // Backup
  await fs.copyFile(inputPath, backupPath)

  // Thumb WebP 600px q82
  await sharp(buffer)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(thumbPath)

  // Full WebP 1400px q82
  await sharp(buffer)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(fullPath)

  // JPG fallback q80 (no specific width — keep 1400px max for parity)
  await sharp(buffer)
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true })
    .toFile(jpgPath)

  const thumbStat = await fs.stat(thumbPath)
  const fullStat = await fs.stat(fullPath)
  const jpgStat = await fs.stat(jpgPath)

  return {
    arquivoOriginal,
    nomeFinal: final,
    pngOriginalBytes: inputStat.size,
    thumbBytes: thumbStat.size,
    fullBytes: fullStat.size,
    jpgBytes: jpgStat.size,
    economia: 1 - thumbStat.size / inputStat.size,
  }
}

async function main() {
  await ensureDirs()

  const entradas = await fs.readdir(CAPAS_DIR)
  const pngs = entradas.filter((f) => f.toLowerCase().endsWith('.png'))
  console.log(`${pngs.length} PNGs encontrados.\n`)

  const resultados = []
  for (const arquivo of pngs) {
    if (!MAPEAMENTO[arquivo]) {
      console.warn(`  [SKIP] ${arquivo} (sem mapeamento)`)
      continue
    }
    process.stdout.write(`  ${arquivo} ... `)
    const r = await processarUm(arquivo)
    console.log(`OK (${(r.pngOriginalBytes / 1024).toFixed(0)}KB → ${(r.thumbBytes / 1024).toFixed(0)}KB thumb, ${(r.fullBytes / 1024).toFixed(0)}KB full)`)
    resultados.push(r)
  }

  // Gera config/capas.ts com mapping ID -> nomeFinal (sem extensão)
  const configCapas = `// Auto-gerado por scripts/otimizar-capas.mjs — NÃO EDITAR MANUALMENTE.
// Mapeia ID do material → nome base do arquivo de capa (sem extensão).
// Arquivos vivem em public/logos/capas/optimized/{thumb,full,jpg}/<nome>.{webp,jpg}.

export const CAPAS_LOCAIS: Record<string, string> = {
${resultados
  .map((r) => {
    const base = r.nomeFinal.replace(/\.png$/i, '')
    return `  '${MAPEAMENTO[r.arquivoOriginal].id}': '${base}',`
  })
  .join('\n')}
}
`
  await fs.writeFile(path.join(ROOT, 'config', 'capas.ts'), configCapas)
  console.log(`\nconfig/capas.ts gerado com ${resultados.length} entradas.`)

  // Gera relatório
  const titulosPorArquivo = Object.fromEntries(
    Object.entries(MAPEAMENTO).map(([k, v]) => [k, v.titulo]),
  )
  const linhasTabela = resultados.map((r) => {
    const titulo = titulosPorArquivo[r.arquivoOriginal] ?? '—'
    const status =
      r.thumbBytes < 200 * 1024 && r.fullBytes < 500 * 1024 ? '✅' : '⚠️'
    return `| ${titulo} | ${(r.pngOriginalBytes / 1024).toFixed(0)} KB | ${(r.thumbBytes / 1024).toFixed(0)} KB | ${(r.fullBytes / 1024).toFixed(0)} KB | ${(r.economia * 100).toFixed(1)}% | ${status} |`
  })
  const totalOriginal = resultados.reduce((s, r) => s + r.pngOriginalBytes, 0)
  const totalThumb = resultados.reduce((s, r) => s + r.thumbBytes, 0)
  const totalFull = resultados.reduce((s, r) => s + r.fullBytes, 0)
  const economiaMedia = resultados.reduce((s, r) => s + r.economia, 0) / resultados.length

  const relatorio = `# Relatório de otimização de capas

Gerado por \`scripts/otimizar-capas.mjs\` em ${new Date().toISOString()}.

## Resumo

- **${resultados.length} PNGs processados**
- Tamanho original total: **${(totalOriginal / 1024 / 1024).toFixed(2)} MB**
- Tamanho thumb (WebP 600px q82): **${(totalThumb / 1024 / 1024).toFixed(2)} MB**
- Tamanho full (WebP 1400px q82): **${(totalFull / 1024 / 1024).toFixed(2)} MB**
- **Economia média (thumb vs PNG): ${(economiaMedia * 100).toFixed(1)}%**

## Critérios de status

- ✅ thumb < 200 KB **e** full < 500 KB
- ⚠️ acima desses limiares (mas ainda otimizado)

## Tabela

| Material | PNG original | WebP thumb (600px) | WebP full (1400px) | Economia (thumb) | Status |
|---|---:|---:|---:|---:|:---:|
${linhasTabela.join('\n')}

## Arquivos JPG fallback

Gerados em \`public/logos/capas/optimized/jpg/\` com qualidade 80, progressivo,
máx 1400px. Não tabulados acima — uso é apenas como \`<picture>\` fallback caso
necessário.

## Backup

PNGs originais preservados em \`public/logos/capas/_originais/\`. **Não foram deletados.**
`
  await fs.writeFile(path.join(ROOT, 'relatorio-capas.md'), relatorio)
  console.log(`relatorio-capas.md gerado.`)

  console.log(`\nResumo:`)
  console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  Thumb:    ${(totalThumb / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  Full:     ${(totalFull / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  Economia média (thumb): ${(economiaMedia * 100).toFixed(1)}%`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
