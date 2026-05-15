import { brevo } from '@/lib/brevo'

const REMETENTE = {
  email: 'contato@redenec.org',
  name: 'Redenec — Biblioteca de Educação Cidadã',
}

export type SubmissaoEmail = {
  titulo: string
  organizacao_autora: string
  ponto_focal_nome: string
  ponto_focal_email: string
}

function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] || nome
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Conteudo = {
  assunto: string
  saudacao: string
  corpoHtml: string
  corpoTexto: string
  feedback?: string
}

function renderHtml(c: Conteudo, s: SubmissaoEmail): string {
  const blocoFeedback = c.feedback
    ? `<div style="margin:20px 0 8px 0;background:#e5e4e9;border-left:4px solid #1b415e;border-radius:8px;padding:16px;">
         <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.08em;">Mensagem da curadoria</p>
         <p style="margin:0;color:#243837;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(c.feedback)}</p>
       </div>`
    : ''

  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f6f7;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#243837;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.1em;">Redenec — Biblioteca de Educação Cidadã</p>
          <h1 style="margin:0 0 20px 0;font-size:22px;line-height:1.3;color:#1b415e;font-weight:700;">${escapeHtml(c.assunto)}</h1>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">${escapeHtml(c.saudacao)}</p>
          ${c.corpoHtml}
          <div style="margin:24px 0 0 0;background:#f6f6f7;border-radius:8px;padding:16px;">
            <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.08em;">Material</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#1b415e;line-height:1.4;">${escapeHtml(s.titulo)}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#243837;">${escapeHtml(s.organizacao_autora)}</p>
          </div>
          ${blocoFeedback}
          <p style="margin:28px 0 0 0;font-size:14px;line-height:1.5;color:#243837;">Com gratidão,<br><strong style="color:#1b415e;">Curadoria Redenec</strong></p>
          <hr style="border:none;border-top:1px solid #e5e4e9;margin:24px 0 16px 0;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#1b415e;opacity:0.7;">Programa Educação para a Cidadania e Sustentabilidade (PECS) — Portaria MEC nº 642/2025.<br>Dúvidas? Responda este e-mail ou escreva para <a href="mailto:contato@redenec.org" style="color:#1b415e;">contato@redenec.org</a>.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function renderTexto(c: Conteudo, s: SubmissaoEmail): string {
  const linhas = [
    c.saudacao,
    '',
    c.corpoTexto,
    '',
    `Material: ${s.titulo}`,
    `Organização: ${s.organizacao_autora}`,
  ]
  if (c.feedback) {
    linhas.push('', '— Mensagem da curadoria —', c.feedback)
  }
  linhas.push(
    '',
    'Com gratidão,',
    'Curadoria Redenec',
    '',
    'Programa Educação para a Cidadania e Sustentabilidade (PECS) — Portaria MEC nº 642/2025.',
    'Dúvidas? contato@redenec.org',
  )
  return linhas.join('\n')
}

async function enviar(submissao: SubmissaoEmail, c: Conteudo): Promise<void> {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: REMETENTE,
    to: [{ email: submissao.ponto_focal_email, name: submissao.ponto_focal_nome }],
    subject: c.assunto,
    htmlContent: renderHtml(c, submissao),
    textContent: renderTexto(c, submissao),
  })
}

export async function enviarConfirmacaoSubmissao(
  submissao: SubmissaoEmail,
): Promise<void> {
  await enviar(submissao, {
    assunto: 'Recebemos sua submissão para a Biblioteca da Rede Nacional de Educação Cidadã',
    saudacao: `Olá, ${primeiroNome(submissao.ponto_focal_nome)}!`,
    corpoHtml: `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">Obrigado por contribuir com a Biblioteca da Rede Nacional de Educação Cidadã! Recebemos seu material e ele entrou para análise da curadoria.</p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">Avaliamos cada submissão com base nos critérios de adequação da Rede Nacional de Educação Cidadã. Retornaremos por este e-mail com a decisão em até <strong>10 dias úteis</strong>.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#243837;">Se quiser nos contar mais alguma coisa sobre o recurso, é só responder este e-mail.</p>
    `,
    corpoTexto:
      'Obrigado por contribuir com a Biblioteca da Rede Nacional de Educação Cidadã! Recebemos seu material e ele entrou para análise da curadoria.\n\nAvaliamos cada submissão com base nos critérios de adequação da Rede Nacional de Educação Cidadã. Retornaremos por este e-mail com a decisão em até 10 dias úteis.\n\nSe quiser nos contar mais alguma coisa sobre o recurso, é só responder este e-mail.',
  })
}

export async function enviarAprovacao(
  submissao: SubmissaoEmail,
  feedback?: string,
): Promise<void> {
  const limpo = feedback?.trim()
  await enviar(submissao, {
    assunto: 'Seu material foi aprovado para a Biblioteca da Rede Nacional de Educação Cidadã',
    saudacao: `Olá, ${primeiroNome(submissao.ponto_focal_nome)}!`,
    corpoHtml: `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">Temos uma boa notícia: seu material foi <strong>aprovado</strong> pela curadoria e fará parte da Biblioteca da Rede Nacional de Educação Cidadã.</p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">Em breve entraremos em contato para alinhar os detalhes da publicação — créditos da organização, descrição final e a forma como o recurso será apresentado.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#243837;">Muito obrigado por somar com a Redenec no Programa Educação para a Cidadania e Sustentabilidade.</p>
    `,
    corpoTexto:
      'Temos uma boa notícia: seu material foi APROVADO pela curadoria e fará parte da Biblioteca da Rede Nacional de Educação Cidadã.\n\nEm breve entraremos em contato para alinhar os detalhes da publicação — créditos da organização, descrição final e a forma como o recurso será apresentado.\n\nMuito obrigado por somar com a Redenec no Programa Educação para a Cidadania e Sustentabilidade.',
    feedback: limpo || undefined,
  })
}

export async function enviarPedidoAjuste(
  submissao: SubmissaoEmail,
  feedback: string,
): Promise<void> {
  await enviar(submissao, {
    assunto: 'Sua submissão precisa de alguns ajustes',
    saudacao: `Olá, ${primeiroNome(submissao.ponto_focal_nome)}!`,
    corpoHtml: `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">Sua submissão foi analisada com cuidado pela curadoria da Redenec. Para que o material possa integrar a biblioteca, precisamos que alguns pontos sejam revisados — eles estão descritos abaixo.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#243837;">Assim que estiver pronto, é só responder este e-mail com a versão atualizada. Seguiremos com a curadoria a partir daí.</p>
    `,
    corpoTexto:
      'Sua submissão foi analisada com cuidado pela curadoria da Redenec. Para que o material possa integrar a biblioteca, precisamos que alguns pontos sejam revisados — eles estão descritos abaixo.\n\nAssim que estiver pronto, é só responder este e-mail com a versão atualizada. Seguiremos com a curadoria a partir daí.',
    feedback: feedback.trim(),
  })
}

export async function enviarRejeicao(
  submissao: SubmissaoEmail,
  feedback: string,
): Promise<void> {
  await enviar(submissao, {
    assunto: 'Retorno da curadoria sobre sua submissão',
    saudacao: `Olá, ${primeiroNome(submissao.ponto_focal_nome)}!`,
    corpoHtml: `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#243837;">Agradecemos profundamente pela sua submissão à Biblioteca da Rede Nacional de Educação Cidadã. Após análise da curadoria, decidimos não incluir este material no acervo neste momento — os motivos estão descritos abaixo.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#243837;">Esta decisão é específica para este material; ela não impede futuras contribuições. Se quiser conversar sobre os pontos levantados ou propor outro recurso, ficamos à disposição.</p>
    `,
    corpoTexto:
      'Agradecemos profundamente pela sua submissão à Biblioteca da Rede Nacional de Educação Cidadã. Após análise da curadoria, decidimos não incluir este material no acervo neste momento — os motivos estão descritos abaixo.\n\nEsta decisão é específica para este material; ela não impede futuras contribuições. Se quiser conversar sobre os pontos levantados ou propor outro recurso, ficamos à disposição.',
    feedback: feedback.trim(),
  })
}

// ── Alerta interno ao curador ────────────────────────────────

import { TIPOS_RECURSO } from '@/config/taxonomia'

const CURADOR_EMAIL = 'joao@redenec.org'
const ADMIN_BASE_URL = 'https://www.cidadaniaesustentabilidade.com.br'

export type AlertaCuradorSubmissao = {
  id: string
  titulo: string
  organizacao_autora: string
  ponto_focal_nome: string
  ponto_focal_email: string
  tipo_recurso: string
}

function labelTipoRecurso(slug: string): string {
  const mapa = TIPOS_RECURSO as Record<string, { label: string } | undefined>
  return mapa[slug]?.label ?? slug
}

function renderAlertaCuradorHtml(
  s: AlertaCuradorSubmissao,
  urlAdmin: string,
): string {
  const tipo = labelTipoRecurso(s.tipo_recurso)
  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f6f7;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#243837;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.1em;">Curadoria Redenec — Alerta</p>
          <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#1b415e;font-weight:700;">Nova submissão na fila</h1>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#243837;">Acaba de chegar um material para avaliação.</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f7;border-radius:8px;margin:0 0 24px 0;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.08em;">Título</p>
              <p style="margin:0;font-size:15px;color:#243837;line-height:1.4;font-weight:700;">${escapeHtml(s.titulo)}</p>

              <p style="margin:14px 0 4px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.08em;">Organização</p>
              <p style="margin:0;font-size:14px;color:#243837;">${escapeHtml(s.organizacao_autora)}</p>

              <p style="margin:14px 0 4px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.08em;">Tipo de recurso</p>
              <p style="margin:0;font-size:14px;color:#243837;">${escapeHtml(tipo)}</p>

              <p style="margin:14px 0 4px 0;font-size:11px;font-weight:700;color:#1b415e;text-transform:uppercase;letter-spacing:0.08em;">Ponto focal</p>
              <p style="margin:0;font-size:14px;color:#243837;line-height:1.5;">${escapeHtml(s.ponto_focal_nome)}<br><a href="mailto:${escapeHtml(s.ponto_focal_email)}" style="color:#1b415e;font-size:13px;">${escapeHtml(s.ponto_focal_email)}</a></p>
            </td></tr>
          </table>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td align="center" style="padding:8px 0 4px 0;">
              <a href="${urlAdmin}" style="display:inline-block;background:#1b415e;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:9999px;">Avaliar submissão →</a>
            </td></tr>
          </table>

          <p style="margin:20px 0 0 0;font-size:11px;line-height:1.5;color:#1b415e;opacity:0.6;text-align:center;">Ou cole no navegador:<br><a href="${urlAdmin}" style="color:#1b415e;word-break:break-all;">${urlAdmin}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function renderAlertaCuradorTexto(
  s: AlertaCuradorSubmissao,
  urlAdmin: string,
): string {
  return [
    'Nova submissão na fila — Curadoria Redenec',
    '',
    `Título: ${s.titulo}`,
    `Organização: ${s.organizacao_autora}`,
    `Tipo de recurso: ${labelTipoRecurso(s.tipo_recurso)}`,
    `Ponto focal: ${s.ponto_focal_nome} <${s.ponto_focal_email}>`,
    '',
    'Avaliar submissão:',
    urlAdmin,
  ].join('\n')
}

export async function enviarAlertaCurador(
  submissao: AlertaCuradorSubmissao,
): Promise<void> {
  const urlAdmin = `${ADMIN_BASE_URL}/admin/curadoria/${submissao.id}`
  await brevo.transactionalEmails.sendTransacEmail({
    sender: REMETENTE,
    to: [{ email: CURADOR_EMAIL, name: 'Curadoria Redenec' }],
    subject: `Nova submissão aguardando avaliação — ${submissao.titulo}`,
    htmlContent: renderAlertaCuradorHtml(submissao, urlAdmin),
    textContent: renderAlertaCuradorTexto(submissao, urlAdmin),
  })
}
