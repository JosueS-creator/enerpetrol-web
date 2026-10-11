import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminLogin from './pages/AdminLogin'
import AdminActualizarPassword from './pages/AdminActualizarPassword'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Estaciones from './pages/admin/Estaciones'
import Mapa from './pages/admin/Mapa'
import Clientes from './pages/admin/Clientes'
import Empresas from './pages/admin/Empresas'
import Facturas from './pages/admin/Facturas'
import Canjes from './pages/admin/Canjes'
import Referidos from './pages/admin/Referidos'
import Comentarios from './pages/admin/Comentarios'
import Banners from './pages/admin/Banners'
import Reportes from './pages/admin/Reportes'
import ProtectedRoute from './components/ProtectedRoute'

const Gasolineras = lazy(() => import('./pages/Gasolineras'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/gasolineras"
          element={
            <Suspense fallback={<main role="status" className="min-h-screen bg-navy-ink px-6 pt-32 text-center text-white">Cargando la sección comercial…</main>}>
              <Gasolineras />
            </Suspense>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/actualizar-password" element={<AdminActualizarPassword />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="estaciones" element={<Estaciones />} />
          <Route path="mapa" element={<Mapa />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="facturas" element={<Facturas />} />
          <Route path="canjes" element={<Canjes />} />
          <Route path="referidos" element={<Referidos />} />
          <Route path="comentarios" element={<Comentarios />} />
          <Route path="banners" element={<Banners />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
