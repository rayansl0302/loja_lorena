import { motion } from 'framer-motion'
import { LegalPage } from '@/components/LegalPage'
import { WhatsAppIllustration } from '@/components/WhatsAppIllustration'
import { brand, whatsappLink } from '@/config/brand'

export function FaleConosco() {
  return (
    <LegalPage
      title="Fale conosco"
      intro="Estamos por perto para ajudar você a encontrar a peça certa."
    >
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-noir-700 bg-noir-900 p-8 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
          <WhatsAppIllustration className="h-full w-full" />
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
          <div>
            <h2 className="font-display text-xl text-cream-100">Atendimento via WhatsApp</h2>
            <p className="mt-1 text-sm text-cream-300">
              Resposta rápida para dúvidas sobre peças, tamanhos, entregas e pedidos.
            </p>
          </div>
          <motion.a
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            href={whatsappLink('Olá! Vim pelo site e gostaria de falar com vocês.')}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-noir-950 transition hover:bg-gold-400"
          >
            Falar no WhatsApp
          </motion.a>

          <div className="flex flex-col gap-1 border-t border-noir-700 pt-4 text-sm text-cream-300">
            <span>Instagram: {brand.instagram}</span>
            <span>{brand.city}</span>
          </div>
        </div>
      </div>
    </LegalPage>
  )
}
