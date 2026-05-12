import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

async function loadPoppinsTTF(weightName) {
  const url = `https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-${weightName}.ttf`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao baixar Poppins-${weightName} (${res.status})`)
  return res.arrayBuffer()
}

function h(type, props = {}, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } }
}

async function main() {
  const [poppinsRegular, poppinsBold] = await Promise.all([
    loadPoppinsTTF('Regular'),
    loadPoppinsTTF('Bold'),
  ])

  const logoBuffer = await fs.readFile(path.join(ROOT, 'app', 'redenec-logo.png'))
  const logoWidth = logoBuffer.readUInt32BE(16)
  const logoHeight = logoBuffer.readUInt32BE(20)
  const renderedLogoHeight = 80
  const renderedLogoWidth = Math.round((logoWidth * renderedLogoHeight) / logoHeight)
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`

  const tree = h(
    'div',
    {
      style: {
        background: '#e5e4e9',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'Poppins',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    h('div', {
      style: {
        position: 'absolute',
        right: '80px',
        top: '60px',
        width: '220px',
        height: '220px',
        background: '#1cff9e',
        opacity: 0.55,
        borderRadius: '50%',
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        right: '200px',
        top: '240px',
        width: '130px',
        height: '130px',
        background: '#1cff9e',
        opacity: 0.7,
        borderRadius: '50%',
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        right: '60px',
        top: '380px',
        width: '90px',
        height: '90px',
        background: '#ff8b80',
        opacity: 0.55,
        borderRadius: '50%',
        display: 'flex',
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        left: '-40px',
        bottom: '-40px',
        width: '180px',
        height: '180px',
        background: '#0086ff',
        opacity: 0.18,
        borderRadius: '50%',
        display: 'flex',
      },
    }),
    h(
      'div',
      { style: { display: 'flex', marginBottom: '32px' } },
      h('img', {
        src: logoSrc,
        width: renderedLogoWidth,
        height: renderedLogoHeight,
        style: { width: `${renderedLogoWidth}px`, height: `${renderedLogoHeight}px` },
      }),
    ),
    h(
      'div',
      { style: { display: 'flex', marginBottom: '28px' } },
      h(
        'div',
        {
          style: {
            background: '#1b415e',
            borderRadius: '24px',
            padding: '8px 20px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
          },
        },
        'Redenec × MEC · Portaria 642/2025',
      ),
    ),
    h(
      'div',
      {
        style: {
          fontSize: '52px',
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.1,
          maxWidth: '820px',
          marginBottom: '24px',
          display: 'flex',
        },
      },
      'Programa Educação para a Cidadania e Sustentabilidade',
    ),
    h(
      'div',
      {
        style: {
          fontSize: '22px',
          color: '#1b415e',
          maxWidth: '720px',
          lineHeight: 1.5,
          marginBottom: '40px',
          display: 'flex',
        },
      },
      'Materiais e orientações práticas para secretarias e escolas que aderiram ao PECS',
    ),
    h(
      'div',
      {
        style: {
          fontSize: '17px',
          color: '#1b415e',
          fontWeight: 700,
          letterSpacing: '0.02em',
          display: 'flex',
        },
      },
      'cidadaniaesustentabilidade.com.br',
    ),
  )

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Poppins', data: poppinsRegular, weight: 400, style: 'normal' },
      { name: 'Poppins', data: poppinsBold, weight: 700, style: 'normal' },
    ],
  })

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const png = resvg.render().asPng()

  const outDir = path.join(ROOT, 'public')
  await fs.mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, 'og-image.png')
  await fs.writeFile(outPath, png)

  console.log(`OG image gerada em ${outPath} (${png.length} bytes, 1200x630)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
