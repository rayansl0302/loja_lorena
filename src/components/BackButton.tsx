import { useNavigate } from 'react-router-dom'
import { AltArrowLeftLinear } from 'solar-icon-set'

interface BackButtonProps {
  fallbackTo?: string
  label?: string
}

export function BackButton({ fallbackTo = '/', label = 'Voltar' }: BackButtonProps) {
  const navigate = useNavigate()

  // Sempre navega direto pro destino em vez de navigate(-1) ("página
  // anterior no histórico"). Todo uso deste botão aponta pra "voltar à
  // loja" — com navigate(-1), se o usuário passou por várias páginas
  // internas antes de chegar aqui, cada clique desfazia só um passo,
  // exigindo vários cliques pra realmente sair da página atual.
  function handleBack() {
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
