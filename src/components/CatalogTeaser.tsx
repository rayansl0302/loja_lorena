import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useShop } from '@/store/ShopContext'
import { ProductCard } from '@/components/ProductCard'
import { MAX_HIGHLIGHTS } from '@/config/brand'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export function CatalogTeaser() {
  const { activeProducts: products } = useShop()

  let highlights = products.filter((product) => product.highlight).slice(0, MAX_HIGHLIGHTS)
  if (highlights.length === 0) {
    highlights = products.filter((product) => product.featured).slice(0, MAX_HIGHLIGHTS)
  }
  if (highlights.length === 0) {
    highlights = products.slice(0, MAX_HIGHLIGHTS)
  }

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex flex-col gap-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Catálogo</p>
        <h2 className="font-display text-3xl text-cream-100 sm:text-4xl">Destaques da semana</h2>
        <p className="max-w-lg text-sm text-cream-300">
          Uma seleção rápida do que está em alta. Para ver tudo, com filtros por tamanho, preço e
          categoria, explore o catálogo completo.
        </p>
      </motion.div>

      {highlights.length > 0 ? (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {highlights.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <p className="rounded-3xl border border-dashed border-noir-600 py-16 text-center text-sm text-cream-300">
          Nenhuma peça em destaque no momento. Explore o catálogo completo para ver tudo.
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/catalogo"
            className="inline-block rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-noir-950 shadow-card transition hover:bg-gold-400"
          >
            Ver mais peças
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
