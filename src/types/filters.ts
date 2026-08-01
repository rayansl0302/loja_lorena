import type { Category, Size } from './product'

export type SortOption = 'relevancia' | 'menor-preco' | 'maior-preco' | 'novidades' | 'nome'

export interface CatalogFilters {
  search: string
  categories: Category[]
  sizes: Size[]
  minPrice: string
  maxPrice: string
  onlyFeatured: boolean
  onlyFixed: boolean
  sort: SortOption
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  search: '',
  categories: [],
  sizes: [],
  minPrice: '',
  maxPrice: '',
  onlyFeatured: false,
  onlyFixed: false,
  sort: 'relevancia',
}
