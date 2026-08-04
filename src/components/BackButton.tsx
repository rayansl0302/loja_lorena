import { useNavigate } from 'react-router-dom'
import { AltArrowLeftLinear } from 'solar-icon-set'

interface BackButtonProps {
  fallbackTo?: string
  label?: string
}

export function BackButton({ fallbackTo = '/', label = 'Voltar' }: BackButtonProps) {
  const navigate = useNavigate()

  function handleBack() {
    // O React Router guarda um índice interno em window.history.state.idx:
    // ele avança a cada navegação por "push" (link/navigate normal), mas
    // fica parado em navegações por "replace" (ex.: o ProtectedRoute
    // mandando pra /login sem estar autenticado). Se idx > 0, existe uma
    // entrada anterior de dentro do site pra voltar com segurança; se for
    // 0, não existe (acesso direto pela URL, redirect por replace etc.) e
    // "voltar" precisa ir pro fallback em vez de navigate(-1).
    const idx = (window.history.state as { idx?: number } | null)?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }
    navigate(fallbackTo)
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 rounded-full border border-noir-600 px-3.5 py-2 text-sm font-medium text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
    >
      <AltArrowLeftLinear size={16} aria-hidden />
      {label}
    </button>
  )
}
