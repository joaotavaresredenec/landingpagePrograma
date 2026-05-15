import Anthropic from '@anthropic-ai/sdk'
import { getSupabase } from '@/lib/supabase'
import {
  CRITERIOS,
  type ResultadoCriterio,
  type SlugCriterio,
  type Recomendacao,
} from './criterios'
import {
  obterContextoBiblioteca,
  type ContextoBiblioteca,
} from './contexto-biblioteca'

const MODELO = 'claude-sonnet-4-6'

export type AvaliacaoCriterio = {
  slug: SlugCriterio
  resultado: ResultadoCriterio
  justificativa: string
}

export type AvaliacaoSubmissao = {
  criterios: AvaliacaoCriterio[]
  recomendacao: Recomendacao
  justificativa_geral: string
  pontos_atencao: string[]
  sugestoes_ao_parceiro: string
}

type LinhaSubmissao = {
  id: string
  titulo: string
  descricao: string
  organizacao_autora: string
  ponto_focal_nome: string
  ponto_focal_email: string
  tipo_recurso: string
  etapas_ensino: string[] | null
  temas_bncc: string[] | null
  licenca: string | null
  faixa_etaria: string | null
}

function montarSystemPrompt(): string {
  const definicoes = CRITERIOS.map(
    (c) =>
      `CRITÉRIO ${c.numero} — ${c.label.toUpperCase()} (slug: ${c.slug}${c.critico ? ', CRÍTICO' : ''})\n` +
      `Completo: ${c.descricoes.completo}\n` +
      `Satisfatório: ${c.descricoes.satisfatorio}\n` +
      `Insuficiente: ${c.descricoes.insuficiente}`,
  ).join('\n\n')

  return `Você é um avaliador especializado em materiais de educação cidadã para a Biblioteca da Rede Nacional de Educação Cidadã (Redenec), no âmbito do PECS (Portaria MEC nº 642/2025). Avalie o material submetido segundo os 13 critérios abaixo.

Para cada critério, atribua exatamente um dos valores: "completo", "satisfatorio" ou "insuficiente". Sempre justifique brevemente (1–3 frases).

${definicoes}

---

Recomendação final:
- "incluir": pelo menos 10 critérios em completo/satisfatório E nenhum "insuficiente" nos críticos (neutralidade_pluralidade, contribuicao_cidadania, direitos_autorais).
- "incluir_ressalvas": pelo menos 8 critérios em completo/satisfatório, com no máximo 2 "insuficientes" em critérios não-críticos.
- "nao_incluir": menos de 8 critérios satisfatórios OU qualquer "insuficiente" em critério crítico.

Responda APENAS em JSON válido (sem markdown, sem texto fora do JSON), no formato:

{
  "criterios": [
    { "slug": "neutralidade_pluralidade", "resultado": "completo|satisfatorio|insuficiente", "justificativa": "..." }
  ],
  "recomendacao": "incluir|incluir_ressalvas|nao_incluir",
  "justificativa_geral": "...",
  "pontos_atencao": ["...", "..."],
  "sugestoes_ao_parceiro": "..."
}

A lista "criterios" deve conter exatamente as 13 entradas, uma por slug, na ordem em que foram apresentados acima.`
}

function montarUserPrompt(s: LinhaSubmissao, ctx: ContextoBiblioteca): string {
  const fmt = (label: string, v: unknown) =>
    `${label}: ${v === 'desconhecido' ? 'desconhecido' : JSON.stringify(v)}`

  return `## Material submetido

- Título: ${s.titulo}
- Organização: ${s.organizacao_autora}
- Ponto focal: ${s.ponto_focal_nome} <${s.ponto_focal_email}>
- Tipo de recurso: ${s.tipo_recurso}
- Etapas de ensino: ${(s.etapas_ensino ?? []).join(', ') || '—'}
- Eixos / temas BNCC: ${(s.temas_bncc ?? []).join(', ') || '—'}
- Licença: ${s.licenca ?? '—'}
- Faixa etária: ${s.faixa_etaria ?? '—'}

### Descrição (texto enviado pelo parceiro)
${s.descricao}

## Contexto atual da biblioteca

${fmt('Etapas de ensino mais acessadas nos últimos 90 dias', ctx.etapasMaisAcessadas)}
${fmt('Top 5 materiais aprovados mais recentes', ctx.topMateriaisAprovados)}
${fmt('Distribuição de temas/eixos entre materiais aprovados', ctx.distribuicaoTemas)}
${fmt('Perfil do público cadastrado (campo PERFIL no Brevo)', ctx.perfilPublico)}

Use esse contexto especialmente no critério 13 (fit_biblioteca).`
}

function extrairJson(texto: string): string {
  const ini = texto.indexOf('{')
  const fim = texto.lastIndexOf('}')
  if (ini === -1 || fim === -1 || fim <= ini) {
    throw new Error('Resposta do modelo não contém JSON.')
  }
  return texto.slice(ini, fim + 1)
}

function validarAvaliacao(raw: unknown): AvaliacaoSubmissao {
  if (!raw || typeof raw !== 'object') throw new Error('JSON não é objeto.')
  const o = raw as Record<string, unknown>
  if (!Array.isArray(o.criterios)) throw new Error('criterios ausente.')

  const slugsValidos = new Set<string>(CRITERIOS.map((c) => c.slug))
  const criterios: AvaliacaoCriterio[] = o.criterios.map((c) => {
    const x = c as Record<string, unknown>
    if (!slugsValidos.has(x.slug as string)) {
      throw new Error(`Slug inválido: ${String(x.slug)}`)
    }
    if (!['completo', 'satisfatorio', 'insuficiente'].includes(x.resultado as string)) {
      throw new Error(`Resultado inválido: ${String(x.resultado)}`)
    }
    return {
      slug: x.slug as SlugCriterio,
      resultado: x.resultado as ResultadoCriterio,
      justificativa: typeof x.justificativa === 'string' ? x.justificativa : '',
    }
  })

  const recomendacao = o.recomendacao as Recomendacao
  if (!['incluir', 'incluir_ressalvas', 'nao_incluir'].includes(recomendacao)) {
    throw new Error(`Recomendação inválida: ${String(o.recomendacao)}`)
  }

  return {
    criterios,
    recomendacao,
    justificativa_geral:
      typeof o.justificativa_geral === 'string' ? o.justificativa_geral : '',
    pontos_atencao: Array.isArray(o.pontos_atencao)
      ? o.pontos_atencao.filter((x): x is string => typeof x === 'string')
      : [],
    sugestoes_ao_parceiro:
      typeof o.sugestoes_ao_parceiro === 'string' ? o.sugestoes_ao_parceiro : '',
  }
}

export async function avaliarSubmissao(id: string): Promise<AvaliacaoSubmissao> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada.')

  const supabase = getSupabase()
  const { data: submissao, error: erroBusca } = await supabase
    .from('submissoes')
    .select(
      'id, titulo, descricao, organizacao_autora, ponto_focal_nome, ponto_focal_email, tipo_recurso, etapas_ensino, temas_bncc, licenca, faixa_etaria',
    )
    .eq('id', id)
    .single<LinhaSubmissao>()

  if (erroBusca || !submissao) {
    throw new Error(
      `Submissão ${id} não encontrada: ${erroBusca?.message ?? 'sem dados'}`,
    )
  }

  const contexto = await obterContextoBiblioteca()
  const anthropic = new Anthropic({ apiKey })

  const resposta = await anthropic.messages.create({
    model: MODELO,
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: montarSystemPrompt(),
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      { role: 'user', content: montarUserPrompt(submissao, contexto) },
    ],
  })

  const textoBlocos = resposta.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')

  const json = JSON.parse(extrairJson(textoBlocos)) as unknown
  const avaliacao = validarAvaliacao(json)

  const { error: erroUpdate } = await supabase
    .from('submissoes')
    .update({
      criterios: avaliacao,
      recomendacao: avaliacao.recomendacao,
      avaliacao_concluida_em: new Date().toISOString(),
    })
    .eq('id', id)

  if (erroUpdate) {
    throw new Error(`Falha ao gravar avaliação: ${erroUpdate.message}`)
  }

  return avaliacao
}
