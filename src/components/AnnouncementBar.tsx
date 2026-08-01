import { BoxBold, LightningBold, ShieldCheckBold } from 'solar-icon-set'
import { brand } from '@/config/brand'

const items = [
  { Icon: BoxBold, label: 'Frete para todo o Brasil' },
  { Icon: LightningBold, label: `${brand.city}: entregas via Uber Flash` },
  { Icon: ShieldCheckBold, label: 'Compra 100% segura' },
]

function AnnouncementItems({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden={ariaHidden || undefined}>
      {items.map(({ Icon, label }) => (
        <span key={label} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <Icon size={14} className="text-gold-500" />
          {label}
        </span>
      ))}
    </div>
  )
}

export function AnnouncementBar() {
  return (
    <div className="border-b border-noir-700 bg-black">
      <div className="hidden sm:mx-auto sm:flex sm:max-w-6xl sm:items-center sm:justify-center sm:gap-10 sm:px-10 sm:py-2 sm:text-xs sm:font-medium sm:text-cream-300">
        {items.map(({ Icon, label }) => (
          <span key={label} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <Icon size={14} className="text-gold-500" />
            {label}
          </span>
        ))}
      </div>

      <div className="overflow-hidden py-2 text-xs font-medium text-cream-300 sm:hidden">
        <div className="animate-marquee-ltr flex w-max">
          <AnnouncementItems />
          <AnnouncementItems ariaHidden />
        </div>
      </div>
    </div>
  )
}
