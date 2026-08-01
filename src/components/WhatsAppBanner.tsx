import { motion } from 'framer-motion'
import { brand } from '@/config/brand'
import { WhatsAppIllustration } from '@/components/WhatsAppIllustration'

export function WhatsAppBanner() {
  return (
    <section className="px-6 pb-20 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-gold-500/30 bg-noir-900 px-8 py-10 text-center sm:flex-row sm:text-left"
      >
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-28 w-28 shrink-0 sm:h-32 sm:w-32"
          >
            <WhatsAppIllustration className="h-full w-full" />
          </motion.div>
          <div>
            <h2 className="font-display text-2xl text-cream-100">
              Receba <span className="text-gold-400">novidades e promoções</span>
            </h2>
            <p className="mt-1 max-w-md text-sm text-cream-300">
              Participe do nosso grupo no WhatsApp e fique por dentro de tudo em primeira mão.
            </p>
          </div>
        </div>

        <motion.a
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -2 }}
          href={brand.whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-noir-950 shadow-gold transition hover:bg-gold-400"
        >
          Entrar no grupo
        </motion.a>
      </motion.div>
    </section>
  )
}
