import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MagniferLinear, CloseCircleLinear } from 'solar-icon-set'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { CatalogFilters } from '@/components/CatalogFilters'
import { CatalogFilterDrawer } from '@/components/CatalogFilterDrawer'
import { BackButton } from '@/components/BackButton'
import { useShop } from '@/store/ShopContext'
import { categories } from '@/config/brand'
import {
  DEFAULT_CATALOG_FILTERS,
  type CatalogFilters as CatalogFiltersType,
  type SortOption,
} from '@/types/filters'
import type { Category, Product } from '@/types/product'

const SORT_LABELS: Record<SortOption, string> = {
  relevancia: 'Relevância',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
  novidades: 'Novidades primeiro',
  nome: 'Nome A-Z',
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'menor-preco':
      return sorted.sort((a, b) => a.price - b.price)
    case 'maior-preco':
      return sorted.sort((a, b) => b.price - a.price)
    case 'novidades':
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
    case 'nome':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    default:
      return sorted
  }
}

function initialFiltersFromParams(params: URLSearchParams): CatalogFiltersType {
  const categoria = params.get('categoria')
  const isValidCategory = (categories as string[]).includes(categoria ?? '')
  return {
    ...DEFAULT_CATALOG_FILTERS,
    categories: isValidCategory ? [categoria as Category] : [],
  }
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export function CatalogPage() {
  const { activeProducts: products } = useShop()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<CatalogFiltersType>(() =>
    initialFiltersFromParams(searchParams),
  )
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false)

  function updateFilters(patch: Partial<CatalogFiltersType>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function clearFilters() {
    setFilters(DEFAULT_CATALOG_FILTERS)
  }

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    const min = filters.minPrice ? Number(filters.minPrice) : null
    const max = filters.maxPrice ? Number(filters.maxPrice) : null

    const result = products.filter((product) => {
      if (search && !`${product.name} ${product.description}`.toLowerCase().includes(search)) {
        return false
      }
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }
      if (
        filters.sizes.length > 0 &&
        !product.sizes.some((size) => filters.sizes.includes(size))
      ) {
        return false
      }
      if (min !== null && product.price < min) return false
      if (max !== null && product.price > max) return false
      if (filters.onlyFeatured && !product.featured) return false
      if (filters.onlyFixed && !product.fixed) return false
      return true
    })

    return sortProducts(result, filters.sort)
  }, [products, filters])

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []

    if (filters.search.trim()) {
      chips.push({
        key: 'search',
        label: `"${filters.search.trim()}"`,
        onRemove: () => updateFilters({ search: '' }),
      })
    }
    filters.categories.forEach((category) => {
      chips.push({
        key: `cat-${category}`,
        label: category,
        onRemove: () =>
          updateFilters({ categories: filters.categories.filter((c) => c !== category) }),
      })
    })
    filters.sizes.forEach((size) => {
      chips.push({
        key: `size-${size}`,
        label: `Tam. ${size}`,
        onRemove: () => updateFilters({ sizes: filters.sizes.filter((s) => s !== size) }),
      })
    })
    if (filters.minPrice || filters.maxPrice) {
      chips.push({
        key: 'price',
        label: `${filters.minPrice ? `R$ ${filters.minPrice}` : '...'} – ${
          filters.maxPrice ? `R$ ${filters.maxPrice}` : '...'
        }`,
        onRemove: () => updateFilters({ minPrice: '', maxPrice: '' }),
      })
    }
    if (filters.onlyFeatured) {
      chips.push({
        key: 'featured',
        label: 'Novidades',
        onRemove: () => updateFilters({ onlyFeatured: false }),
      })
    }
    if (filters.onlyFixed) {
      chips.push({
        key: 'fixed',
        label: 'Best-sellers',
        onRemove: () => updateFilters({ onlyFixed: false }),
      })
    }
    return chips
  }, [filters])

  return (
    <div className="min-h-screen bg-noir-950">
      <AnnouncementBar />
      <Header variant="solid" />

      <section className="border-b border-noir-700 bg-noir-900 px-4 py-8 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <BackButton />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Catálogo completo
          </p>
          <h1 className="mt-2 font-display text-2xl text-cream-100 sm:text-4xl">
            Todas as nossas peças
          </h1>
          <p className="mt-2 max-w-xl text-sm text-cream-300">
            Filtre por categoria, tamanho e preço para encontrar a peça perfeita para você.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-10 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden self-start lg:block">
            <div className="sticky top-32 max-h-[calc(100svh-9rem)] w-full overflow-y-auto rounded-3xl border border-noir-700 bg-noir-900 p-6 shadow-card">
              <CatalogFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm text-cream-300" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? 'peça encontrada' : 'peças encontradas'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(true)}
                  className="rounded-full border border-noir-600 px-4 py-2 text-sm font-medium text-cream-300 transition hover:border-gold-500 lg:hidden"
                >
                  Filtros
                </button>
                <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-cream-300 sm:flex-none">
                  <span className="shrink-0">Ordenar</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
                    className="min-w-0 flex-1 rounded-xl border border-noir-700 bg-noir-800 px-3 py-2 text-sm text-cream-100 outline-none transition focus:border-gold-500 sm:flex-none"
                  >
                    {Object.entries(SORT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1.5 text-xs font-medium text-gold-400 transition hover:bg-gold-500/25"
                  >
                    {chip.label}
                    <CloseCircleLinear size={14} aria-hidden />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-gold-400 underline-offset-4 hover:underline"
                >
                  Limpar tudo
                </button>
              </div>
            )}

            {filtered.length > 0 ? (
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-noir-600 py-20 text-center">
                <MagniferLinear size={32} className="text-cream-300" />
                <p className="font-display text-lg text-cream-100">Nenhuma peça encontrada</p>
                <p className="max-w-xs text-sm text-cream-300">
                  Tente ajustar os filtros ou limpar a busca para ver mais opções.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 rounded-full border border-gold-500 px-5 py-2 text-sm font-medium text-gold-400 transition hover:bg-gold-500/10"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CatalogFilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <CatalogFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
      </CatalogFilterDrawer>

      <Footer />
    </div>
  )
}
