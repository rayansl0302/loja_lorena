import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseCircleLinear } from 'solar-icon-set'

interface CatalogFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function CatalogFilterDrawer({ isOpen, onClose, children }: CatalogFilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="filter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            key="filter-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Filtros do catálogo"
            className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col overflow-y-auto border-r border-noir-700 bg-noir-950 p-4 shadow-soft sm:p-6 lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg text-cream-100">Filtros</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar filtros"
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream-300 transition hover:bg-cream-100/10 hover:text-gold-400"
              >
                <CloseCircleLinear size={22} />
              </button>
            </div>

            {children}

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-8 rounded-full bg-gold-500 py-3 font-medium text-noir-950 transition hover:bg-gold-400"
            >
              Ver resultados
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
