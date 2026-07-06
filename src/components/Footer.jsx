import { Link } from 'react-router-dom'
import LogoMark from './LogoMark'

export default function Footer() {
  return (
    <footer className="bg-navy-ink text-white/60 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-display text-lg mb-2">
            <LogoMark size={18} />
            ENERPETROL
          </div>
          <p className="text-sm max-w-xs">
            35 estaciones en 13 ciudades de Honduras. Un tanque a la vez, construimos tu ruta de lealtad.
          </p>
        </div>
        <div className="flex gap-16 text-sm">
          <div>
            <p className="text-white font-semibold mb-3">La app</p>
            <ul className="space-y-2">
              <li><a href="#beneficios" className="hover:text-white">Beneficios</a></li>
              <li><a href="#red" className="hover:text-white">Nuestra red</a></li>
              <li><a href="#preguntas" className="hover:text-white">Preguntas frecuentes</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Empresa</p>
            <ul className="space-y-2">
              <li><a href="/privacidad.html" className="hover:text-white">Política de privacidad</a></li>
              <li><Link to="/admin/login" className="hover:text-white">Acceso administrativo</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-white/10">
        © {new Date().getFullYear()} Enerpetrol Honduras. Todos los derechos reservados.
      </div>
    </footer>
  )
}
