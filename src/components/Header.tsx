import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HamburgerMenuLinear, CloseCircleLinear } from 'solar-icon-set'
import { Logo } from '@/components/Logo'

interface HeaderProps {
  variant?: 'transparent' | 'solid'
}

export function Header({ variant = 'transparent' }: HeaderProps) {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const isSolid = variant === 'solid'

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header
      className={
        isSolid
          ? 'sticky top-0 z-30 border-b border-noir-700 bg-noir-950/95 backdrop-blur'
          : 'absolute inset-x-0 top-0 z-30'
      }
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-10 sm:py-6">
        <Link to="/" onClick={closeMenu} className="min-w-0 shrink">
          <Logo size="horizontal" />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-sm font-medium text-cream-300 md:flex">
            <Link to="/catalogo" className="transition hover:text-gold-400">
              Catálogo
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-100/10 text-cream-100 backdrop-blur-md transition hover:bg-cream-100/20 md:hidden"
          >
            {isMenuOpen ? <CloseCircleLinear size={20} /> : <HamburgerMenuLinear size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-noir-700/60 bg-noir-950/95 backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <Link
                to="/catalogo"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-cream-100 transition hover:bg-cream-100/10 hover:text-gold-400"
              >
                Catálogo
              </Link>
              <Link
                to="/sobre"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-cream-100 transition hover:bg-cream-100/10 hover:text-gold-400"
              >
                Sobre
              </Link>
              <Link
                to="/fale-conosco"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-cream-100 transition hover:bg-cream-100/10 hover:text-gold-400"
              >
                Fale conosco
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
