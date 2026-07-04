import { Fuel, Gift, ShieldCheck, MapPin, Percent, ScanLine, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OdometroDigit from '../components/OdometroDigit'
import RutaCiudades from '../components/RutaCiudades'
import LogoMark from '../components/LogoMark'
import { useReveal } from '../lib/useReveal'

const APP_URL = 'https://enerpetrol-app-git-main-enerpetrol.vercel.app'

const BENEFICIOS = [
  {
    icon: Fuel,
    titulo: '1 galón = 1 punto',
    texto: 'Cada vez que cargas combustible en cualquiera de nuestras 35 estaciones, acumulas puntos automáticamente sobre tu tarjeta digital.',
  },
  {
    icon: Gift,
    titulo: 'Puntos que valen de verdad',
    texto: 'Redime tus puntos por descuentos en Lempiras directamente en la estación, sin letra pequeña.',
  },
  {
    icon: Percent,
    titulo: 'Código de descuento fijo',
    texto: 'Tu código de descuento vive en tu tarjeta digital y lo muestras en caja para aplicar tu beneficio al instante.',
  },
  {
    icon: ScanLine,
    titulo: 'Sube tu factura, listo',
    texto: 'Fotografía tu factura desde la app; nuestro equipo la aprueba y tus galones se acreditan a tu cuenta.',
  },
  {
    icon: MapPin,
    titulo: 'Red en 13 ciudades',
    texto: 'De Tegucigalpa a Trojes, tu tarjeta funciona igual en cualquier estación Enerpetrol del país.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Tu cuenta, protegida',
    texto: 'Inicia sesión de forma segura y controla tu historial de galones y redenciones en todo momento.',
  },
]

const PREGUNTAS = [
  {
    q: '¿Cómo empiezo a acumular puntos?',
    a: 'Descarga la app, crea tu cuenta y obtén tu número de tarjeta digital (formato ENP-XXXX-XXXX). Cada factura de combustible que subas y sea aprobada suma galones a tu cuenta.',
  },
  {
    q: '¿Cómo se calculan mis puntos?',
    a: 'Ganas 1 punto por cada galón de combustible que cargues y sea aprobado. Así de simple: mientras más recorres, más puntos acumulas.',
  },
  {
    q: '¿En qué estaciones puedo usar mi tarjeta?',
    a: 'En cualquiera de nuestras 35 estaciones distribuidas en 13 ciudades de Honduras: Tegucigalpa, San Pedro Sula, La Ceiba, Choluteca, Danlí y más.',
  },
  {
    q: '¿Qué pasa si mi factura no se aprueba de inmediato?',
    a: 'Nuestro equipo revisa cada factura subida y la aprueba o rechaza indicando el motivo. Puedes ver el estado de cada una desde tu app.',
  },
]

export default function Landing() {
  const heroRef = useReveal()
  const [preguntaAbierta, setPreguntaAbierta] = useState(0)

  return (
    <div id="top" className="bg-concrete">
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative bg-navy-ink pt-32 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div data-reveal className="max-w-2xl">
            <span className="inline-block font-mono text-xs tracking-[0.2em] text-gas-amber uppercase mb-5">
              Red Enerpetrol · Honduras
            </span>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-[1.05] mb-6">
              Cada tanque te acerca<br />a tu próximo descuento
            </h1>
            <p className="text-white/70 text-lg mb-9 max-w-lg">
              La app de lealtad de Enerpetrol convierte cada galón que cargas en puntos reales,
              canjeables en cualquiera de nuestras 35 estaciones a lo largo de Honduras.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                className="bg-verde-metal hover:brightness-110 text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Abrir la app Enerpetrol
              </a>
              <a
                href="#beneficios"
                className="border border-white/25 hover:border-white/50 text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Ver beneficios
              </a>
            </div>
          </div>

          {/* Odómetro de red */}
          <div data-reveal className="grid grid-cols-2 gap-6 mt-16 max-w-sm border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl text-white font-mono"><OdometroDigit target={35} /></p>
              <p className="text-white/50 text-xs uppercase tracking-wide mt-1">Estaciones</p>
            </div>
            <div>
              <p className="text-3xl text-white font-mono"><OdometroDigit target={13} /></p>
              <p className="text-white/50 text-xs uppercase tracking-wide mt-1">Ciudades</p>
            </div>
          </div>
        </div>
      </section>

      {/* RUTA DE CIUDADES */}
      <section id="red" className="bg-navy-ink pb-24">
        <div className="max-w-6xl mx-auto px-6 mb-8" data-reveal>
          <h2 className="font-display text-3xl text-white mb-2">Una ruta que cubre todo el país</h2>
          <p className="text-white/60 max-w-lg">
            De occidente a oriente, tu tarjeta Enerpetrol funciona igual en las 13 ciudades donde tenemos presencia.
          </p>
        </div>
        <RutaCiudades />
      </section>

      {/* LA APP */}
      <section id="app" className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center">
        <div data-reveal className="order-2 md:order-1">
          <span className="text-verde font-mono text-xs tracking-[0.2em] uppercase">Tu tarjeta, en tu bolsillo</span>
          <h2 className="font-display text-4xl text-navy mt-3 mb-5">Todo tu historial de galones en un solo lugar</h2>
          <p className="text-navy/70 mb-6 leading-relaxed">
            Tu tarjeta digital Enerpetrol guarda tu número único, tu código de descuento y el
            balance de galones acumulados. Sube tus facturas desde el celular y da seguimiento
            a cada aprobación en tiempo real.
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-navy hover:bg-navy-card text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
          >
            Crear mi cuenta gratis
          </a>
        </div>

        {/* Mockup de tarjeta digital */}
        <div data-reveal className="order-1 md:order-2 flex justify-center">
          <div className="w-72 rounded-[2rem] bg-navy-ink p-3 shadow-2xl">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-navy-card to-navy-ink p-6 aspect-[9/16] flex flex-col justify-between border border-white/10">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-xs font-mono uppercase tracking-widest">
                  <LogoMark size={14} badgePadding="p-0.5" /> Enerpetrol
                </div>
                <p className="text-white/50 text-[11px] mt-6">Tarjeta digital</p>
                <p className="text-white font-mono text-lg tracking-wider mt-1">ENP-4471-8823</p>
              </div>
              <div>
                <p className="text-white/50 text-[11px]">Galones acumulados</p>
                <p className="text-white font-mono text-4xl mt-1">128.4</p>
                <div className="flex items-center gap-2 mt-5 bg-white/10 rounded-lg px-3 py-2">
                  <Percent size={14} className="text-gas-amber shrink-0" />
                  <p className="text-white/80 text-[11px]">Código para solicitar descuento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div data-reveal className="max-w-lg mb-14">
            <span className="text-verde font-mono text-xs tracking-[0.2em] uppercase">Beneficios</span>
            <h2 className="font-display text-4xl text-navy mt-3">Diseñada para quien recorre Honduras a diario</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFICIOS.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} data-reveal className="border border-navy/10 rounded-2xl p-6 hover:border-verde/40 transition-colors">
                <Icon className="text-verde mb-4" size={26} strokeWidth={1.8} />
                <h3 className="font-display text-lg text-navy mb-2">{titulo}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREGUNTAS */}
      <section id="preguntas" className="max-w-3xl mx-auto px-6 py-24">
        <div data-reveal className="mb-10">
          <span className="text-verde font-mono text-xs tracking-[0.2em] uppercase">Preguntas frecuentes</span>
          <h2 className="font-display text-4xl text-navy mt-3">Antes de arrancar</h2>
        </div>
        <div data-reveal className="divide-y divide-navy/10 border-t border-b border-navy/10">
          {PREGUNTAS.map((p, i) => (
            <div key={p.q}>
              <button
                onClick={() => setPreguntaAbierta(preguntaAbierta === i ? -1 : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="font-display text-lg text-navy pr-6">{p.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-verde shrink-0 transition-transform ${preguntaAbierta === i ? 'rotate-180' : ''}`}
                />
              </button>
              {preguntaAbierta === i && (
                <p className="text-navy/60 text-sm leading-relaxed pb-6 pr-10">{p.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative bg-verde-metal overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/4 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine pointer-events-none"
        />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-4xl text-white mb-5 drop-shadow-sm">Tu próximo tanque puede valerte puntos</h2>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-navy-ink hover:bg-navy text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            Abrir la app Enerpetrol
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
