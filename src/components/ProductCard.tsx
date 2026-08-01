import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '@/types/product'
import { formatBRL, messages, whatsappLink } from '@/config/brand'
import { getProductIcon } from '@/config/productIcons'
import { useShop } from '@/store/ShopContext'
import { toSafeImageSrc } from '@/utils/url'

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const { addToCart } = useShop()
  const Icon = getProductIcon(product.icon)
  const imageSrc = toSafeImageSrc(product.image)

  function handleBuyNow() {
    const message = messages.productInquiry(product.name)
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.article
      layout
      variants={cardVariants}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-noir-700 bg-noir-800/80 shadow-card"
    >
      <div
        className="relative flex aspect-[4/5] max-h-72 items-center justify-center overflow-hidden sm:h-56 sm:aspect-auto sm:max-h-none"
        style={{
          background: `linear-gradient(155deg, ${product.color}22, ${product.color}55)`,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Icon
            size={64}
            className="text-gold-400 transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-noir-950 sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            Novidade
          </span>
        )}
        {product.fixed && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-cream-100 sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
            Best-seller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gold-400">
            {product.category}
          </p>
          <h3 className="font-display text-lg text-cream-100">{product.name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-cream-300">{product.description}</p>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={`relative rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedSize === size
                  ? 'border-gold-500 bg-gold-500 text-noir-950'
                  : 'border-noir-600 text-cream-300 hover:border-gold-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-xl text-gold-400">{formatBRL(product.price)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product, selectedSize)}
            className="rounded-full border border-gold-500 py-2.5 text-sm font-medium text-gold-400 transition hover:bg-gold-500/10"
          >
            Adicionar
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
            className="rounded-full bg-gold-500 py-2.5 text-sm font-medium text-noir-950 transition hover:bg-gold-400"
          >
            Comprar
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
