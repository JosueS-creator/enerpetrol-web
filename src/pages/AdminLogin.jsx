import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fuel, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { session, isAdmin, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && session && isAdmin) {
    navigate('/admin', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (authError) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-navy-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center text-white font-display text-xl mb-8">
          <Fuel size={22} className="text-verde" />
          ENERPETROL <span className="text-white/40 font-body text-sm font-normal">/ admin</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy-card rounded-2xl p-8 border border-white/10">
          <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-navy-ink text-white rounded-lg px-4 py-3 mb-5 outline-none border border-white/10 focus:border-verde"
            placeholder="admin@enerpetrol.hn"
          />

          <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Contraseña</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-ink text-white rounded-lg px-4 py-3 pr-11 outline-none border border-white/10 focus:border-verde"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-verde hover:bg-verde-light disabled:opacity-60 text-white font-semibold py-3 rounded-lg mt-4 transition-colors"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="text-white/30 text-xs text-center mt-6">
          Acceso exclusivo para administradores de Enerpetrol.
        </p>
      </div>
    </div>
  )
}
