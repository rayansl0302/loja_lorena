import type { ReactNode } from 'react'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackButton } from '@/components/BackButton'

interface LegalPageProps {
  title: string
  intro?: string
  children: ReactNode
}

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-noir-950">
      <AnnouncementBar />
      <Header variant="solid" />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-10 sm:py-16">
        <div className="mb-6">
          <BackButton />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Impéria</p>
        <h1 className="mt-2 font-display text-2xl text-cream-100 sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-xl text-sm text-cream-300">{intro}</p>}
        <div className="mt-8 flex flex-col gap-8 sm:mt-10">{children}</div>
      </section>
      <Footer />
    </div>
  )
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-t border-noir-700 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-lg text-cream-100">{heading}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-cream-300">{children}</div>
    </div>
  )
}
