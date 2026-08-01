import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CameraBold, HeartBold, StarBold, CrownBold, TshirtBold, SkirtBold } from 'solar-icon-set'
import { brand } from '@/config/brand'

const FEED_PREVIEW = [
  { Icon: HeartBold, color: '#d4af37' },
  { Icon: CrownBold, color: '#f5d37a' },
  { Icon: TshirtBold, color: '#b8860b' },
  { Icon: SkirtBold, color: '#7a5200' },
  { Icon: StarBold, color: '#d4af37' },
  { Icon: HeartBold, color: '#f5d37a' },
]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

const LIGHTWIDGET_SCRIPT = 'https://cdn.lightwidget.com/widgets/lightwidget.js'

function LightWidgetEmbed({ widgetId }: { widgetId: string }) {
  useEffect(() => {
    const existing = document.querySelector(`script[src="${LIGHTWIDGET_SCRIPT}"]`)
    if (existing) return

    const script = document.createElement('script')
    script.src = LIGHTWIDGET_SCRIPT
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <iframe
      src={`https://lightwidget.com/widgets/${widgetId}.html`}
      scrolling="no"
      allowTransparency
      title={`Feed do Instagram ${brand.instagram}`}
      className="lightwidget-widget w-full overflow-hidden border-0"
    />
  )
}

function FeedFallback() {
  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6"
    >
      {FEED_PREVIEW.map(({ Icon, color }, index) => (
        <motion.a
          key={index}
          variants={item}
          whileHover={{ scale: 1.05 }}
          href={brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-noir-700"
          style={{ background: `linear-gradient(155deg, ${color}22, ${color}55)` }}
          aria-label="Abrir Instagram"
        >
          <Icon
            size={28}
            className="text-gold-400 transition-transform duration-300 group-hover:scale-110"
          />
        </motion.a>
      ))}
    </motion.div>
  )
}

export function InstagramSection() {
  const widgetId = brand.lightwidgetId.trim()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-10 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 sm:flex-row sm:items-end"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Instagram
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream-100 sm:text-4xl">
            Siga a loja no Instagram
          </h2>
          <p className="mt-2 max-w-lg text-sm text-cream-300">
            Bastidores, novidades em primeira mão e looks do dia em {brand.instagram}.
          </p>
        </div>

        <motion.a
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -2 }}
          href={brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-noir-950 shadow-gold transition hover:bg-gold-400 sm:px-7 sm:py-3.5"
        >
          <CameraBold size={18} />
          Seguir no Instagram
        </motion.a>
      </motion.div>

      {widgetId ? (
        <div className="w-full overflow-hidden rounded-2xl">
          <LightWidgetEmbed widgetId={widgetId} />
        </div>
      ) : (
        <FeedFallback />
      )}
    </section>
  )
}
