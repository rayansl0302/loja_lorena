import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { defaultSeo, resolveSeo, SITE_URL } from '@/config/seo'
import { brand } from '@/config/brand'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = resolveSeo(pathname)
    const url = `${SITE_URL}${page.path === '/' ? '' : page.path}`
    const title = page.title
    const description = page.description

    document.title = title
    document.documentElement.lang = 'pt-BR'

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', defaultSeo.keywords)
    upsertMeta('name', 'robots', page.noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('name', 'author', brand.founder)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', defaultSeo.type)
    upsertMeta('property', 'og:locale', defaultSeo.locale)
    upsertMeta('property', 'og:site_name', brand.name)
    upsertMeta('property', 'og:image', defaultSeo.image)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', defaultSeo.image)
    upsertLink('canonical', url)

    upsertJsonLd('seo-jsonld-org', {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: brand.name,
      description: defaultSeo.description,
      url: SITE_URL,
      image: defaultSeo.image,
      telephone: brand.whatsappNumber,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Salvador',
        addressRegion: 'BA',
        addressCountry: 'BR',
      },
      sameAs: [brand.instagramUrl],
      founder: {
        '@type': 'Person',
        name: brand.founder,
      },
    })
  }, [pathname])

  return null
}
