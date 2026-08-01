import { brand } from '@/config/brand'

interface LogoProps {
  size?: 'compact' | 'large' | 'horizontal'
  className?: string
}

const LOGO_CONFIG: Record<
  NonNullable<LogoProps['size']>,
  { src: string; className: string; blend: boolean }
> = {
  compact: { src: '/Logo-imperia.jpeg', className: 'h-12 w-12 sm:h-14 sm:w-14', blend: true },
  large: { src: '/Logo-imperia.jpeg', className: 'h-28 w-28 sm:h-32 sm:w-32', blend: true },
  horizontal: {
    src: '/logo-horizontal-lorena-loja.png',
    className: 'h-12 w-auto sm:h-16',
    blend: false,
  },
}

export function Logo({ size = 'compact', className = '' }: LogoProps) {
  const { src, className: sizeClassName, blend } = LOGO_CONFIG[size]
  return (
    <img
      src={src}
      alt={`${brand.name} — ${brand.founder}`}
      className={`${sizeClassName} object-contain ${blend ? 'mix-blend-lighten' : ''} ${className}`}
    />
  )
}
