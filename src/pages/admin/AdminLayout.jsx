import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Fuel, LayoutDashboard, MapPin, Users, Receipt, BarChart3, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/useAuth'

const NAV = [
  { to: '/admin', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/admin/estaciones', label: 'Estaciones', icon: MapPin },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/facturas', label: 'Facturas', icon: Receipt },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { perfil } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-concrete flex">
      <aside className="w-64 bg-navy-ink flex flex-col shrink-0">
        <div className="flex items-center gap-2 text-white font-display text-lg px-6 py-6 border-b border-white/10">
          <Fuel size={20} className="text-verde" />
          ENERPETROL
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-verde text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-white text-sm font-medium truncate">{perfil?.nombre || 'Administrador'}</p>
            <p className="text-white/40 text-xs">Super admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
