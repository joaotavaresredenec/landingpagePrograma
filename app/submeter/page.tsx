import type { Metadata } from 'next'
import { getSupabase } from '@/lib/supabase'
import { TIPOS_RECURSO, ETAPAS_ENSINO } from '@/config/taxonomia'
import { LICENCAS, type Licenca } from '@/config/licencas'
import { FAIXAS_ETARIAS, type FaixaEtaria } from '@/config/faixa-etaria'
import type { TipoRecurso, EtapaEnsino } from '@/types/material'
import { SubmissaoForm, type SubmissaoState } from './SubmissaoForm'
import {
  enviarConfirmacaoSubmissao,
  enviarAlertaCurador,
} from '@/lib/curadoria/emails'

export const metadata: Metadata = {
  title: 'Contribuir com um material | Redenec',
  description:
    'Envie um material educativo para a curadoria da Rede Nacional de Educação Cidadã.',
  robots: { index: false, follow: false },
}

const TIPO_KEYS    = Object.keys(TIPOS_RECURSO)    as TipoRecurso[]
const ETAPA_KEYS   = Object.keys(ETAPAS_ENSINO)    as EtapaEnsino[]
const LICENCA_KEYS = Object.keys(LICENCAS)         as Licenca[]
const FAIXA_KEYS   = Object.keys(FAIXAS_ETARIAS)   as FaixaEtaria[]

const RELACOES_VALIDAS = [
  'autor-ou-autorizado',
  'encontrado-publicamente',
] as const
type Relacao = (typeof RELACOES_VALIDAS)[number]

const ALINHAMENTOS_VALIDOS = ['sim', 'parcialmente', 'nao'] as const
type Alinhamento = (typeof ALINHAMENTOS_VALIDOS)[number]

const DESC_MIN = 100
const DESC_MAX = 500
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const URL_HTTPS_RE = /^https:\/\//

async function submeterMaterial(
  _prev: SubmissaoState,
  formData: FormData,
): Promise<SubmissaoState> {
  'use server'

  const str = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' ? v.trim() : ''
  }
  const strAll = (k: string) =>
    formData.getAll(k).filter((v): v is string => typeof v === 'string')

  const nome = str('nome')
  const email = str('email').toLowerCase()
  const organizacao = str('organizacao')
  const titulo = str('titulo')
  const descricao = str('descricao')
  const tipo = str('tipo') as TipoRecurso
  const publicoAlvo = strAll('publicoAlvo') as EtapaEnsino[]
  const alinhamentoBncc = str('alinhamentoBncc') as Alinhamento
  const faixaEtaria = str('faixaEtaria') as FaixaEtaria
  const relacao = str('relacaoMaterial') as Relacao
  const licenca = str('licenca') as Licenca
  const materialArquivoUrl = str('materialArquivoUrl')
  const lgpd = formData.get('lgpd') === 'on'
  const direitosAutorais = formData.get('direitosAutorais') === 'on'
  const naoComercial = formData.get('naoComercial') === 'on'
  const autorizaAdaptacao = formData.get('autorizaAdaptacao') === 'on'
  const optinRelatorio = formData.get('optinRelatorio') === 'on'

  if (relacao === 'encontrado-publicamente') {
    return {
      status: 'error',
      mensagem:
        'Para submeter, é necessário ser autor(a) ou ter autorização para compartilhar o material.',
      erros: {
        relacaoMaterial:
          'Materiais encontrados publicamente, sem autorização documentada, não podem ser submetidos.',
      },
    }
  }

  const erros: Record<string, string> = {}
  if (!nome) erros.nome = 'Informe seu nome completo.'
  if (!email) erros.email = 'Informe seu e-mail.'
  else if (!EMAIL_RE.test(email)) erros.email = 'E-mail inválido.'
  if (!organizacao) erros.organizacao = 'Informe a organização ou instituição.'
  if (!titulo) erros.titulo = 'Informe o título do material.'
  if (descricao.length < DESC_MIN || descricao.length > DESC_MAX)
    erros.descricao = `A descrição precisa ter entre ${DESC_MIN} e ${DESC_MAX} caracteres.`
  if (!TIPO_KEYS.includes(tipo)) erros.tipo = 'Selecione um tipo de material.'
  if (publicoAlvo.length === 0)
    erros.publicoAlvo = 'Selecione ao menos um público-alvo.'
  else if (!publicoAlvo.every((p) => ETAPA_KEYS.includes(p)))
    erros.publicoAlvo = 'Público-alvo inválido.'
  if (!ALINHAMENTOS_VALIDOS.includes(alinhamentoBncc))
    erros.alinhamentoBncc = 'Indique o alinhamento com a BNCC.'
  if (!FAIXA_KEYS.includes(faixaEtaria))
    erros.faixaEtaria = 'Selecione uma faixa etária.'
  if (relacao !== 'autor-ou-autorizado')
    erros.relacaoMaterial = 'Indique sua relação com o material.'
  if (relacao === 'autor-ou-autorizado' && !LICENCA_KEYS.includes(licenca))
    erros.licenca = 'Selecione uma licença de uso.'

  if (!materialArquivoUrl) {
    erros.material = 'Anexe o arquivo do material.'
  } else if (!URL_HTTPS_RE.test(materialArquivoUrl)) {
    erros.material = 'URL do arquivo inválida.'
  }

  if (!lgpd) erros.lgpd = 'É necessário aceitar a política de privacidade.'
  if (!direitosAutorais)
    erros.direitosAutorais = 'Você deve declarar a titularidade dos direitos.'
  if (!naoComercial)
    erros.naoComercial =
      'Você deve confirmar a ausência de conteúdo comercial e político-partidário.'
  if (!autorizaAdaptacao)
    erros.autorizaAdaptacao =
      'Você deve autorizar a adaptação e redistribuição.'

  if (Object.keys(erros).length > 0) {
    return {
      status: 'error',
      mensagem: 'Revise os campos destacados antes de enviar.',
      erros,
    }
  }

  const envCheck = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  }

  try {
    const supabase = getSupabase()
    const { data: inserida, error } = await supabase
      .from('submissoes')
      .insert({
        organizacao_autora: organizacao,
        ponto_focal_nome: nome,
        ponto_focal_email: email,
        titulo,
        descricao,
        tipo_recurso: tipo,
        etapas_ensino: publicoAlvo,
        temas_bncc: [],
        licenca,
        faixa_etaria: faixaEtaria,
        alinhamento_bncc: alinhamentoBncc,
        material_arquivo_url: materialArquivoUrl,
        status: 'pendente',
      })
      .select('id')
      .single<{ id: string }>()

    if (error || !inserida) {
      console.error('[submeter] supabase insert error', {
        envCheck,
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      return {
        status: 'error',
        mensagem:
          'Não foi possível enviar agora. Tente novamente em alguns minutos.',
      }
    }

    try {
      await enviarConfirmacaoSubmissao({
        titulo,
        organizacao_autora: organizacao,
        ponto_focal_nome: nome,
        ponto_focal_email: email,
      })
    } catch (e) {
      console.error('[submeter] envio de e-mail de confirmação falhou:', e)
    }

    try {
      await enviarAlertaCurador({
        id: inserida.id,
        titulo,
        organizacao_autora: organizacao,
        ponto_focal_nome: nome,
        ponto_focal_email: email,
        tipo_recurso: tipo,
      })
    } catch (e) {
      console.error('[submeter] envio de alerta ao curador falhou:', e)
    }

    return { status: 'success', optinRelatorio }
  } catch (e) {
    const err = e as Error
    console.error('[submeter] unexpected error', {
      envCheck,
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    })
    return {
      status: 'error',
      mensagem: 'Erro inesperado. Tente novamente em alguns minutos.',
    }
  }
}

export default function SubmeterPage() {
  return <SubmissaoForm action={submeterMaterial} />
}
