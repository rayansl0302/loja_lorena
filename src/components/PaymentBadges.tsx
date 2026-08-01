import { QRCodeBold, CardBold, BillListBold } from 'solar-icon-set'

const PIX_TEAL = '#32bcad'
const CARD_NETWORKS = ['Visa', 'Mastercard', 'Elo']

export function PaymentBadges() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
          style={{ backgroundColor: `${PIX_TEAL}22`, color: PIX_TEAL }}
        >
          <QRCodeBold size={16} />
          Pix
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-noir-700 bg-noir-900 px-3 py-2 text-xs text-cream-300">
          <CardBold size={16} className="text-gold-400" />
          Cartão de crédito
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-noir-700 bg-noir-900 px-3 py-2 text-xs text-cream-300">
          <BillListBold size={16} className="text-gold-400" />
          Boleto
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5" aria-label="Bandeiras aceitas">
        {CARD_NETWORKS.map((network) => (
          <span
            key={network}
            className="rounded border border-noir-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cream-300"
          >
            {network}
          </span>
        ))}
      </div>
    </div>
  )
}
