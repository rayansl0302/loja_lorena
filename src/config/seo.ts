import { brand } from '@/config/brand'

/**
 * Domínio público do site. Precisa bater com o domínio real onde o site está
 * no ar — um site que se declara em og:url/canonical como um domínio
 * diferente do que está servindo é um padrão clássico usado por kits de
 * phishing, e dispara falso positivo em ferramentas como o Malwarebytes
 * Browser Guard. Troque para o domínio próprio (ex.: https://imperia.com.br)
 * assim que ele estiver configurado na Vercel — e não antes disso.
 */
export const SITE_URL = 'https://loja-lorena.vercel.app'

export const defaultSeo = {
  title: `${brand.name} — Moda feminina com atendimento no WhatsApp`,
  description: `${brand.name} by ${brand.founder} — moda feminina: vestidos, blusas, calças, saias e conjuntos. Atendimento e pedidos pelo WhatsApp. ${brand.city}.`,
  keywords: [
    brand.name,
    'moda feminina',
    'vestidos',
    'blusas',
    'calças',
    'saias',
    'conjuntos',
    brand.founder,
    'loja online WhatsApp',
    brand.city,
    'Salvador',
    'Lauro de Freitas',
  ].join(', '),
  image: `${SITE_URL}/logo-horizontal-lorena-loja.png`,
  locale: 'pt_BR',
  type: 'website',
}

export type SeoPageConfig = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

export const seoPages: Record<string, SeoPageConfig> = {
  '/': {
    path: '/',
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
  '/catalogo': {
    path: '/catalogo',
    title: `Catálogo — ${brand.name}`,
    description: `Confira o catálogo completo da ${brand.name}: vestidos, blusas, calças, saias e conjuntos. Filtre por tamanho, preço e categoria.`,
  },
  '/sobre': {
    path: '/sobre',
    title: `Sobre nós — ${brand.name}`,
    description: `Conheça a história da ${brand.name} e de ${brand.founder}: moda feminina com atendimento próximo pelo WhatsApp.`,
  },
  '/trocas-e-devolucoes': {
    path: '/trocas-e-devolucoes',
    title: `Trocas e devoluções — ${brand.name}`,
    description: `Política de trocas e devoluções da ${brand.name}. Saiba como solicitar troca pelo WhatsApp.`,
  },
  '/politica-de-privacidade': {
    path: '/politica-de-privacidade',
    title: `Política de privacidade — ${brand.name}`,
    description: `Como a ${brand.name} trata os dados de quem visita e compra na loja.`,
  },
  '/termos-de-uso': {
    path: '/termos-de-uso',
    title: `Termos de uso — ${brand.name}`,
    description: `Termos de uso do site e das compras na ${brand.name}.`,
  },
  '/fale-conosco': {
    path: '/fale-conosco',
    title: `Fale conosco — ${brand.name}`,
    description: `Fale com a ${brand.name} pelo WhatsApp ou Instagram (${brand.instagram}).`,
  },
  '/login': {
    path: '/login',
    title: `Área da lojista — ${brand.name}`,
    description: `Acesso restrito à área administrativa da ${brand.name}.`,
    noindex: true,
  },
  '/admin': {
    path: '/admin',
    title: `Painel — ${brand.name}`,
    description: `Painel administrativo da ${brand.name}.`,
    noindex: true,
  },
}

export function resolveSeo(pathname: string): SeoPageConfig {
  return seoPages[pathname] ?? {
    path: pathname,
    title: defaultSeo.title,
    description: defaultSeo.description,
  }
}
