import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircleBold, DangerCircleBold, InfoCircleBold } from 'solar-icon-set'
import { useShop, type ToastType } from '@/store/ShopContext'

const ICONS: Record<ToastType, typeof CheckCircleBold> = {
  success: CheckCircleBold,
  error: DangerCircleBold,
  info: InfoCircleBold,
}

export function Toast() {
  const { toast } = useShop()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4 sm:bottom-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-noir-700 bg-noir-900 px-5 py-3 text-sm font-medium text-cream-100 shadow-soft"
          >
            {(() => {
              const Icon = ICONS[toast.type] ?? CheckCircleBold
              return <Icon size={20} className="shrink-0 text-gold-400" />
            })()}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
