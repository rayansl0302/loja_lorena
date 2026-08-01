import { AnimatePresence, motion } from 'framer-motion'
import { PenNewSquareLinear, TrashBinTrashLinear, EyeBold, EyeClosedBold } from 'solar-icon-set'
import type { Coupon } from '@/types/coupon'
import { formatBRL } from '@/config/brand'
import { isCouponExpired } from '@/utils/coupon'

interface CouponListProps {
  coupons: Coupon[]
  onEdit: (coupon: Coupon) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}

function scopeLabel(coupon: Coupon): string {
  if (coupon.scope === 'cart') return 'Todo o carrinho'
  if (coupon.scope === 'category') return `Categoria: ${coupon.category || '—'}`
  return `${coupon.productIds.length} peça(s)`
}

function discountLabel(coupon: Coupon): string {
  if (coupon.discountType === 'percent') return `${coupon.value}%`
  return formatBRL(coupon.value)
}

export function CouponList({ coupons, onEdit, onDelete, onToggleActive }: CouponListProps) {
  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {coupons.map((coupon) => {
          const isActive = coupon.active !== false
          const expired = isCouponExpired(coupon)
          return (
            <motion.li
              key={coupon.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isActive ? 1 : 0.55, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium tracking-wide text-cream-100">{coupon.code}</p>
                  <span className="text-sm text-cream-300">{coupon.label}</span>
                  {!isActive && (
                    <span className="rounded-full bg-noir-700 px-2 py-0.5 text-[10px] font-medium text-cream-300">
                      Inativo
                    </span>
                  )}
                  {expired && (
                    <span className="rounded-full bg-wine-600/20 px-2 py-0.5 text-[10px] font-medium text-wine-600">
                      Expirado
                    </span>
                  )}
                  {coupon.firstPurchaseOnly && (
                    <span className="rounded-full border border-gold-500 px-2 py-0.5 text-[10px] font-medium text-gold-400">
                      1ª compra
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-cream-300">
                  {discountLabel(coupon)} · {scopeLabel(coupon)}
                  {coupon.expiresAt ? ` · até ${coupon.expiresAt.split('-').reverse().join('/')}` : ''}
                </p>
              </div>

              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onToggleActive(coupon.id)}
                  aria-label={isActive ? `Desativar ${coupon.code}` : `Ativar ${coupon.code}`}
                  title={isActive ? 'Desativar' : 'Ativar'}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
                >
                  {isActive ? <EyeBold size={16} /> : <EyeClosedBold size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(coupon)}
                  aria-label={`Editar ${coupon.code}`}
                  title="Editar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
                >
                  <PenNewSquareLinear size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(coupon.id)}
                  aria-label={`Excluir ${coupon.code}`}
                  title="Excluir permanentemente"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-cream-300 transition hover:border-noir-600 hover:text-wine-600"
                >
                  <TrashBinTrashLinear size={16} />
                </button>
              </div>
            </motion.li>
          )
        })}
      </AnimatePresence>

      {coupons.length === 0 && (
        <p className="py-10 text-center text-sm text-cream-300">Nenhum cupom cadastrado ainda.</p>
      )}
    </ul>
  )
}
