export function WhatsAppIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="wa-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wa-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecd9a6" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>

      <circle cx="80" cy="80" r="76" fill="url(#wa-glow)" />

      {/* phone body */}
      <rect
        x="47"
        y="24"
        width="66"
        height="112"
        rx="14"
        fill="#141110"
        stroke="url(#wa-gold)"
        strokeWidth="2"
      />
      <rect x="55" y="36" width="50" height="76" rx="4" fill="#0b0908" />
      <rect x="72" y="120" width="16" height="3" rx="1.5" fill="url(#wa-gold)" opacity="0.7" />

      {/* chat bubble on screen */}
      <path
        d="M64 52h32a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H80l-9 8v-8h-7a8 8 0 0 1-8-8V60a8 8 0 0 1 8-8Z"
        fill="url(#wa-gold)"
      />
      <circle cx="72" cy="67" r="2.6" fill="#0b0908" />
      <circle cx="80" cy="67" r="2.6" fill="#0b0908" />
      <circle cx="88" cy="67" r="2.6" fill="#0b0908" />

      <rect x="60" y="94" width="40" height="4" rx="2" fill="#2b2521" />
      <rect x="60" y="102" width="26" height="4" rx="2" fill="#2b2521" />

      {/* sparkles */}
      <path
        d="M124 36l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z"
        fill="url(#wa-gold)"
      />
      <path
        d="M32 108l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z"
        fill="url(#wa-gold)"
        opacity="0.8"
      />
      <circle cx="30" cy="46" r="2.5" fill="url(#wa-gold)" opacity="0.6" />
    </svg>
  )
}
