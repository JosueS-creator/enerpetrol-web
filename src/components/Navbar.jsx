import { useState, useEffect } from 'react'
import { Fuel, Menu, X } from 'lucide-react'

const LINKS = [
  { href: '#app', label: 'La app' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#red', label: 'Nuestra red' },
  { href: '#preguntas', label: 'Preguntas' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-navy-ink/95 backdrop-blur shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 text-white font-display text-xl tracking-wide">
          <Fuel size={22} className="text-verde" strokeWidth={2.5} />
          ENERPETROL
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="#app"
            className="bg-verde hover:bg-verde-light text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Descargar app
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-navy-ink px-6 pb-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/80 text-sm font-medium">
              {l.label}
            </a>
          ))}
          <a
            href="#app"
            onClick={() => setOpen(false)}
            className="bg-verde text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center"
          >
            Descargar app
          </a>
        </div>
      )}
    </header>
  )
}
