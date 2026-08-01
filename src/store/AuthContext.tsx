import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

const SESSION_KEY = 'lorena:session'
const LOCK_KEY = 'lorena:auth-lock'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const MAX_ATTEMPTS = 5
const LOCK_DURATIONS_MS = [60_000, 5 * 60_000, 15 * 60_000]

interface SessionPayload {
  exp: number
}

interface LockPayload {
  fails: number
  lockLevel: number
  lockedUntil: number
}

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => { ok: true } | { ok: false; reason: string }
  logout: () => void
  getLockRemainingMs: () => number
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function getCredentials(): { username: string; password: string } | null {
  const username = String(import.meta.env.VITE_ADMIN_USERNAME ?? '').trim().toLowerCase()
  const password = String(import.meta.env.VITE_ADMIN_PASSWORD ?? '')
  if (username && password) return { username, password }
  if (import.meta.env.DEV) return { username: 'loja', password: 'moda123' }
  return null
}

function readValidSession(): boolean {
  const payload = readJson<SessionPayload>(SESSION_KEY)
  if (!payload?.exp) {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    return false
  }
  if (Date.now() > payload.exp) {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    return false
  }
  return true
}

function readLock(): LockPayload {
  return (
    readJson<LockPayload>(LOCK_KEY) ?? {
      fails: 0,
      lockLevel: 0,
      lockedUntil: 0,
    }
  )
}

function writeLock(lock: LockPayload) {
  sessionStorage.setItem(LOCK_KEY, JSON.stringify(lock))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => readValidSession())

  const getLockRemainingMs = useCallback(() => {
    const lock = readLock()
    return Math.max(0, lock.lockedUntil - Date.now())
  }, [])

  const login = useCallback((username: string, password: string) => {
    const remaining = Math.max(0, readLock().lockedUntil - Date.now())
    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000)
      return {
        ok: false as const,
        reason: `Muitas tentativas. Tente novamente em ${seconds}s.`,
      }
    }

    const credentials = getCredentials()
    if (!credentials) {
      return {
        ok: false as const,
        reason: 'Acesso administrativo indisponível. Configure as credenciais no ambiente.',
      }
    }

    const valid =
      username.trim().toLowerCase() === credentials.username && password === credentials.password

    if (!valid) {
      const lock = readLock()
      const fails = lock.fails + 1
      if (fails >= MAX_ATTEMPTS) {
        const lockLevel = Math.min(lock.lockLevel + 1, LOCK_DURATIONS_MS.length)
        const duration = LOCK_DURATIONS_MS[lockLevel - 1] ?? LOCK_DURATIONS_MS.at(-1)!
        writeLock({
          fails: 0,
          lockLevel,
          lockedUntil: Date.now() + duration,
        })
        return {
          ok: false as const,
          reason: `Credenciais inválidas. Acesso bloqueado por ${Math.ceil(duration / 1000)}s.`,
        }
      }
      writeLock({ ...lock, fails })
      return { ok: false as const, reason: 'Credenciais inválidas.' }
    }

    sessionStorage.removeItem(LOCK_KEY)
    const exp = Date.now() + SESSION_TTL_MS
    const payload = JSON.stringify({ exp } satisfies SessionPayload)
    sessionStorage.setItem(SESSION_KEY, payload)
    localStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(true)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getLockRemainingMs }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
