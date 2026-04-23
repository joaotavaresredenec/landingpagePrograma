'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { copyFormulario } from '@/config/copy'
import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { Checkbox } from '@/components/primitives/Checkbox'
import { Button } from '@/components/primitives/Button'

const UF_OPTIONS = [
  { value: '', label: 'Selecione o estado' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

type FormState = {
  nome: string
  email: string
  perfil: string
  uf: string
  municipio: string
  etapa: string
  lgpd: boolean
}

type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL_STATE: FormState = {
  nome: '',
  email: '',
  perfil: '',
  uf: '',
  municipio: '',
  etapa: '',
  lgpd: false,
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!values.nome.trim()) errors.nome = copyFormulario.campos.nome.erro
  if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = copyFormulario.campos.email.erro
  if (!values.perfil) errors.perfil = copyFormulario.campos.perfil.erro
  if (!values.uf) errors.uf = copyFormulario.campos.uf.erro
  if (!values.municipio.trim()) errors.municipio = copyFormulario.campos.municipio.erro
  // etapa is optional — no validation required
  if (!values.lgpd) errors.lgpd = 'Você precisa concordar com a política de privacidade para continuar.'
  return errors
}

type FormularioProps = {
  /** 'full' = renderiza com section/container próprios (uso na home). 'embed' = só o form para uso dentro de outro card. */
  variant?: 'full' | 'embed'
  /** Origem do cadastro — enviada ao backend para tracking (opcional). */
  origem?: 'home' | 'biblioteca' | 'materiais'
  /** Se true, após sucesso usa router.refresh() em vez de redirecionar para /obrigado. Útil quando o formulário está inline numa rota protegida. */
  redirectAposLogin?: boolean
}

export function Formulario({
  variant = 'full',
  origem = 'home',
  redirectAposLogin = false,
}: FormularioProps = {}) {
  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value
    setValues((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const validation = validate(values)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      const firstKey = Object.keys(validation)[0]
      document.getElementById(firstKey)?.focus()
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: values.nome,
          email: values.email,
          perfil: values.perfil,
          uf: values.uf,
          municipio: values.municipio,
          etapaEnsino: values.etapa,
          consentimentoLgpd: values.lgpd,
          origem,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.erro || 'Erro no servidor')
      }

      if (redirectAposLogin) {
        // Cookie de sessão foi criado pelo backend — recarrega para renderizar biblioteca
        router.refresh()
      } else {
        window.location.href = '/obrigado'
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message && err.message !== 'Erro no servidor'
          ? err.message
          : 'Ocorreu um erro ao enviar. Tente novamente ou entre em contato: cogeb@mec.gov.br'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  const perfilOptions = [
    { value: '', label: copyFormulario.campos.perfil.placeholder },
    ...copyFormulario.campos.perfil.opcoes.map((o) => ({ value: o.toLowerCase().replace(/ /g, '-'), label: o })),
  ]

  const etapaOptions = [
    { value: '', label: copyFormulario.campos.etapa.placeholder },
    ...copyFormulario.campos.etapa.opcoes.map((o) => ({ value: o.toLowerCase().replace(/ /g, '-'), label: o })),
  ]

  const formBody = (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        id="nome"
        label={copyFormulario.campos.nome.label}
        placeholder={copyFormulario.campos.nome.placeholder}
        type="text"
        autoComplete="name"
        required
        value={values.nome}
        onChange={set('nome')}
        error={errors.nome}
      />

      <Input
        id="email"
        label={copyFormulario.campos.email.label}
        placeholder={copyFormulario.campos.email.placeholder}
        type="email"
        autoComplete="email"
        required
        value={values.email}
        onChange={set('email')}
        error={errors.email}
      />

      <Select
        id="perfil"
        label={copyFormulario.campos.perfil.label}
        options={perfilOptions}
        required
        value={values.perfil}
        onChange={set('perfil')}
        error={errors.perfil}
      />

      <Select
        id="uf"
        label={copyFormulario.campos.uf.label}
        options={UF_OPTIONS}
        required
        value={values.uf}
        onChange={set('uf')}
        error={errors.uf}
      />

      <Input
        id="municipio"
        label={copyFormulario.campos.municipio.label}
        placeholder={copyFormulario.campos.municipio.placeholder}
        type="text"
        required
        value={values.municipio}
        onChange={set('municipio')}
        error={errors.municipio}
      />

      <Select
        id="etapa"
        label={copyFormulario.campos.etapa.label}
        options={etapaOptions}
        value={values.etapa}
        onChange={set('etapa')}
        error={errors.etapa}
      />

      <Checkbox
        id="lgpd"
        label={copyFormulario.checkboxLgpd}
        required
        checked={values.lgpd}
        onChange={set('lgpd')}
        error={errors.lgpd}
      />

      {serverError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="mt-2 w-full"
      >
        {loading ? 'Enviando...' : copyFormulario.botaoSubmit}
      </Button>
    </form>
  )

  if (variant === 'embed') {
    return formBody
  }

  return (
    <section
      id="formulario"
      className="bg-white"
      aria-labelledby="formulario-heading"
    >
      <div className="container-site section-spacing">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2
              id="formulario-heading"
              className="text-h2-mobile lg:text-h2-desktop font-bold text-black mb-3"
            >
              {copyFormulario.titulo}
            </h2>
            <p className="text-body text-gray-600">{copyFormulario.subtitulo}</p>
          </div>
          {formBody}
        </div>
      </div>
    </section>
  )
}
