import { NextRequest, NextResponse } from 'next/server'
import { criarOuAtualizarContato, enviarEmailMagicLink } from '@/lib/brevo'
import { generateToken, storeToken } from '@/lib/magic-link'

const VERSAO_TERMO_LGPD = '1.0'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { nome, email, perfil, uf, municipio, etapaEnsino, consentimentoLgpd } = body

    // Validações
    if (!nome || typeof nome !== 'string' || !nome.trim()) {
      return NextResponse.json({ erro: 'Nome é obrigatório.' }, { status: 400 })
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ erro: 'E-mail inválido.' }, { status: 400 })
    }

    if (!perfil || typeof perfil !== 'string' || !perfil.trim()) {
      return NextResponse.json({ erro: 'Perfil é obrigatório.' }, { status: 400 })
    }

    if (!uf || typeof uf !== 'string' || !uf.trim()) {
      return NextResponse.json({ erro: 'UF é obrigatória.' }, { status: 400 })
    }

    if (!municipio || typeof municipio !== 'string' || !municipio.trim()) {
      return NextResponse.json({ erro: 'Município é obrigatório.' }, { status: 400 })
    }

    if (!etapaEnsino || typeof etapaEnsino !== 'string' || !etapaEnsino.trim()) {
      return NextResponse.json({ erro: 'Etapa de ensino é obrigatória.' }, { status: 400 })
    }

    if (consentimentoLgpd !== true) {
      return NextResponse.json({ erro: 'Consentimento LGPD é obrigatório.' }, { status: 400 })
    }

    // Capturar dados de rastreabilidade LGPD
    const rawIp = req.headers.get('x-forwarded-for') ?? ''
    const ip = rawIp.split(',')[0].trim() || 'desconhecido'
    const userAgent = req.headers.get('user-agent') ?? 'desconhecido'
    const timestamp = new Date().toISOString()

    // 1. Criar/atualizar contato no Brevo
    await criarOuAtualizarContato({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      perfil: perfil.trim(),
      uf: uf.trim(),
      municipio: municipio.trim(),
      etapaEnsino: etapaEnsino.trim(),
      consentimentoLgpd: true,
      consentimentoTimestamp: timestamp,
      consentimentoIp: ip,
      consentimentoUserAgent: userAgent,
      consentimentoVersaoTermo: VERSAO_TERMO_LGPD,
    })

    // 2. Gerar e armazenar magic link token
    const token = generateToken()
    await storeToken(token, {
      email: email.trim().toLowerCase(),
      nome: nome.trim(),
      perfil: perfil.trim(),
      createdAt: timestamp,
    })

    // 3. Montar URL e enviar e-mail
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/materiais?token=${token}`
    await enviarEmailMagicLink({
      email: email.trim().toLowerCase(),
      nome: nome.trim(),
      magicLinkUrl,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/lead] Erro ao processar cadastro:', err)
    return NextResponse.json({ erro: 'Erro ao processar cadastro' }, { status: 500 })
  }
}
