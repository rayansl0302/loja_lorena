import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HangerBold, TshirtBold, Hanger2Bold, SkirtBold, CrownBold } from 'solar-icon-set'
import type { Category } from '@/types/product'

const CATEGORY_VISUALS: Record<Category, { Icon: typeof HangerBold; color: string }> = {
  Vestidos: { Icon: HangerBold, color: '#c9a227' },
  Blusas: { Icon: TshirtBold, color: '#d9b872' },
  Calças: { Icon: Hanger2Bold, color: '#2b2521' },
  Saias: { Icon: SkirtBold, color: '#a8841e' },
  Conjuntos: { Icon: CrownBold, color: '#ecd9a6' },
}

const categoryList = Object.keys(CATEGORY_VISUALS) as Category[]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex flex-col gap-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Categorias</p>
        <h2 className="font-display text-3xl text-cream-100 sm:text-4xl">Compre por categoria</h2>
      </motion.div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {categoryList.map((category) => {
          const { Icon, color } = CATEGORY_VISUALS[category]
          return (
            <motion.div key={category} variants={item} whileHover={{ y: -4 }}>
              <Link
                to={`/catalogo?categoria=${encodeURIComponent(category)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-6 text-center transition hover:border-gold-500"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(155deg, ${color}22, ${color}55)` }}
                >
                  <Icon size={28} className="text-gold-400" />
                </span>
                <span className="font-display text-sm text-cream-100">{category}</span>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
