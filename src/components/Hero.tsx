import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { AltArrowLeftLinear, AltArrowRightLinear, Bag2Bold, TagPriceBold } from 'solar-icon-set'
import { whatsappLink } from '@/config/brand'
import { useShop } from '@/store/ShopContext'
import { BannerIllustration } from '@/components/BannerIllustration'
import type { Banner } from '@/types/banner'
import type { Coupon } from '@/types/coupon'
import { isCouponExpired } from '@/utils/coupon'
import { toSafeImageSrc } from '@/utils/url'

const AUTOPLAY_INTERVAL = 6500

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const FALLBACK_BANNER: Banner = {
  id: 'fallback',
  title: 'Seu estilo. Seu império.',
  subtitle:
    'Curadoria autoral de vestidos, blusas, calças, saias e conjuntos — pensada para mulheres que não abrem mão de estilo no dia a dia.',
  ctaLabel: 'Falar no WhatsApp',
  ctaType: 'whatsapp',
  whatsappMessage: 'Quero ver as novidades',
  category: '',
  color: '#d4af37',
  icon: 'CrownBold',
  image: '',
  couponCode: '',
  active: true,
  order: 0,
}

function resolveCtaHref(banner: Banner): string {
  if (banner.ctaType === 'whatsapp') {
    return whatsappLink(banner.whatsappMessage || 'Olá! Vim pelo site.')
  }
  return banner.category ? `/catalogo?categoria=${encodeURIComponent(banner.category)}` : '/catalogo'
}

function couponHeadline(coupon: Coupon): string {
  if (coupon.discountType === 'percent') return `${coupon.value}% OFF`
  return `R$ ${coupon.value.toFixed(2).replace('.', ',')} OFF`
}

function couponContext(coupon: Coupon): string {
  return coupon.firstPurchaseOnly ? 'na primeira compra' : coupon.label || 'no seu pedido'
}

export function Hero() {
  const { activeBanners, coupons } = useShop()
  const slides = activeBanners.length > 0 ? activeBanners : [FALLBACK_BANNER]
  const [index, setIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [slides.length, index])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToPrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)
  const goToNext = () => setIndex((prev) => (prev + 1) % slides.length)

  const banner = slides[index]
  const ctaHref = resolveCtaHref(banner)
  const isWhatsapp = banner.ctaType === 'whatsapp'
  const bannerImage = toSafeImageSrc(banner.image)

  const bannerCoupon = useMemo(() => {
    if (!banner.couponCode) return null
    const coupon = coupons.find((c) => c.code === banner.couponCode)
    if (!coupon || coupon.active === false || isCouponExpired(coupon)) return null
    return coupon
  }, [banner.couponCode, coupons])

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-noir-950"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-noir-950 via-noir-900 to-noir-800" />
      {bannerImage ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${banner.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={bannerImage}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/55" />
            <div className="absolute inset-0 bg-noir-950/30" />
          </motion.div>
        </AnimatePresence>
      ) : null}
      <div className="absolute inset-0 bg-noise opacity-30" />

      {slides.length > 1 && (
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Banner anterior"
          className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream-100/20 bg-noir-900/50 text-cream-100 backdrop-blur-sm transition hover:border-gold-500 hover:text-gold-400 sm:left-6 sm:flex"
        >
          <AltArrowLeftLinear size={20} />
        </button>
      )}
      {slides.length > 1 && (
        <button
          type="button"
          onClick={goToNext}
          aria-label="Próximo banner"
          className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream-100/20 bg-noir-900/50 text-cream-100 backdrop-blur-sm transition hover:border-gold-500 hover:text-gold-400 sm:right-6 sm:flex"
        >
          <AltArrowRightLinear size={20} />
        </button>
      )}

      <motion.div style={{ y: blobY }} className="absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-16 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-gold-700/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-1/4 h-[26rem] w-[26rem] rounded-full bg-noir-600/30 blur-3xl" />
      </motion.div>


      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className={`relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-24 sm:gap-10 sm:px-10 sm:pt-28 lg:px-16 ${
          bannerImage ? '' : 'lg:grid-cols-[1.1fr_0.9fr]'
        }`}
      >
        <div className="flex flex-col items-start gap-5 sm:gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              variants={container}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="flex flex-col items-start gap-5 sm:gap-6"
            >
              <motion.h1
                variants={item}
                className="text-balance font-display text-3xl leading-[1.08] text-cream-100 sm:text-5xl lg:text-6xl"
              >
                {banner.title}
              </motion.h1>

              <motion.p
                variants={item}
                className="max-w-lg text-balance text-sm text-cream-300 sm:text-lg"
              >
                {banner.subtitle}
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-1 sm:gap-4 sm:pt-2">
                {isWhatsapp ? (
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -2 }}
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-noir-950 shadow-gold transition hover:bg-gold-400 sm:px-7 sm:py-3.5"
                  >
                    <Bag2Bold size={18} />
                    {banner.ctaLabel}
                  </motion.a>
                ) : (
                  <Link
                    to={ctaHref}
                    className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-noir-950 shadow-gold transition hover:-translate-y-0.5 hover:bg-gold-400 active:scale-95 sm:px-7 sm:py-3.5"
                  >
                    <Bag2Bold size={18} />
                    {banner.ctaLabel}
                  </Link>
                )}
              </motion.div>

              {bannerCoupon && (
                <motion.div
                  variants={item}
                  className="flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-noir-900/60 px-4 py-3 backdrop-blur-sm"
                >
                  <TagPriceBold size={22} className="shrink-0 text-gold-400" />
                  <p className="text-sm text-cream-100">
                    <span className="font-semibold text-gold-400">
                      {couponHeadline(bannerCoupon)}
                    </span>{' '}
                    {couponContext(bannerCoupon)}
                    <br />
                    <span className="text-xs text-cream-300">Use o cupom: {bannerCoupon.code}</span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <div className="flex items-center gap-3 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Banner anterior"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-100/20 text-cream-100 transition hover:border-gold-500 hover:text-gold-400 sm:hidden"
              >
                <AltArrowLeftLinear size={16} />
              </button>
              <div className="flex items-center gap-2">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setIndex(slideIndex)}
                    aria-label={`Ir para o banner ${slideIndex + 1}`}
                    aria-current={slideIndex === index}
                    className={`h-2 rounded-full transition-all ${
                      slideIndex === index
                        ? 'w-6 bg-gold-500'
                        : 'w-2 bg-cream-100/30 hover:bg-cream-100/50'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Próximo banner"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-100/20 text-cream-100 transition hover:border-gold-500 hover:text-gold-400 sm:hidden"
              >
                <AltArrowRightLinear size={16} />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!bannerImage ? (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              className="hidden aspect-square w-full max-w-md justify-self-center lg:flex"
            >
              <BannerIllustration icon={banner.icon} color={banner.color} className="h-full w-full" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
