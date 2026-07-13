import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Estaciones from './pages/admin/Estaciones'
import Clientes from './pages/admin/Clientes'
import Facturas from './pages/admin/Facturas'
import Referidos from './pages/admin/Referidos'
import Reportes from './pages/admin/Reportes'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/login" element={<AdminLogin />} />
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
          <Route path="clientes" element={<Clientes />} />
          <Route path="facturas" element={<Facturas />} />
          <Route path="referidos" element={<Referidos />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
