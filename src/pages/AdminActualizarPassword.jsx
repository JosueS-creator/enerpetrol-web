import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import LogoMark from '../components/LogoMark'

export default function AdminActualizarPassword() {
  const navigate = useNavigate()
  const [sesionValida, setSesionValida] = useState(null) // null = verificando, true/false
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    // Cuando el usuario llega desde el link del correo, Supabase crea una sesión
    // temporal de tipo "recovery". Verificamos que exista antes de mostrar el formulario.
    supabase.auth.getSession().then(({ data }) => {
      setSesionValida(!!data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSesionValida(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setEnviando(false)

    if (updateError) {
      setError('No se pudo actualizar la contraseña: ' + updateError.message)
      return
    }
    setExito(true)
    setTimeout(() => navigate('/admin/login', { replace: true }), 2500)
  }

  return (
    <div className="min-h-screen bg-navy-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center text-white font-display text-xl mb-8">
          <LogoMark size={22} />
          ENERPETROL <span className="text-white/40 font-body text-sm font-normal">/ admin</span>
        </div>

        <div className="bg-navy-card rounded-2xl p-8 border border-white/10">
          {sesionValida === null && (
            <p className="text-white/60 text-sm text-center">Verificando enlace…</p>
          )}

          {sesionValida === false && (
            <div className="text-center">
              <p className="text-white font-display text-lg mb-2">Enlace inválido o vencido</p>
              <p className="text-white/60 text-sm mb-5">
                Solicita un nuevo enlace de recuperación desde la pantalla de inicio de sesión.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="text-verde hover:text-verde-light text-sm font-semibold"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}

          {sesionValida === true && !exito && (
            <form onSubmit={handleSubmit}>
              <p className="text-white/70 text-sm mb-5">Elige tu nueva contraseña.</p>

              <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Nueva contraseña</label>
              <div className="relative mb-4">
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

              <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Confirmar contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className="w-full bg-navy-ink text-white rounded-lg px-4 py-3 mb-2 outline-none border border-white/10 focus:border-verde"
                placeholder="••••••••"
              />

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg mt-5 transition-colors"
              >
                {enviando ? 'Guardando…' : 'Guardar nueva contraseña'}
              </button>
            </form>
          )}

          {exito && (
            <div className="text-center">
              <p className="text-verde font-display text-lg mb-2">¡Listo!</p>
              <p className="text-white/60 text-sm">Tu contraseña fue actualizada. Redirigiendo al inicio de sesión…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
