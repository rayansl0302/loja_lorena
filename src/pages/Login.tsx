import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { EyeBold, EyeClosedBold } from 'solar-icon-set'
import { useAuth } from '@/store/AuthContext'
import { Logo } from '@/components/Logo'
import { BackButton } from '@/components/BackButton'

export function Login() {
  const { isAuthenticated, login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

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

  async function handleGoogleLogin() {
    if (googleSubmitting) return
    setGoogleSubmitting(true)
    setError('')
    const result = await loginWithGoogle()
    if (result.ok) {
      navigate('/admin')
    } else {
      setError(result.reason)
      setGoogleSubmitting(false)
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
              disabled={submitting || googleSubmitting}
              whileTap={submitting ? undefined : { scale: 0.97 }}
              className="mt-2 rounded-full bg-gold-500 py-3 font-medium text-noir-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-noir-700" />
            <span className="text-xs uppercase tracking-wide text-cream-400">ou</span>
            <div className="h-px flex-1 bg-noir-700" />
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting || googleSubmitting}
            whileTap={googleSubmitting ? undefined : { scale: 0.97 }}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-noir-700 bg-noir-800 py-3 font-medium text-cream-100 transition hover:border-gold-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58Z"
              />
            </svg>
            {googleSubmitting ? 'Entrando...' : 'Entrar com Google'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
