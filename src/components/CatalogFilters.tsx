import { MagniferLinear } from 'solar-icon-set'
import type { Category, Size } from '@/types/product'
import type { CatalogFilters as CatalogFiltersType } from '@/types/filters'
import { categories, sizes } from '@/config/brand'

interface CatalogFiltersProps {
  filters: CatalogFiltersType
  onChange: (patch: Partial<CatalogFiltersType>) => void
  onClear: () => void
}

export function CatalogFilters({ filters, onChange, onClear }: CatalogFiltersProps) {
  function toggleCategory(category: Category) {
    onChange({
      categories: filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    })
  }

  function toggleSize(size: Size) {
    onChange({
      sizes: filters.sizes.includes(size)
        ? filters.sizes.filter((s) => s !== size)
        : [...filters.sizes, size],
    })
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-cream-100">Filtros</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-gold-400 underline-offset-4 hover:underline"
        >
          Limpar tudo
        </button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        Buscar
        <div className="relative">
          <MagniferLinear
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Nome ou descrição..."
            className="w-full rounded-xl border border-noir-700 bg-noir-800 py-2.5 pl-9 pr-3.5 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </div>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-cream-100">Categoria</span>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm text-cream-300">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 accent-gold-500"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-cream-100">Tamanho</span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              aria-pressed={filters.sizes.includes(size)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filters.sizes.includes(size)
                  ? 'border-gold-500 bg-gold-500 text-noir-950'
                  : 'border-noir-600 text-cream-300 hover:border-gold-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-cream-100">Faixa de preço</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            placeholder="Mín."
            aria-label="Preço mínimo"
            className="w-full rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
          <span className="text-cream-300" aria-hidden>
            —
          </span>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            placeholder="Máx."
            aria-label="Preço máximo"
            className="w-full rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={filters.onlyFeatured}
            onChange={(e) => onChange({ onlyFeatured: e.target.checked })}
            className="h-4 w-4 accent-gold-500"
          />
          Somente novidades
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={filters.onlyFixed}
            onChange={(e) => onChange({ onlyFixed: e.target.checked })}
            className="h-4 w-4 accent-gold-500"
          />
          Somente best-sellers
        </label>
      </div>
    </div>
  )
}
