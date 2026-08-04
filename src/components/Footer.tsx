import { Link } from 'react-router-dom'
import { brand, whatsappLink } from '@/config/brand'
import { Logo } from '@/components/Logo'
import { PaymentBadges } from '@/components/PaymentBadges'

const infoLinks = [
  { label: 'Sobre nós', to: '/sobre' },
  { label: 'Trocas e devoluções', to: '/trocas-e-devolucoes' },
  { label: 'Política de privacidade', to: '/politica-de-privacidade' },
  { label: 'Termos de uso', to: '/termos-de-uso' },
  { label: 'Fale conosco', to: '/fale-conosco' },
]

export function Footer() {
  return (
    <footer className="border-t border-noir-700 bg-black py-14 text-cream-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4">
            <Logo size="large" className="h-20 w-20 sm:h-24 sm:w-24" />
            <div>
              <p className="font-display text-2xl text-cream-100">{brand.name}</p>
              <p className="mt-1 max-w-sm text-sm text-cream-300/80">{brand.tagline}</p>
              <div className="mt-2 flex flex-col gap-0.5 text-xs text-cream-300/70">
                <a
                  href={brand.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-gold-400"
                >
                  {brand.instagram}
                </a>
                <span>{brand.city}</span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <p className="mb-1 font-display text-sm uppercase tracking-[0.15em] text-gold-400">
              Informações
            </p>
            {infoLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-gold-400">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="font-display text-sm uppercase tracking-[0.15em] text-gold-400">
              Formas de pagamento
            </p>
            <PaymentBadges />
            <p className="max-w-[220px] text-xs text-cream-300/60">
              Pagamento combinado diretamente com a gente pelo WhatsApp, na finalização do pedido.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse items-start gap-4 border-t border-noir-700 pt-6 text-xs text-cream-300/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.
          </span>
          <Link to="/login" className="underline-offset-4 transition hover:text-gold-400 hover:underline">
            Área da lojista
          </Link>
        </div>

        <p className="text-center text-[11px] text-cream-300/40 sm:text-left">
          Desenvolvido por{' '}
          <a
            href={whatsappLink('Olá, Rayan! Vi o site da Impéria e gostaria de falar sobre um projeto.', '5571996566277')}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-gold-400 hover:underline"
          >
            Rayan Silva Lima
          </a>
        </p>
      </div>
    </footer>
  )
}
