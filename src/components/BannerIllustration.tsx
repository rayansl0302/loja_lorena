import { motion } from 'framer-motion'
import { StarBold } from 'solar-icon-set'
import { getBannerIcon } from '@/config/bannerIcons'

interface BannerIllustrationProps {
  icon: string
  color: string
  className?: string
}

export function BannerIllustration({ icon, color, className = '' }: BannerIllustrationProps) {
  const Icon = getBannerIcon(icon)

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${color}33, transparent 70%)` }}
        aria-hidden
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[8%] rounded-full border border-dashed"
        style={{ borderColor: `${color}66` }}
        aria-hidden
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[16%] rounded-full border"
        style={{ borderColor: `${color}33` }}
        aria-hidden
      />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex h-[55%] w-[55%] items-center justify-center rounded-full shadow-gold"
        style={{ background: `linear-gradient(155deg, ${color}55, ${color}CC)` }}
      >
        <Icon size={72} className="text-noir-950" />
      </motion.div>

      <StarBold size={20} className="absolute right-[10%] top-[14%] text-gold-400" aria-hidden />
      <StarBold size={12} className="absolute bottom-[18%] left-[12%] text-gold-300" aria-hidden />
    </div>
  )
}
