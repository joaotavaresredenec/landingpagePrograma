import { BrevoClient } from '@getbrevo/brevo'

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })

export type LeadData = {
  nome: string
  email: string
  perfil: string
  uf: string
  municipio: string
  etapaEnsino: string
  consentimentoLgpd: boolean
  consentimentoTimestamp: string
  consentimentoIp: string
  consentimentoUserAgent: string
  consentimentoVersaoTermo: string
}

export async function criarOuAtualizarContato(lead: LeadData): Promise<void> {
  await brevo.contacts.createContact({
    email: lead.email,
    attributes: {
      NOME: lead.nome,
      PERFIL: lead.perfil,
      UF: lead.uf,
      MUNICIPIO: lead.municipio,
      ETAPA_ENSINO: lead.etapaEnsino,
      LGPD_CONSENTIMENTO: lead.consentimentoLgpd,
      LGPD_TIMESTAMP: lead.consentimentoTimestamp,
      LGPD_IP: lead.consentimentoIp,
      LGPD_USER_AGENT: lead.consentimentoUserAgent,
      LGPD_VERSAO_TERMO: lead.consentimentoVersaoTermo,
      FONTE: 'landing_programa_cidadania',
    },
    listIds: [Number(process.env.BREVO_CONTACT_LIST_ID)],
    updateEnabled: true,
  })
}

export async function enviarEmailMagicLink(params: {
  email: string
  nome: string
  magicLinkUrl: string
}): Promise<void> {
  await brevo.transactionalEmails.sendTransacEmail({
    templateId: Number(process.env.BREVO_MAGIC_LINK_TEMPLATE_ID),
    to: [{ email: params.email, name: params.nome }],
    params: {
      NOME: params.nome.split(' ')[0],
      MAGIC_LINK_URL: params.magicLinkUrl,
    },
  })
}
