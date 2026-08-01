import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bag2Bold } from 'solar-icon-set'
import { useShop } from '@/store/ShopContext'

const HIDDEN_PATHS = ['/admin', '/login']

export function FloatingCartButton() {
  const { cartCount, openDrawer } = useShop()
  const { pathname } = useLocation()

  if (HIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
    return null
  }

  return (
    <motion.button
      type="button"
      onClick={openDrawer}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -2 }}
      aria-label="Abrir carrinho"
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-noir-950 shadow-gold transition hover:bg-gold-400 sm:bottom-8 sm:right-8"
    >
      <Bag2Bold size={24} />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-noir-950 px-1 text-[11px] font-bold text-gold-400">
          {cartCount}
        </span>
      )}
    </motion.button>
  )
}
