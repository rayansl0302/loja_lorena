import { Route, Routes } from 'react-router-dom'
import { ShopProvider } from '@/store/ShopContext'
import { AuthProvider } from '@/store/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toast } from '@/components/Toast'
import { CartDrawer } from '@/components/CartDrawer'
import { FloatingCartButton } from '@/components/FloatingCartButton'
import { Seo } from '@/components/Seo'
import { Home } from '@/pages/Home'
import { CatalogPage } from '@/pages/CatalogPage'
import { Login } from '@/pages/Login'
import { Admin } from '@/pages/Admin'
import { Sobre } from '@/pages/Sobre'
import { TrocasDevolucoes } from '@/pages/TrocasDevolucoes'
import { PoliticaPrivacidade } from '@/pages/PoliticaPrivacidade'
import { TermosDeUso } from '@/pages/TermosDeUso'
import { FaleConosco } from '@/pages/FaleConosco'

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <ScrollToTop />
        <Seo />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/trocas-e-devolucoes" element={<TrocasDevolucoes />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/fale-conosco" element={<FaleConosco />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
        <FloatingCartButton />
        <CartDrawer />
        <Toast />
      </ShopProvider>
    </AuthProvider>
  )
}
