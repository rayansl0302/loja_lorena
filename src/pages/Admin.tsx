import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RestartLinear, Logout3Linear, AddCircleBold, MagniferLinear } from 'solar-icon-set'
import { useAuth } from '@/store/AuthContext'
import { useShop } from '@/store/ShopContext'
import type { Product } from '@/types/product'
import type { Banner } from '@/types/banner'
import type { Coupon } from '@/types/coupon'
import { brand, categories } from '@/config/brand'
import { Modal } from '@/components/Modal'
import { ProductForm } from '@/components/ProductForm'
import { AdminProductList } from '@/components/AdminProductList'
import { BannerForm } from '@/components/BannerForm'
import { BannerList } from '@/components/BannerList'
import { CouponForm } from '@/components/CouponForm'
import { CouponList } from '@/components/CouponList'
import { BackButton } from '@/components/BackButton'

type StatusFilter = 'todos' | 'ativos' | 'inativos'
type CategoryFilter = 'Todas' | (typeof categories)[number]
type AdminTab = 'produtos' | 'banners' | 'cupons'

export function Admin() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    restoreSeed,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    moveBanner,
    restoreBannerSeed,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive,
    restoreCouponSeed,
  } = useShop()

  const [tab, setTab] = useState<AdminTab>('produtos')

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setProductModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todas')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isBannerModalOpen, setBannerModalOpen] = useState(false)

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [isCouponModalOpen, setCouponModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      if (term && !product.name.toLowerCase().includes(term)) return false
      if (categoryFilter !== 'Todas' && product.category !== categoryFilter) return false
      if (statusFilter === 'ativos' && product.active === false) return false
      if (statusFilter === 'inativos' && product.active !== false) return false
      return true
    })
  }, [products, search, categoryFilter, statusFilter])

  function openNewProductModal() {
    setEditingProduct(null)
    setProductModalOpen(true)
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product)
    setProductModalOpen(true)
  }

  function closeProductModal() {
    setProductModalOpen(false)
    setEditingProduct(null)
  }

  function handleProductSubmit(data: Omit<Product, 'id'>) {
    if (editingProduct) {
      updateProduct(editingProduct.id, data)
    } else {
      addProduct(data)
    }
    closeProductModal()
  }

  function handleDeleteProduct(id: string) {
    const product = products.find((p) => p.id === id)
    if (product && window.confirm(`Excluir permanentemente a peça "${product.name}"?`)) {
      deleteProduct(id)
    }
  }

  function handleRestoreSeed() {
    if (window.confirm('Isso substituirá o catálogo atual pelo catálogo padrão. Continuar?')) {
      restoreSeed()
      closeProductModal()
    }
  }

  function openNewBannerModal() {
    setEditingBanner(null)
    setBannerModalOpen(true)
  }

  function openEditBannerModal(banner: Banner) {
    setEditingBanner(banner)
    setBannerModalOpen(true)
  }

  function closeBannerModal() {
    setBannerModalOpen(false)
    setEditingBanner(null)
  }

  function handleBannerSubmit(data: Omit<Banner, 'id' | 'order'>) {
    if (editingBanner) {
      updateBanner(editingBanner.id, data)
    } else {
      addBanner(data)
    }
    closeBannerModal()
  }

  function handleDeleteBanner(id: string) {
    const banner = banners.find((b) => b.id === id)
    if (banner && window.confirm(`Excluir permanentemente o banner "${banner.title}"?`)) {
      deleteBanner(id)
    }
  }

  function handleRestoreBannerSeed() {
    if (window.confirm('Isso substituirá os banners atuais pelos banners padrão. Continuar?')) {
      restoreBannerSeed()
      closeBannerModal()
    }
  }

  function openNewCouponModal() {
    setEditingCoupon(null)
    setCouponModalOpen(true)
  }

  function openEditCouponModal(coupon: Coupon) {
    setEditingCoupon(coupon)
    setCouponModalOpen(true)
  }

  function closeCouponModal() {
    setCouponModalOpen(false)
    setEditingCoupon(null)
  }

  function handleCouponSubmit(data: Omit<Coupon, 'id'>) {
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, data)
    } else {
      addCoupon(data)
    }
    closeCouponModal()
  }

  function handleDeleteCoupon(id: string) {
    const coupon = coupons.find((c) => c.id === id)
    if (coupon && window.confirm(`Excluir permanentemente o cupom "${coupon.code}"?`)) {
      deleteCoupon(id)
    }
  }

  function handleRestoreCouponSeed() {
    if (window.confirm('Isso substituirá os cupons atuais pelos cupons padrão. Continuar?')) {
      restoreCouponSeed()
      closeCouponModal()
    }
  }

  function handleRestore() {
    if (tab === 'produtos') handleRestoreSeed()
    else if (tab === 'banners') handleRestoreBannerSeed()
    else handleRestoreCouponSeed()
  }

  function restoreLabel() {
    if (tab === 'produtos') return 'Restaurar catálogo'
    if (tab === 'banners') return 'Restaurar banners'
    return 'Restaurar cupons'
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-noir-950">
      <header className="border-b border-noir-700 bg-noir-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-10 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <BackButton label="Voltar à loja" fallbackTo="/" />
              <Link to="/" className="mt-3 block font-display text-lg text-cream-100">
                {brand.name}
              </Link>
              <p className="text-xs text-cream-300">Painel da lojista</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleRestore}
                className="flex items-center gap-2 rounded-full border border-noir-600 px-3 py-2 text-xs font-medium text-cream-300 transition hover:border-gold-500 sm:px-4 sm:text-sm"
              >
                <RestartLinear size={16} />
                <span className="hidden sm:inline">{restoreLabel()}</span>
                <span className="sm:hidden">Restaurar</span>
              </button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-xs font-medium text-noir-950 transition hover:bg-gold-400 sm:px-5 sm:text-sm"
              >
                <Logout3Linear size={16} />
                Sair
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4 sm:px-10">
          <button
            type="button"
            onClick={() => setTab('produtos')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === 'produtos'
                ? 'bg-gold-500 text-noir-950'
                : 'border border-noir-600 text-cream-300 hover:border-gold-500'
            }`}
          >
            Produtos
          </button>
          <button
            type="button"
            onClick={() => setTab('banners')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === 'banners'
                ? 'bg-gold-500 text-noir-950'
                : 'border border-noir-600 text-cream-300 hover:border-gold-500'
            }`}
          >
            Banners
          </button>
          <button
            type="button"
            onClick={() => setTab('cupons')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === 'cupons'
                ? 'bg-gold-500 text-noir-950'
                : 'border border-noir-600 text-cream-300 hover:border-gold-500'
            }`}
          >
            Cupons
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-10 sm:py-10">
        {tab === 'produtos' && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-xl text-cream-100">
                Peças cadastradas ({filteredProducts.length}/{products.length})
              </h1>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={openNewProductModal}
                className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-noir-950 transition hover:bg-gold-400"
              >
                <AddCircleBold size={18} />
                Nova peça
              </motion.button>
            </div>

            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <MagniferLinear
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome..."
                  className="w-full rounded-xl border border-noir-700 bg-noir-800 py-2.5 pl-9 pr-3.5 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-sm text-cream-100 outline-none transition focus:border-gold-500"
              >
                <option value="Todas">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-sm text-cream-100 outline-none transition focus:border-gold-500"
              >
                <option value="todos">Todos os status</option>
                <option value="ativos">Somente ativos</option>
                <option value="inativos">Somente inativos</option>
              </select>
            </div>

            <AdminProductList
              products={filteredProducts}
              onEdit={openEditProductModal}
              onDelete={handleDeleteProduct}
              onToggleActive={toggleProductActive}
            />
          </>
        )}

        {tab === 'banners' && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-xl text-cream-100">
                Banners cadastrados ({banners.length})
              </h1>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={openNewBannerModal}
                className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-noir-950 transition hover:bg-gold-400"
              >
                <AddCircleBold size={18} />
                Novo banner
              </motion.button>
            </div>

            <p className="mb-6 text-sm text-cream-300">
              Os banners ativos aparecem em carrossel no topo da vitrine, na ordem definida pelas
              setas abaixo.
            </p>

            <BannerList
              banners={banners}
              onEdit={openEditBannerModal}
              onDelete={handleDeleteBanner}
              onToggleActive={toggleBannerActive}
              onMove={moveBanner}
            />
          </>
        )}

        {tab === 'cupons' && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-xl text-cream-100">
                Cupons cadastrados ({coupons.length})
              </h1>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={openNewCouponModal}
                className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-noir-950 transition hover:bg-gold-400"
              >
                <AddCircleBold size={18} />
                Novo cupom
              </motion.button>
            </div>

            <p className="mb-6 text-sm text-cream-300">
              Os cupons ativos podem ser aplicados no carrinho. Ex.: MAE10 (10% off) ou
              PRIMEIRACOMPRA (primeira compra — confirme no WhatsApp).
            </p>

            <CouponList
              coupons={coupons}
              onEdit={openEditCouponModal}
              onDelete={handleDeleteCoupon}
              onToggleActive={toggleCouponActive}
            />
          </>
        )}
      </main>

      <Modal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        title={editingProduct ? 'Editar peça' : 'Nova peça'}
      >
        <ProductForm
          editingProduct={editingProduct}
          allProducts={products}
          onSubmit={handleProductSubmit}
          onCancel={closeProductModal}
        />
      </Modal>

      <Modal
        isOpen={isBannerModalOpen}
        onClose={closeBannerModal}
        title={editingBanner ? 'Editar banner' : 'Novo banner'}
      >
        <BannerForm
          editingBanner={editingBanner}
          onSubmit={handleBannerSubmit}
          onCancel={closeBannerModal}
        />
      </Modal>

      <Modal
        isOpen={isCouponModalOpen}
        onClose={closeCouponModal}
        title={editingCoupon ? 'Editar cupom' : 'Novo cupom'}
      >
        <CouponForm
          editingCoupon={editingCoupon}
          allCoupons={coupons}
          allProducts={products}
          onSubmit={handleCouponSubmit}
          onCancel={closeCouponModal}
        />
      </Modal>
    </div>
  )
}
