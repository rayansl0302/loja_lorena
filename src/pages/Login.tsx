import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import { Logo } from '@/components/Logo'
import { BackButton } from '@/components/BackButton'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.5c-2.2 1.5-5 2.5-7.7 2.5-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.9 39.6 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.6 5.5C41.4 36 44 30.5 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}

export function Login() {
  const { isAuthenticated, login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleSubmitting || submitting}
            whileTap={googleSubmitting ? undefined : { scale: 0.97 }}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-noir-600 bg-cream-100 py-3 font-medium text-noir-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {googleSubmitting ? 'Entrando...' : 'Entrar com Google'}
          </motion.button>

          <div className="my-5 flex items-center gap-3 text-xs text-cream-300/60">
            <span className="h-px flex-1 bg-noir-700" />
            ou
            <span className="h-px flex-1 bg-noir-700" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="on">
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
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="rounded-xl border border-noir-700 bg-noir-800 px-4 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
              />
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
        </motion.div>
      </div>
    </div>
  )
}
