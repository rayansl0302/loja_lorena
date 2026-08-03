import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase'
import { isRegisteredAdmin } from '@/lib/adminAccess'

type LoginResult = { ok: true } | { ok: false; reason: string }

interface AuthContextValue {
  isAuthenticated: boolean
  isOwner: boolean
  isLoading: boolean
  userEmail: string | null
  redirectError: string | null
  clearRedirectError: () => void
  login: (email: string, password: string) => Promise<LoginResult>
  loginWithGoogle: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const OWNER_EMAIL = String(import.meta.env.VITE_OWNER_EMAIL ?? '')
  .trim()
  .toLowerCase()

function isOwnerEmail(email: string | null | undefined): boolean {
  return Boolean(email) && OWNER_EMAIL.length > 0 && email!.toLowerCase() === OWNER_EMAIL
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
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Login cancelado.'
    case 'auth/unauthorized-domain':
      return 'Este domínio não está autorizado no Firebase Authentication.'
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet e tente novamente.'
    default:
      return 'Não foi possível entrar. Tente novamente.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [redirectError, setRedirectError] = useState<string | null>(null)

  const clearRedirectError = useCallback(() => setRedirectError(null), [])

  useEffect(() => {
    const authInstance = auth
    if (!isFirebaseConfigured || !authInstance) {
      setIsLoading(false)
      return
    }

    // Conclui o login por redirecionamento (signInWithRedirect), se a gente
    // acabou de voltar do accounts.google.com.
    getRedirectResult(authInstance)
      .then(async (result) => {
        if (result && !(await verifyAdminAccess(result.user.email))) {
          await signOut(authInstance)
          setRedirectError('Essa conta Google não tem permissão de admin.')
        }
      })
      .catch((error) => {
        setRedirectError(friendlyAuthError(error))
      })

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

  async function loginWithGoogle(): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      setRedirectError('Firebase não está configurado neste ambiente.')
      return
    }
    // Redireciona a própria aba pro Google, em vez de abrir popup — evita falhas
    // causadas por navegadores bloqueando a comunicação popup ↔ janela principal
    // (proteção contra cookies/armazenamento de terceiros).
    await signInWithRedirect(auth, googleProvider)
  }

  function logout() {
    if (auth) void signOut(auth)
  }

  const value: AuthContextValue = {
    isAuthenticated: user !== null,
    isOwner: isOwnerEmail(user?.email),
    isLoading,
    userEmail: user?.email ?? null,
    redirectError,
    clearRedirectError,
    login,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
