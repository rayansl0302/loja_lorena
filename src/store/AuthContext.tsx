import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type AuthProvider as FirebaseAuthProvider,
  type User,
} from 'firebase/auth'
import { auth, appleProvider, googleProvider, isFirebaseConfigured } from '@/lib/firebase'
import { isRegisteredAdmin } from '@/lib/adminAccess'

type LoginResult = { ok: true } | { ok: false; reason: string }

interface AuthContextValue {
  isAuthenticated: boolean
  isOwner: boolean
  isLoading: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<LoginResult>
  loginWithGoogle: () => Promise<LoginResult>
  loginWithApple: () => Promise<LoginResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const OWNER_EMAILS = String(import.meta.env.VITE_OWNER_EMAIL ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

function isOwnerEmail(email: string | null | undefined): boolean {
  return Boolean(email) && OWNER_EMAILS.includes(email!.toLowerCase())
}

async function verifyAdminAccess(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  if (isOwnerEmail(email)) return true
  return isRegisteredAdmin(email)
}

function friendlyAuthError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
    case 'auth/unauthorized-domain':
      return 'Este domínio não está autorizado no Firebase Authentication.'
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet e tente novamente.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Login cancelado.'
    default:
      return 'Não foi possível entrar. Tente novamente.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authInstance = auth
    if (!isFirebaseConfigured || !authInstance) {
      setIsLoading(false)
      return
    }

    getRedirectResult(authInstance).catch(() => {})

    const unsubscribe = onAuthStateChanged(authInstance, (nextUser) => {
      void (async () => {
        if (nextUser && !(await verifyAdminAccess(nextUser.email))) {
          await signOut(authInstance)
          setUser(null)
        } else {
          setUser(nextUser)
        }
        setIsLoading(false)
      })()
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string): Promise<LoginResult> {
    if (!isFirebaseConfigured || !auth) {
      return { ok: false, reason: 'Firebase não está configurado neste ambiente.' }
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password)
      if (!(await verifyAdminAccess(result.user.email))) {
        await signOut(auth)
        return { ok: false, reason: 'Esse e-mail não tem permissão de admin.' }
      }
      return { ok: true }
    } catch (error) {
      return { ok: false, reason: friendlyAuthError(error) }
    }
  }

  async function loginWithOAuth(provider: FirebaseAuthProvider): Promise<LoginResult> {
    if (!isFirebaseConfigured || !auth) {
      return { ok: false, reason: 'Firebase não está configurado neste ambiente.' }
    }
    try {
      let result
      try {
        result = await signInWithPopup(auth, provider)
      } catch (popupError) {
        const code = (popupError as { code?: string })?.code
        if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
          await signInWithRedirect(auth, provider)
          return { ok: true }
        }
        throw popupError
      }
      if (!(await verifyAdminAccess(result.user.email))) {
        await signOut(auth)
        return { ok: false, reason: 'Esse e-mail não tem permissão de admin.' }
      }
      return { ok: true }
    } catch (error) {
      return { ok: false, reason: friendlyAuthError(error) }
    }
  }

  function loginWithGoogle(): Promise<LoginResult> {
    return loginWithOAuth(googleProvider)
  }

  function loginWithApple(): Promise<LoginResult> {
    return loginWithOAuth(appleProvider)
  }

  function logout() {
    if (auth) void signOut(auth)
  }

  const value: AuthContextValue = {
    isAuthenticated: user !== null,
    isOwner: isOwnerEmail(user?.email),
    isLoading,
    userEmail: user?.email ?? null,
    login,
    loginWithGoogle,
    loginWithApple,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
