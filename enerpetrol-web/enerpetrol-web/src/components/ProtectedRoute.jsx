import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-ink flex items-center justify-center">
        <div className="text-white font-mono text-sm tracking-widest animate-pulse">
          VERIFICANDO ACCESO…
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy-ink flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="font-display text-2xl text-white mb-2">Acceso restringido</p>
          <p className="text-white/60 font-body text-sm">
            Tu cuenta no tiene permisos de administrador. Si crees que esto es un error,
            contacta al equipo de Enerpetrol.
          </p>
        </div>
      </div>
    )
  }

  return children
}
