import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import LogoMark from '../components/LogoMark'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { session, isAdmin, isLoading } = useAuth()
  const [modo, setModo] = useState('login') // 'login' | 'recuperar'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [correoEnviado, setCorreoEnviado] = useState(false)

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

  const handleRecuperar = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/actualizar-password`,
    })
    setSubmitting(false)
    if (recoveryError) {
      setError('No se pudo enviar el correo: ' + recoveryError.message)
      return
    }
    setCorreoEnviado(true)
  }

  return (
    <div className="min-h-screen bg-navy-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center text-white font-display text-xl mb-8">
          <LogoMark size={22} />
          ENERPETROL <span className="text-white/40 font-body text-sm font-normal">/ admin</span>
        </div>

        {modo === 'login' && (
          <>
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

              <div className="text-right mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setModo('recuperar')
                    setError('')
                    setCorreoEnviado(false)
                  }}
                  className="text-verde hover:text-verde-light text-xs font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg mt-2 transition-colors"
              >
                {submitting ? 'Ingresando…' : 'Ingresar'}
              </button>
            </form>

            <p className="text-white/30 text-xs text-center mt-6">
              Acceso exclusivo para administradores de Enerpetrol.
            </p>
          </>
        )}

        {modo === 'recuperar' && (
          <div className="bg-navy-card rounded-2xl p-8 border border-white/10">
            {!correoEnviado ? (
              <form onSubmit={handleRecuperar}>
                <p className="text-white/70 text-sm mb-5">
                  Escribe tu correo y te enviaremos un enlace para elegir una nueva contraseña.
                </p>
                <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Correo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-ink text-white rounded-lg px-4 py-3 mb-4 outline-none border border-white/10 focus:border-verde"
                  placeholder="admin@enerpetrol.hn"
                />

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {submitting ? 'Enviando…' : 'Enviar enlace de recuperación'}
                </button>

                <button
                  type="button"
                  onClick={() => setModo('login')}
                  className="w-full text-white/50 hover:text-white text-xs font-medium mt-4"
                >
                  Volver al inicio de sesión
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-verde font-display text-lg mb-2">Correo enviado</p>
                <p className="text-white/60 text-sm mb-5">
                  Revisa tu bandeja de entrada (y spam) y haz clic en el enlace para elegir tu nueva contraseña.
                </p>
                <button
                  onClick={() => setModo('login')}
                  className="text-verde hover:text-verde-light text-sm font-semibold"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
