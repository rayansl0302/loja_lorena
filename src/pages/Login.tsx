import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { EyeBold, EyeClosedBold } from 'solar-icon-set'
import { useAuth } from '@/store/AuthContext'
import { Logo } from '@/components/Logo'
import { BackButton } from '@/components/BackButton'

export function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    const result = await login(email, password)
    if (result.ok) {
      navigate('/admin')
    } else {
      setError(result.reason)
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-noir-950 px-4 py-10 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-noir-950 via-noir-900 to-noir-800" />
      <div className="absolute inset-0 bg-noise opacity-20" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-4">
          <BackButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="rounded-3xl border border-noir-700 bg-noir-900 p-6 shadow-soft sm:p-8"
        >
          <Link to="/">
            <Logo />
          </Link>
          <h1 className="mt-5 font-display text-2xl text-cream-100">Área da lojista</h1>
          <p className="mt-1 text-sm text-cream-300">Entre para gerenciar o catálogo.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" autoComplete="on">
            <label className="flex flex-col gap-1.5 text-sm text-cream-100">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                className="rounded-xl border border-noir-700 bg-noir-800 px-4 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-cream-100">
              Senha
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-noir-700 bg-noir-800 px-4 py-2.5 pr-11 text-cream-100 outline-none transition focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-cream-300 transition hover:text-gold-400"
                >
                  {showPassword ? <EyeClosedBold size={18} /> : <EyeBold size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-wine-600"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={submitting ? undefined : { scale: 0.97 }}
              className="mt-2 rounded-full bg-gold-500 py-3 font-medium text-noir-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
