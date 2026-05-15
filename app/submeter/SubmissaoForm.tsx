'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  FileText,
  Send,
  Upload,
} from 'lucide-react'
import { TIPOS_RECURSO, ETAPAS_ENSINO } from '@/config/taxonomia'
import { LICENCAS, type Licenca } from '@/config/licencas'
import { FAIXAS_ETARIAS, type FaixaEtaria } from '@/config/faixa-etaria'
import type { TipoRecurso, EtapaEnsino } from '@/types/material'

export type SubmissaoState =
  | { status: 'idle' }
  | { status: 'success'; optinRelatorio: boolean }
  | { status: 'error'; mensagem: string; erros?: Record<string, string> }

const INITIAL_STATE: SubmissaoState = { status: 'idle' }

const TIPO_KEYS = (Object.keys(TIPOS_RECURSO) as TipoRecurso[]).sort(
  (a, b) => TIPOS_RECURSO[a].ordem - TIPOS_RECURSO[b].ordem,
)
const ETAPA_KEYS = (Object.keys(ETAPAS_ENSINO) as EtapaEnsino[]).sort(
  (a, b) => ETAPAS_ENSINO[a].ordem - ETAPAS_ENSINO[b].ordem,
)
const LICENCA_KEYS = (Object.keys(LICENCAS) as Licenca[]).sort(
  (a, b) => LICENCAS[a].ordem - LICENCAS[b].ordem,
)
const FAIXA_KEYS = (Object.keys(FAIXAS_ETARIAS) as FaixaEtaria[]).sort(
  (a, b) => FAIXAS_ETARIAS[a].ordem - FAIXAS_ETARIAS[b].ordem,
)

const DESC_MIN = 100
const DESC_MAX = 500

const ACEITE_ARQUIVO = '.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png'
const MAX_BYTES = 4 * 1024 * 1024

const ALINHAMENTO_OPCOES = [
  { value: 'sim', label: 'Sim, foi criado com referência explícita à BNCC' },
  {
    value: 'parcialmente',
    label:
      'Parcialmente, dialoga com competências da BNCC mas não foi criado para isso',
  },
  { value: 'nao', label: 'Não, foi criado com outro referencial pedagógico' },
] as const

const RELACAO_OPCOES = [
  {
    value: 'autor-ou-autorizado',
    label:
      'Sou autor(a) ou tenho autorização expressa para compartilhá-lo',
  },
  {
    value: 'encontrado-publicamente',
    label: 'Encontrei este material publicamente disponível',
  },
] as const

const CRITERIOS_RESUMIDOS: { titulo: string; resumo: string }[] = [
  {
    titulo: 'Neutralidade e pluralidade',
    resumo:
      'Apresenta múltiplas perspectivas sobre temas controversos, sem favorecer posição política, religiosa ou ideológica.',
  },
  {
    titulo: 'Clareza da proposta',
    resumo:
      'Objetivos claros, linguagem adequada ao público e estrutura fácil de seguir.',
  },
  {
    titulo: 'Justificativa pedagógica',
    resumo: 'A proposta tem base pedagógica clara e conceitos bem definidos.',
  },
  {
    titulo: 'Detalhamento e replicabilidade',
    resumo:
      'Qualquer educador consegue aplicar o material seguindo as instruções, sem precisar de formação adicional.',
  },
  {
    titulo: 'Fontes e evidências',
    resumo:
      'As informações estão embasadas em fontes confiáveis e referenciadas.',
  },
  {
    titulo: 'Potencial de impacto',
    resumo:
      'Tem chances reais de gerar aprendizagem significativa em sala de aula.',
  },
  {
    titulo: 'Contribuição à cidadania e à diversidade',
    resumo:
      'Fortalece a formação cidadã e reconhece a diversidade dos territórios e povos brasileiros.',
  },
  {
    titulo: 'Originalidade',
    resumo:
      'Traz uma abordagem ou perspectiva que complementa o que já existe no acervo.',
  },
  {
    titulo: 'Qualidade técnica e acessibilidade',
    resumo: 'Material bem produzido, legível e com linguagem cuidada.',
  },
  {
    titulo: 'Direitos autorais',
    resumo:
      'Material original ou com autorização para compartilhamento, com licença de uso clara.',
  },
  {
    titulo: 'Completude da submissão',
    resumo:
      'Descrição, público-alvo, faixa etária e arquivo do material entregues e acessíveis.',
  },
  {
    titulo: 'Sustentabilidade do material',
    resumo:
      'Tem validade duradoura, sem depender de plataformas ou contextos passageiros.',
  },
  {
    titulo: 'Aderência ao perfil da biblioteca',
    resumo:
      'Conversa com o perfil atual da biblioteca e contribui para preencher temas pouco cobertos.',
  },
]

const INPUT_CLASS =
  'block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-redenec-verde'
const LABEL_CLASS = 'text-sm font-bold text-redenec-petroleo'
const CARD_CLASS =
  'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'

type Props = {
  action: (
    state: SubmissaoState,
    formData: FormData,
  ) => Promise<SubmissaoState>
}

export function SubmissaoForm({ action }: Props) {
  const [state, formAction] = useFormState(action, INITIAL_STATE)
  const [relacao, setRelacao] = useState('')
  const [arquivoUrl, setArquivoUrl] = useState('')
  const [arquivoNome, setArquivoNome] = useState('')
  const [uploading, setUploading] = useState(false)

  if (state.status === 'success') {
    return <SucessoView optinRelatorio={state.optinRelatorio} />
  }

  const erros = state.status === 'error' ? state.erros ?? {} : {}
  const bloqueado = relacao === 'encontrado-publicamente'
  const submitDesabilitado = uploading || bloqueado || !arquivoUrl

  return (
    <main className="min-h-screen bg-redenec-cinza">
      <div className="container-site section-spacing">
        <Link
          href="/materiais"
          className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-redenec-petroleo/70 transition-colors hover:text-redenec-petroleo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Voltar para a biblioteca
        </Link>

        <header className="mt-8 mb-10 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-redenec-petroleo sm:text-5xl">
            Contribuir com um material
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Sua contribuição alcança milhares de educadores comprometidos com
            a formação cidadã. Cada submissão é analisada pela curadoria da
            Rede Nacional de Educação Cidadã. Retornamos por e-mail em até{' '}
            <strong>10 dias úteis</strong>.
          </p>
        </header>

        <form action={formAction} noValidate className="max-w-2xl space-y-8">
          <Secao1 erros={erros} />
          <Secao2
            erros={erros}
            arquivoUrl={arquivoUrl}
            arquivoNome={arquivoNome}
            uploading={uploading}
            setArquivoUrl={setArquivoUrl}
            setArquivoNome={setArquivoNome}
            setUploading={setUploading}
          />
          <Secao3 erros={erros} relacao={relacao} setRelacao={setRelacao} />

          <AvisoLegal />

          {state.status === 'error' && state.mensagem && (
            <div
              role="alert"
              className="rounded-2xl border border-redenec-coral/40 bg-redenec-coral/10 p-4 text-sm text-redenec-petroleo"
            >
              {state.mensagem}
            </div>
          )}

          <BotaoEnviar
            disabled={submitDesabilitado}
            uploading={uploading}
          />

          <p className="text-micro text-gray-500">
            Dúvidas:{' '}
            <a
              href="mailto:contato@redenec.org"
              className="underline hover:text-redenec-petroleo"
            >
              contato@redenec.org
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}

// ── Seção 1 — Quem está enviando ─────────────────────────────
function Secao1({ erros }: { erros: Record<string, string> }) {
  return (
    <fieldset className={CARD_CLASS}>
      <legend className="-ml-2 px-2 text-micro font-bold uppercase tracking-widest text-gray-500">
        1. Quem está enviando
      </legend>

      <div className="mt-4 space-y-5">
        <Campo label="Nome completo" required error={erros.nome}>
          <input
            type="text"
            name="nome"
            required
            autoComplete="name"
            maxLength={120}
            className={INPUT_CLASS}
            aria-invalid={!!erros.nome}
          />
        </Campo>

        <Campo label="E-mail" required error={erros.email}>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={120}
            className={INPUT_CLASS}
            aria-invalid={!!erros.email}
          />
        </Campo>

        <Campo
          label="Organização ou instituição"
          required
          hint="Ex.: ONG, escola, secretaria de educação, ou seu próprio nome se for autor(a) individual."
          error={erros.organizacao}
        >
          <input
            type="text"
            name="organizacao"
            required
            autoComplete="organization"
            maxLength={160}
            className={INPUT_CLASS}
            aria-invalid={!!erros.organizacao}
          />
        </Campo>

        <Campo label="Site da organização" hint="Opcional. Use https://">
          <input
            type="url"
            name="site"
            placeholder="https://"
            autoComplete="url"
            inputMode="url"
            maxLength={200}
            className={INPUT_CLASS}
          />
        </Campo>
      </div>
    </fieldset>
  )
}

// ── Seção 2 — Sobre o material ───────────────────────────────
function Secao2({
  erros,
  arquivoUrl,
  arquivoNome,
  uploading,
  setArquivoUrl,
  setArquivoNome,
  setUploading,
}: {
  erros: Record<string, string>
  arquivoUrl: string
  arquivoNome: string
  uploading: boolean
  setArquivoUrl: (s: string) => void
  setArquivoNome: (s: string) => void
  setUploading: (b: boolean) => void
}) {
  const [descricao, setDescricao] = useState('')

  const descLen = descricao.length
  const atingiuMin = descLen >= DESC_MIN
  const contadorTexto =
    descLen === 0
      ? `${DESC_MIN}–${DESC_MAX} caracteres`
      : atingiuMin
        ? `${descLen} / ${DESC_MAX}`
        : `${descLen} / ${DESC_MIN} (mínimo)`
  const contadorCor = atingiuMin ? 'text-gray-500' : 'text-redenec-coral'

  return (
    <fieldset className={CARD_CLASS}>
      <legend className="-ml-2 px-2 text-micro font-bold uppercase tracking-widest text-gray-500">
        2. Sobre o material
      </legend>

      <div className="mt-4 space-y-6">
        <Campo label="Título do material" required error={erros.titulo}>
          <input
            type="text"
            name="titulo"
            required
            maxLength={160}
            className={INPUT_CLASS}
            aria-invalid={!!erros.titulo}
          />
        </Campo>

        <Campo
          label="Descrição"
          required
          hint="Apresente o material, o público para o qual foi pensado e como pode ser usado em sala de aula."
          error={erros.descricao}
        >
          <textarea
            name="descricao"
            required
            minLength={DESC_MIN}
            maxLength={DESC_MAX}
            rows={5}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={`${INPUT_CLASS} min-h-[8rem] resize-y`}
            aria-invalid={!!erros.descricao}
            aria-describedby="descricao-contador"
          />
          <p
            id="descricao-contador"
            className={`mt-1.5 text-xs ${contadorCor}`}
            aria-live="polite"
          >
            {contadorTexto}
          </p>
        </Campo>

        <Campo label="Tipo de material" required error={erros.tipo}>
          <select
            name="tipo"
            required
            defaultValue=""
            className={INPUT_CLASS}
            aria-invalid={!!erros.tipo}
          >
            <option value="" disabled>
              Selecione…
            </option>
            {TIPO_KEYS.map((t) => (
              <option key={t} value={t}>
                {TIPOS_RECURSO[t].label}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          label="Público-alvo"
          required
          hint="Selecione todas as etapas em que o material pode ser usado."
          error={erros.publicoAlvo}
          group
        >
          <div
            role="group"
            aria-label="Público-alvo"
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {ETAPA_KEYS.map((etapa) => (
              <CheckboxBox
                key={etapa}
                name="publicoAlvo"
                value={etapa}
                label={ETAPAS_ENSINO[etapa].labelCompleto}
              />
            ))}
          </div>
        </Campo>

        <Campo
          label="Este material foi intencionalmente criado em alinhamento com a BNCC?"
          required
          error={erros.alinhamentoBncc}
          group
        >
          <RadioGroup name="alinhamentoBncc" options={ALINHAMENTO_OPCOES} />
        </Campo>

        <Campo
          label="Material"
          required
          hint="Anexe o arquivo do material (PDF, DOC, DOCX, PPT, PPTX, JPG ou PNG, até 4 MB)."
          error={erros.material}
          group
        >
          <UploadAnexo
            url={arquivoUrl}
            nome={arquivoNome}
            uploading={uploading}
            setUrl={setArquivoUrl}
            setNome={setArquivoNome}
            setUploading={setUploading}
          />
          <input
            type="hidden"
            name="materialArquivoUrl"
            value={arquivoUrl}
          />
        </Campo>
      </div>
    </fieldset>
  )
}

// ── Componente de upload (Vercel Blob) ───────────────────────
function UploadAnexo({
  url,
  nome,
  uploading,
  setUrl,
  setNome,
  setUploading,
}: {
  url: string
  nome: string
  uploading: boolean
  setUrl: (s: string) => void
  setNome: (s: string) => void
  setUploading: (b: boolean) => void
}) {
  const [erro, setErro] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setErro(null)
    if (file.size > MAX_BYTES) {
      setErro('O arquivo precisa ter no máximo 4 MB.')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const resp = await fetch('/api/upload-direto', {
        method: 'POST',
        body: formData,
      })
      if (!resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as {
          error?: string
        }
        throw new Error(data.error ?? `Upload falhou (${resp.status}).`)
      }
      const { url } = (await resp.json()) as { url: string }
      setUrl(url)
      setNome(file.name)
    } catch (err) {
      setErro((err as Error).message || 'Falha ao enviar o arquivo.')
    } finally {
      setUploading(false)
    }
  }

  function limpar() {
    setUrl('')
    setNome('')
    setErro(null)
  }

  if (url) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-redenec-verde/40 bg-redenec-verde/10 p-4">
        <FileText
          size={18}
          className="shrink-0 text-redenec-petroleo"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-sm font-bold text-redenec-petroleo">
          {nome || 'Arquivo anexado'}
        </span>
        <button
          type="button"
          onClick={limpar}
          className="rounded-full px-3 py-1 text-xs font-bold text-redenec-petroleo/70 transition-colors hover:bg-white hover:text-redenec-petroleo"
        >
          Remover
        </button>
      </div>
    )
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white px-4 py-8 text-center transition-colors hover:border-redenec-petroleo/40 ${
          uploading ? 'cursor-wait opacity-60' : ''
        }`}
      >
        <Upload
          size={24}
          className="text-redenec-petroleo/70"
          aria-hidden="true"
        />
        {uploading ? (
          <span className="text-sm font-bold text-redenec-petroleo">
            Enviando…
          </span>
        ) : (
          <>
            <span className="text-sm font-bold text-redenec-petroleo">
              Escolher arquivo
            </span>
            <span className="text-xs text-gray-500">
              PDF, DOC, PPT, JPG ou PNG · até 4 MB
            </span>
          </>
        )}
        <input
          type="file"
          className="sr-only"
          accept={ACEITE_ARQUIVO}
          onChange={handleChange}
          disabled={uploading}
        />
      </label>
      {erro && (
        <p role="alert" className="mt-2 text-xs font-bold text-redenec-coral">
          {erro}
        </p>
      )}
    </div>
  )
}

// ── Seção 3 — Direitos, licença e autorizações ───────────────
function Secao3({
  erros,
  relacao,
  setRelacao,
}: {
  erros: Record<string, string>
  relacao: string
  setRelacao: (v: string) => void
}) {
  const bloqueado = relacao === 'encontrado-publicamente'
  const exibirDemais = relacao === 'autor-ou-autorizado'

  return (
    <fieldset className={CARD_CLASS}>
      <legend className="-ml-2 px-2 text-micro font-bold uppercase tracking-widest text-gray-500">
        3. Direitos, licença e autorizações
      </legend>

      <div className="mt-4 space-y-6">
        <Campo
          label="Qual é a sua relação com este material?"
          required
          error={erros.relacaoMaterial}
          group
        >
          <RadioGroup
            name="relacaoMaterial"
            options={RELACAO_OPCOES}
            value={relacao}
            onChange={setRelacao}
          />
        </Campo>

        {bloqueado && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border-2 border-redenec-coral/40 bg-redenec-coral/15 p-5 text-sm leading-relaxed text-redenec-petroleo"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-redenec-coral"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold">Esta opção não permite submissão.</p>
              <p className="mt-1.5">
                Para submeter, é necessário ser autor(a) do material ou ter
                autorização legal para compartilhá-lo. Materiais encontrados
                publicamente, sem autorização documentada, não podem ser
                submetidos.
              </p>
            </div>
          </div>
        )}

        {exibirDemais && (
          <>
            <Campo
              label="Licença de uso"
              required
              error={erros.licenca}
              hint="Defina os termos sob os quais o material pode ser reutilizado."
            >
              <select
                name="licenca"
                required
                defaultValue=""
                className={INPUT_CLASS}
                aria-invalid={!!erros.licenca}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {LICENCA_KEYS.map((slug) => (
                  <option key={slug} value={slug}>
                    {LICENCAS[slug].label} — {LICENCAS[slug].descricao}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo
              label="Faixa etária"
              required
              error={erros.faixaEtaria}
              hint="Idade mínima recomendada para uso do material."
            >
              <select
                name="faixaEtaria"
                required
                defaultValue=""
                className={INPUT_CLASS}
                aria-invalid={!!erros.faixaEtaria}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {FAIXA_KEYS.map((slug) => (
                  <option key={slug} value={slug}>
                    {FAIXAS_ETARIAS[slug].label}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="space-y-3 border-t border-gray-100 pt-5">
              <CheckboxLinha
                name="direitosAutorais"
                required
                error={erros.direitosAutorais}
                label={
                  <>
                    Declaro que possuo os direitos autorais ou autorização
                    expressa para compartilhar este material com a Rede
                    Nacional de Educação Cidadã.{' '}
                    <span className="text-redenec-coral">*</span>
                  </>
                }
              />

              <CheckboxLinha
                name="lgpd"
                required
                error={erros.lgpd}
                label={
                  <>
                    Li e aceito a{' '}
                    <Link
                      href="/politica-de-privacidade"
                      target="_blank"
                      className="font-bold underline hover:text-redenec-petroleo"
                    >
                      política de privacidade
                    </Link>{' '}
                    e autorizo o uso dos meus dados para retorno sobre esta
                    submissão.{' '}
                    <span className="text-redenec-coral">*</span>
                  </>
                }
              />

              <CheckboxLinha
                name="naoComercial"
                required
                error={erros.naoComercial}
                label={
                  <>
                    Declaro que este material não contém conteúdo comercial,
                    publicitário ou de natureza político-partidária.{' '}
                    <span className="text-redenec-coral">*</span>
                  </>
                }
              />

              <CheckboxLinha
                name="autorizaAdaptacao"
                required
                error={erros.autorizaAdaptacao}
                label={
                  <>
                    Autorizo a adaptação e redistribuição deste material pela
                    Rede Nacional de Educação Cidadã e por educadores,
                    respeitada a licença indicada acima.{' '}
                    <span className="text-redenec-coral">*</span>
                  </>
                }
              />

              <CheckboxLinha
                name="optinRelatorio"
                label={
                  <>
                    Quero receber o relatório bimestral com novidades do
                    programa (opcional).
                  </>
                }
              />
            </div>
          </>
        )}
      </div>
    </fieldset>
  )
}

// ── Aviso legal — Lei 9.610/1998 + Art. 184 CP ──────────────
function AvisoLegal() {
  return (
    <div
      role="note"
      className="rounded-2xl border border-redenec-coral/40 bg-redenec-coral/10 p-4 text-sm leading-relaxed text-redenec-petroleo"
    >
      <p>
        <span className="font-bold">⚠️ Atenção:</span> o compartilhamento de
        material protegido por direitos autorais sem autorização expressa do
        titular constitui violação à <strong>Lei nº 9.610/1998</strong> (Lei
        de Direitos Autorais), podendo resultar em responsabilização civil e
        criminal, incluindo indenizações e pena de detenção de{' '}
        <strong>3 meses a 1 ano</strong>, conforme o{' '}
        <strong>Art. 184 do Código Penal</strong>.
      </p>
    </div>
  )
}

// ── Botão de envio ──────────────────────────────────────────
function BotaoEnviar({
  disabled,
  uploading,
}: {
  disabled: boolean
  uploading: boolean
}) {
  const { pending } = useFormStatus()
  const ocupado = pending || uploading
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center justify-center gap-2 rounded-pill bg-redenec-petroleo px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-redenec-petroleo/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
    >
      <Send size={16} aria-hidden="true" />
      {ocupado ? 'Enviando…' : 'Enviar submissão'}
    </button>
  )
}

// ── Tela de sucesso ─────────────────────────────────────────
function SucessoView({ optinRelatorio }: { optinRelatorio: boolean }) {
  return (
    <main className="min-h-screen bg-redenec-cinza">
      <div className="container-site section-spacing flex justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-redenec-verde/20">
            <CheckCircle2
              size={28}
              className="text-redenec-petroleo"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-redenec-petroleo sm:text-3xl">
            Submissão recebida
          </h1>
          <p className="mt-3 text-body text-gray-700">
            Obrigado por contribuir com a Biblioteca da Rede Nacional de
            Educação Cidadã! A equipe de curadoria analisará seu material com
            base nos critérios de adequação da Rede.
          </p>

          <div className="mt-6 space-y-2 rounded-2xl bg-redenec-cinza/60 p-4 text-left text-sm text-gray-700">
            <p className="font-bold text-redenec-petroleo">Próximos passos</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Retornaremos para o e-mail informado em até{' '}
                <strong>10 dias úteis</strong>.
              </li>
              <li>
                Se aprovado, entraremos em contato para combinar a publicação.
              </li>
              <li>
                Em caso de ajustes necessários, indicaremos os pontos para
                revisão.
              </li>
            </ul>
            {optinRelatorio && (
              <p className="pt-2 text-xs text-gray-500">
                Você também passará a receber o relatório bimestral da Redenec.
              </p>
            )}
          </div>

          <DetalhesCriterios />

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/materiais"
              className="inline-flex items-center justify-center rounded-pill bg-redenec-petroleo px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-redenec-petroleo/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
            >
              Voltar para a biblioteca
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-pill border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:border-redenec-petroleo hover:text-redenec-petroleo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
            >
              Página inicial
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function DetalhesCriterios() {
  return (
    <details className="group mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50">
        <span className="text-sm font-bold text-redenec-petroleo">
          Como avaliamos os materiais
        </span>
        <ChevronDown
          size={16}
          className="shrink-0 text-redenec-petroleo/60 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
        <p className="text-xs leading-relaxed text-redenec-petroleo/80">
          Três critérios — neutralidade, contribuição à cidadania e direitos
          autorais — são determinantes para a inclusão de um material no
          acervo.
        </p>
        <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-xs leading-relaxed text-gray-700 marker:font-bold marker:text-redenec-petroleo/40">
          {CRITERIOS_RESUMIDOS.map((c, i) => (
            <li key={i}>
              <span className="font-bold text-redenec-petroleo">
                {c.titulo}
              </span>
              {' — '}
              {c.resumo}
            </li>
          ))}
        </ol>
      </div>
    </details>
  )
}

// ── Subcomponentes ──────────────────────────────────────────
function Campo({
  label,
  required,
  hint,
  error,
  group,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  group?: boolean
  children: ReactNode
}) {
  const Tag = group ? 'div' : 'label'
  return (
    <Tag className="block">
      <span className={LABEL_CLASS}>
        {label}
        {required && <span className="ml-1 text-redenec-coral">*</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-bold text-redenec-coral">
          {error}
        </p>
      )}
    </Tag>
  )
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: readonly { value: string; label: string }[]
  value?: string
  onChange?: (v: string) => void
}) {
  const controlado = value !== undefined && onChange !== undefined
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const inputProps = controlado
          ? {
              checked: value === opt.value,
              onChange: () => onChange!(opt.value),
            }
          : {}
        return (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:border-redenec-petroleo has-[:checked]:border-redenec-petroleo has-[:checked]:bg-redenec-petroleo/[0.04]"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              {...inputProps}
              className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 text-redenec-petroleo focus:ring-redenec-verde"
            />
            <span>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

function CheckboxBox({
  name,
  value,
  label,
}: {
  name: string
  value: string
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:border-redenec-petroleo has-[:checked]:border-redenec-petroleo has-[:checked]:bg-redenec-petroleo/[0.04]">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="h-4 w-4 rounded border-gray-300 text-redenec-petroleo focus:ring-redenec-verde"
      />
      <span>{label}</span>
    </label>
  )
}

function CheckboxLinha({
  name,
  required,
  error,
  label,
}: {
  name: string
  required?: boolean
  error?: string
  label: ReactNode
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          name={name}
          required={required}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-redenec-petroleo focus:ring-redenec-verde"
          aria-invalid={!!error}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p role="alert" className="ml-7 mt-1 text-xs font-bold text-redenec-coral">
          {error}
        </p>
      )}
    </div>
  )
}
