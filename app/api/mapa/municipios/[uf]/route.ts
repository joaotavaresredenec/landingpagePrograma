import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { temSessaoMapa } from '@/lib/sessao-mapa'

// Mapeamento UF (sigla) -> código IBGE do estado, usado para localizar
// o arquivo `geojs-{codigoIbge}-mun.json` em public/geodata/municipios-uf/.
const UF_PARA_CODIGO_IBGE: Record<string, string> = {
  AC: '12', AL: '27', AM: '13', AP: '16',
  BA: '29', CE: '23', DF: '53',
  ES: '32', GO: '52', MA: '21',
  MT: '51', MS: '50', MG: '31',
  PA: '15', PB: '25', PR: '41', PE: '26',
  PI: '22', RJ: '33', RN: '24',
  RS: '43', RO: '11', RR: '14',
  SC: '42', SP: '35', SE: '28',
  TO: '17',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uf: string }> | { uf: string } },
) {
  // Só usuários autenticados no mapa podem consumir
  const autenticado = await temSessaoMapa()
  if (!autenticado) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
  }

  const { uf } = 'then' in params ? await params : params
  const sigla = uf.toUpperCase()
  const codigoIbge = UF_PARA_CODIGO_IBGE[sigla]
  if (!codigoIbge) {
    return NextResponse.json({ erro: 'UF inválida' }, { status: 400 })
  }

  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'geodata',
      'municipios-uf',
      `geojs-${codigoIbge}-mun.json`,
    )
    const content = await readFile(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error(`[/api/mapa/municipios/${sigla}] Arquivo não encontrado:`, err)
    return NextResponse.json({ erro: 'Arquivo não encontrado' }, { status: 404 })
  }
}
