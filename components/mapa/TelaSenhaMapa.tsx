'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Map } from 'lucide-react'

export function TelaSenhaMapa() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const res = await fetch('/api/mapa/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        router.refresh()
      } else {
        setErro(data.erro || 'Senha incorreta')
        setSenha('')
      }
    } catch {
      setErro('Erro ao validar. Tente novamente em instantes.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-redenec-cinza flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Hero card */}
        <div className="bg-redenec-petroleo text-white rounded-2xl p-8 md:p-10 mb-6">
          <div className="flex items-start gap-5">
            <Map size={44} strokeWidth={1.5} className="text-redenec-verde shrink-0 mt-1" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-redenec-verde mb-2">
                Acesso restrito
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                Mapa de Adesão ao PECS
              </h1>
              <p className="text-[15px] text-white/80 leading-relaxed">
                Visualize quais estados e municípios aderiram ao Programa Educação
                para a Cidadania e Sustentabilidade.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de senha */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock size={18} className="text-gray-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-black">Digite a senha de acesso</h2>
          </div>

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha de acesso"
            disabled={carregando}
            autoFocus
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-redenec-verde focus:ring-2 focus:ring-redenec-verde/20 transition disabled:opacity-50"
            aria-label="Senha de acesso ao mapa"
            aria-invalid={!!erro}
            aria-describedby={erro ? 'senha-erro' : undefined}
          />

          {erro && (
            <p id="senha-erro" role="alert" className="mt-3 text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={!senha || carregando}
            className="mt-5 w-full rounded-pill bg-redenec-verde px-6 py-3 text-sm font-bold text-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          >
            {carregando ? 'Validando…' : 'Acessar mapa'}
          </button>

          <p className="mt-5 text-[13px] text-gray-400 text-center">
            Precisa da senha?{' '}
            <a
              href="mailto:contato@redenec.org"
              className="text-redenec-petroleo underline hover:text-redenec-verde transition-colors"
            >
              contato@redenec.org
            </a>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[13px] text-gray-400 hover:text-redenec-petroleo transition-colors">
            ← Voltar ao início
          </Link>
        </div>

      </div>
    </main>
  )
}
