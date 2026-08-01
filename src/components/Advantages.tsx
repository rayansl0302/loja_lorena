import { motion } from 'framer-motion'
import { BoxBold, ChatDotsBold, RestartBold, StarsBold } from 'solar-icon-set'

const advantages = [
  {
    Icon: BoxBold,
    title: 'Entrega rápida',
    description: 'Para todo o Brasil, com prazos combinados direto no WhatsApp.',
  },
  {
    Icon: ChatDotsBold,
    title: 'Atendimento no WhatsApp',
    description: 'Tira-dúvidas, provador virtual e acompanhamento do pedido em um só lugar.',
  },
  {
    Icon: RestartBold,
    title: 'Troca fácil',
    description: 'Até 7 dias corridos para trocar sua peça, sem burocracia.',
  },
  {
    Icon: StarsBold,
    title: 'Novidades semanais',
    description: 'Curadoria renovada toda semana para você nunca repetir o look.',
  },
]

export function Advantages() {
  return (
    <section id="vantagens" className="border-y border-noir-700 bg-noir-900 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {advantages.map(({ Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: index * 0.1 }}
            className="flex flex-col items-start gap-3 text-left"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <Icon size={22} />
            </span>
            <h3 className="font-display text-lg text-cream-100">{title}</h3>
            <p className="text-sm leading-relaxed text-cream-300">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
