import { NextRequest, NextResponse } from 'next/server'
import { criarSessaoMapa } from '@/lib/sessao-mapa'
import { kv } from '@/lib/kv'

const MAX_TENTATIVAS = 5
const JANELA_SEGUNDOS = 300

export async function POST(req: NextRequest) {
  try {
    const { senha } = await req.json()

    if (!senha || typeof senha !== 'string') {
      return NextResponse.json({ erro: 'Senha inválida' }, { status: 400 })
    }

    // Rate limiting por IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const chaveRedis = `mapa:tentativas:${ip}`

    const tentativas = await kv.incr(chaveRedis)
    if (tentativas === 1) {
      await kv.expire(chaveRedis, JANELA_SEGUNDOS)
    }

    if (tentativas > MAX_TENTATIVAS) {
      return NextResponse.json(
        { erro: 'Muitas tentativas. Aguarde 5 minutos e tente novamente.' },
        { status: 429 }
      )
    }

    const senhaCorreta = process.env.MAPA_SENHA
    if (!senhaCorreta) {
      console.error('MAPA_SENHA não configurada')
      return NextResponse.json({ erro: 'Erro de configuração' }, { status: 500 })
    }

    // Comparação constant-time para evitar timing attacks
    let ehCorreta = senha.length === senhaCorreta.length
    const maxLen = Math.max(senha.length, senhaCorreta.length, 100)
    for (let i = 0; i < maxLen; i++) {
      const a = senha.charCodeAt(i) || 0
      const b = senhaCorreta.charCodeAt(i) || 0
      if (a !== b) ehCorreta = false
    }

    if (!ehCorreta) {
      return NextResponse.json(
        { erro: 'Senha incorreta. Dica: a senha começa com "pecs".' },
        { status: 401 }
      )
    }

    // Senha correta: criar sessão e zerar contador
    await criarSessaoMapa()
    await kv.del(chaveRedis)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Erro em /api/mapa/validar:', err)
    return NextResponse.json({ erro: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
