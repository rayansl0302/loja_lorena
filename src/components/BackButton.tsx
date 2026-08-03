import { useLocation, useNavigate } from 'react-router-dom'
import { AltArrowLeftLinear } from 'solar-icon-set'

interface BackButtonProps {
  fallbackTo?: string
  label?: string
}

export function BackButton({ fallbackTo = '/', label = 'Voltar' }: BackButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()

  function handleBack() {
    // location.key só é 'default' quando ainda não houve navegação interna
    // nesta aba (ex.: acesso direto pela URL, recarregar a página). Nesse
    // caso não existe uma entrada de histórico "dentro do site" pra voltar.
    if (location.key !== 'default') {
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
