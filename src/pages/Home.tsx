import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Advantages } from '@/components/Advantages'
import { CategoryShowcase } from '@/components/CategoryShowcase'
import { CatalogTeaser } from '@/components/CatalogTeaser'
import { WhatsAppBanner } from '@/components/WhatsAppBanner'
import { Footer } from '@/components/Footer'

export function Home() {
  return (
    <div className="min-h-screen bg-noir-950">
      <AnnouncementBar />
      <div className="relative">
        <Header />
        <Hero />
      </div>
      <Advantages />
      <CategoryShowcase />
      <CatalogTeaser />
      <WhatsAppBanner />
      <Footer />
    </div>
  )
}
