import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

async function loadFigtreeTTF(weightName) {
  const localPath = path.join(__dirname, 'fonts', `Figtree-${weightName}.ttf`)
  const buf = await fs.readFile(localPath)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

async function readPng(relPath) {
  const buf = await fs.readFile(path.join(ROOT, relPath))
  const width = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  return { src: `data:image/png;base64,${buf.toString('base64')}`, width, height }
}

function h(type, props = {}, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } }
}

function fitToHeight(asset, targetHeight) {
  const ratio = asset.width / asset.height
  return { width: Math.round(targetHeight * ratio), height: targetHeight }
}

function fitToWidth(asset, targetWidth) {
  const ratio = asset.height / asset.width
  return { width: targetWidth, height: Math.round(targetWidth * ratio) }
}

const COR = {
  navy: '#1B415E',
  azul: '#0086FF',
  verde: '#1CFF9E',
  coral: '#FF8B80',
  branco: '#FFFFFF',
  cinza: '#E5E4E9',
}

function decoracaoCirculos() {
  return [
    h('div', {
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${COR.navy} 0%, ${COR.navy} 45%, #11507E 75%, ${COR.azul} 100%)`,
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        top: '-180px',
        right: '-160px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: COR.verde,
        opacity: 0.32,
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        top: '120px',
        right: '180px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: COR.verde,
        opacity: 0.75,
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        bottom: '-120px',
        left: '40%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: COR.coral,
        opacity: 0.55,
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        top: '54%',
        right: '4%',
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        background: COR.coral,
        opacity: 0.85,
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        top: '32%',
        left: '-100px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: COR.azul,
        opacity: 0.45,
        display: 'flex',
      },
    }),
  ]
}

function faixaParceiros(parceiros, faixaHeight) {
  const logoMaxH = Math.round(faixaHeight * 0.46)
  return h(
    'div',
    {
      style: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: `${faixaHeight}px`,
        background: COR.branco,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 60px',
      },
    },
    ...parceiros.map((p) => {
      const dim = fitToHeight(p.asset, logoMaxH)
      return h('img', {
        src: p.asset.src,
        width: dim.width,
        height: dim.height,
        style: { width: `${dim.width}px`, height: `${dim.height}px` },
      })
    }),
  )
}

function templateLandscape({ width, height, logoRedenec, parceiros }) {
  const faixa = Math.round(height * 0.18)
  const conteudoBottom = faixa + 60
  const logoDim = fitToHeight(logoRedenec, Math.round(height * 0.13))

  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Figtree',
      },
    },
    ...decoracaoCirculos(),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: '64px',
          left: '72px',
          display: 'flex',
          alignItems: 'center',
        },
      },
      h('img', {
        src: logoRedenec.src,
        width: logoDim.width,
        height: logoDim.height,
        style: { width: `${logoDim.width}px`, height: `${logoDim.height}px` },
      }),
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: '72px',
          right: '72px',
          background: COR.verde,
          color: COR.navy,
          padding: '10px 22px',
          borderRadius: '999px',
          fontSize: '20px',
          fontWeight: 900,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          display: 'flex',
        },
      },
      'PECS · Portaria 642/2025',
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: '72px',
          right: '72px',
          bottom: `${conteudoBottom}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
      h(
        'div',
        {
          style: {
            fontSize: '76px',
            fontWeight: 900,
            color: COR.branco,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            maxWidth: '980px',
            display: 'flex',
          },
        },
        'Educação para a Cidadania e Sustentabilidade',
      ),
      h(
        'div',
        {
          style: {
            fontSize: '26px',
            fontWeight: 400,
            color: COR.branco,
            opacity: 0.92,
            lineHeight: 1.3,
            maxWidth: '880px',
            marginBottom: '28px',
            display: 'flex',
          },
        },
        'Biblioteca de materiais e orientações práticas para secretarias e escolas que aderiram ao PECS',
      ),
      h(
        'div',
        {
          style: {
            fontSize: '22px',
            fontWeight: 700,
            color: COR.verde,
            letterSpacing: '0.02em',
            display: 'flex',
          },
        },
        'cidadaniaesustentabilidade.com.br',
      ),
    ),
    faixaParceiros(parceiros, faixa),
  )
}

function templateSquare({ size, logoRedenec }) {
  const logoDim = fitToWidth(logoRedenec, Math.round(size * 0.78))
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Figtree',
        background: `linear-gradient(135deg, ${COR.navy} 0%, ${COR.azul} 100%)`,
      },
    },
    h('div', {
      style: {
        position: 'absolute',
        top: '-30%',
        right: '-30%',
        width: '120%',
        height: '120%',
        borderRadius: '50%',
        background: COR.verde,
        opacity: 0.22,
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        bottom: '-25%',
        left: '-25%',
        width: '90%',
        height: '90%',
        borderRadius: '50%',
        background: COR.coral,
        opacity: 0.2,
        display: 'flex',
      },
    }),
    h('img', {
      src: logoRedenec.src,
      width: logoDim.width,
      height: logoDim.height,
      style: { width: `${logoDim.width}px`, height: `${logoDim.height}px` },
    }),
  )
}

async function renderToPng(tree, width, height, fonts) {
  const svg = await satori(tree, { width, height, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng()
  return png
}

async function main() {
  console.log('Baixando fontes Figtree...')
  const [figtreeRegular, figtreeBold, figtreeBlack] = await Promise.all([
    loadFigtreeTTF('Regular'),
    loadFigtreeTTF('Bold'),
    loadFigtreeTTF('Black'),
  ])
  const fonts = [
    { name: 'Figtree', data: figtreeRegular, weight: 400, style: 'normal' },
    { name: 'Figtree', data: figtreeBold, weight: 700, style: 'normal' },
    { name: 'Figtree', data: figtreeBlack, weight: 900, style: 'normal' },
  ]

  console.log('Carregando logos...')
  const logoRedenec = await readPng('public/logos/redenecbranco.png')
  const parceiros = await Promise.all(
    [
      'public/logos/logoMECMAPA.png',
      'public/logos/undimelogo.png',
      'public/logos/cnjlogo.png',
      'public/logos/logocnmp.png',
      'public/logos/unescologo.png',
      'public/logos/programaeducacaoparaacidadanialogo.png',
    ].map(async (p) => ({ asset: await readPng(p) })),
  )

  const outDir = path.join(ROOT, 'public')
  await fs.mkdir(outDir, { recursive: true })

  const targets = [
    {
      name: 'og-image.png',
      width: 1200,
      height: 630,
      tree: templateLandscape({ width: 1200, height: 630, logoRedenec, parceiros }),
    },
    {
      name: 'twitter-card.png',
      width: 1200,
      height: 675,
      tree: templateLandscape({ width: 1200, height: 675, logoRedenec, parceiros }),
    },
    {
      name: 'icon-512.png',
      width: 512,
      height: 512,
      tree: templateSquare({ size: 512, logoRedenec }),
    },
    {
      name: 'apple-touch-icon.png',
      width: 180,
      height: 180,
      tree: templateSquare({ size: 180, logoRedenec }),
    },
    {
      name: 'favicon-32.png',
      width: 32,
      height: 32,
      tree: templateSquare({ size: 32, logoRedenec }),
    },
    {
      name: 'favicon-16.png',
      width: 16,
      height: 16,
      tree: templateSquare({ size: 16, logoRedenec }),
    },
  ]

  const resultados = []
  for (const t of targets) {
    console.log(`Gerando ${t.name} (${t.width}x${t.height})...`)
    const png = await renderToPng(t.tree, t.width, t.height, fonts)
    const outPath = path.join(outDir, t.name)
    await fs.writeFile(outPath, png)
    resultados.push({ name: t.name, bytes: png.length, kb: (png.length / 1024).toFixed(1) })
  }

  console.log('\nArquivos gerados em public/:')
  for (const r of resultados) {
    console.log(`  ${r.name.padEnd(24)} ${r.kb.padStart(7)} KB`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
