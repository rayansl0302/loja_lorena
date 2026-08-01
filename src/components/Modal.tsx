import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseCircleLinear } from 'solar-icon-set'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[92svh] w-full max-w-xl flex-col rounded-t-3xl border border-noir-700 bg-noir-900 shadow-soft sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-noir-700 bg-noir-900 px-4 py-4 sm:px-8 sm:py-5">
              <h2 className="font-display text-lg text-cream-100 sm:text-xl">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream-300 transition hover:bg-cream-100/10 hover:text-gold-400"
              >
                <CloseCircleLinear size={22} />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-5 sm:px-8 sm:pb-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
