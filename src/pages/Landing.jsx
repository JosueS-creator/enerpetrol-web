import { Fuel, Gift, ShieldCheck, MapPin, Percent, ScanLine, ChevronDown, Download, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OdometroDigit from '../components/OdometroDigit'
import RutaCiudades from '../components/RutaCiudades'
import { lazy, Suspense } from 'react'
const MapaEstaciones = lazy(() => import('../components/MapaEstaciones'))
import { useReveal } from '../lib/useReveal'

const APP_URL = 'https://enerpetrol-app.vercel.app'

const BENEFICIOS = [
  {
    icon: ShieldCheck,
    titulo: 'Sin membresías ni pagos ocultos',
    texto: 'La app es gratuita. No hay cuotas, suscripciones ni letra pequeña: el descuento es directo.',
  },
  {
    icon: Percent,
    titulo: 'Descuento inmediato en bomba',
    texto: 'Muestra tu código en caja al pagar tu combustible y tu descuento se aplica al instante. Nada que esperar, nada que canjear.',
  },
  {
    icon: Fuel,
    titulo: 'Descuentos de L 1.00 y L 3.00 por galón',
    texto: 'El monto exacto depende de la estación donde cargues, pero siempre es un descuento real, no un porcentaje escondido.',
  },
  {
    icon: MapPin,
    titulo: 'Red en 17 ciudades',
    texto: 'De Tegucigalpa a Trojes, tu tarjeta funciona igual en cualquiera de nuestras 41 estaciones.',
  },
  {
    icon: Gift,
    titulo: 'De regalo, acumulas puntos',
    texto: 'Sube tu factura desde la app y cada galón aprobado suma a tu historial. Un extra, no el objetivo principal.',
  },
  {
    icon: ScanLine,
    titulo: 'Tu tarjeta, siempre a mano',
    texto: 'Tu código de descuento vive en tu tarjeta digital, lista para mostrarla en caja en segundos.',
  },
]

const PASOS = [
  {
    icon: Download,
    titulo: 'Crea tu cuenta',
    texto: 'Regístrate con tu nombre, ciudad y correo — o directo con Google. Toma menos de un minuto.',
    img: '/screens/01-crear-cuenta.png',
  },
  {
    icon: MapPin,
    titulo: 'Elige tu estación',
    texto: 'El mapa te muestra las estaciones afiliadas más cercanas y cuánto ahorras en cada una.',
    img: '/screens/02-elegir-estacion.png',
  },
  {
    icon: CreditCard,
    titulo: 'Muestra tu tarjeta al bombero',
    texto: 'Tu tarjeta digital con tu código de descuento, lista para mostrarla antes de cargar.',
    img: '/screens/03-tarjeta.png',
  },
  {
    icon: ScanLine,
    titulo: 'Sube tu factura y gana Enermonedas',
    texto: 'Fotografía tu factura desde la app — la lectura de galones es automática.',
    img: '/screens/04-subir-factura.png',
  },
  {
    icon: Gift,
    titulo: 'Acumula y canjea premios',
    texto: 'Mira crecer tus Enermonedas y cámbialas por descuentos y recargas del catálogo de premios.',
    img: '/screens/05-enermonedas.png',
  },
]

const PREGUNTAS = [
  {
    q: '¿Cómo funciona el descuento?',
    a: 'Descarga la app y obtén tu tarjeta digital con tu código único. Muestra ese código en caja al pagar tu combustible y el descuento se aplica de inmediato, directo en bomba.',
  },
  {
    q: '¿Cuánto puedo ahorrar?',
    a: 'Descuentos de L 1.00 y L 3.00 por galón. El monto exacto depende de la estación donde cargues, pero siempre es un descuento real aplicado al momento.*',
  },
  {
    q: '¿Tiene algún costo la app?',
    a: 'No. Es completamente gratuita, sin membresías, cuotas ni pagos ocultos. El descuento no depende de ningún plan de pago.',
  },
  {
    q: '¿Además del descuento, gano algo más?',
    a: 'Sí, como extra: si subes tu factura desde la app, cada galón aprobado suma a tu historial acumulado. Es un bono adicional, no el objetivo principal de la app.',
  },
  {
    q: '¿En qué estaciones puedo usar mi tarjeta?',
    a: 'En cualquiera de nuestras 41 estaciones distribuidas en 17 ciudades de Honduras: Tegucigalpa, San Pedro Sula, La Ceiba, Choluteca, Danlí y más.',
  },
]

export default function Landing() {
  const heroRef = useReveal()
  const [preguntaAbierta, setPreguntaAbierta] = useState(0)
  const [pasoActual, setPasoActual] = useState(0)

  return (
    <div id="top" className="bg-concrete">
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative bg-navy-ink pt-32 pb-20 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero-surtidor.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-ink/90 via-navy-ink/65 to-navy-ink/90" />
        <div className="absolute inset-0 bg-tech-grid-fine bg-[length:36px_36px] opacity-60 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div data-reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-verde uppercase mb-5 border border-verde/30 bg-verde/5 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-verde animate-parpadeo" />
              App progresiva · Red Enerpetrol Honduras
            </span>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-[1.05] mb-6">
              Descuento real,<br />directo en la bomba
            </h1>
            <p className="text-white/70 text-lg mb-2 max-w-lg">
              Con la app Enerpetrol recibes <span className="text-white font-semibold">descuentos de L 1.00 y L 3.00 por galón</span>,
              aplicados al instante en cualquiera de nuestras 41 estaciones. Sin pagos ocultos, sin membresías.*
            </p>
            <p className="text-white/40 text-xs mb-9">*Restricciones aplican.</p>
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
                className="border-2 border-white/50 hover:border-white bg-white/5 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Ver beneficios
              </a>
            </div>
          </div>

          {/* Odómetro de red */}
          <div data-reveal className="relative grid grid-cols-2 gap-6 mt-16 max-w-sm border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-xl px-6 py-5">
            <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-verde/60" />
            <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-verde/60" />
            <div>
              <p className="text-3xl text-white font-mono"><OdometroDigit target={41} /></p>
              <p className="text-white/50 text-xs uppercase tracking-wide mt-1">Estaciones</p>
            </div>
            <div>
              <p className="text-3xl text-white font-mono"><OdometroDigit target={17} /></p>
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
            De occidente a oriente, tu tarjeta Enerpetrol funciona igual en las 17 ciudades donde tenemos presencia.
          </p>
        </div>
        <RutaCiudades />

        <div className="max-w-6xl mx-auto px-6 mt-4" data-reveal>
          <Suspense
            fallback={
              <div
                className="rounded-2xl border border-navy/10 flex items-center justify-center bg-navy-card text-white/50 text-sm"
                style={{ height: '480px' }}
              >
                Cargando mapa…
              </div>
            }
          >
            <MapaEstaciones altura="480px" />
          </Suspense>
          <p className="text-white/40 text-xs mt-3 text-center">
            Explora el mapa: arrastra para moverte, y haz clic en cualquier punto para ver los detalles de esa estación.
          </p>
        </div>
      </section>

      {/* CÓMO FUNCIONA — la app como protagonista */}
      <section id="app" className="relative bg-navy-ink py-24 overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid bg-[length:48px_48px] opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div data-reveal className="max-w-lg mb-4">
            <span className="text-verde font-mono text-xs tracking-[0.2em] uppercase">Cómo funciona</span>
            <h2 className="font-display text-4xl text-white mt-3">De la app a tu descuento, en {PASOS.length} pasos</h2>
          </div>
          <p data-reveal className="text-white/40 text-sm mb-12">
            Toca las flechas, los puntos, o cualquier paso para navegar las pantallas reales de la app →
          </p>

          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Pasos numerados, clicables */}
            <div data-reveal className="relative">
              <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-verde/60 via-verde/20 to-transparent" />
              <div className="space-y-3">
                {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
                  <button
                    key={titulo}
                    onClick={() => setPasoActual(i)}
                    className="relative flex gap-5 text-left w-full py-2 group"
                  >
                    <div
                      className={`relative shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm transition-colors border ${
                        i === pasoActual
                          ? 'bg-verde text-white border-verde'
                          : 'bg-navy-card text-verde border-verde/40 group-hover:border-verde'
                      }`}
                    >
                      0{i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon size={16} className="text-verde" />
                        <h3 className="font-display text-lg text-white">{titulo}</h3>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{texto}</p>
                    </div>
                  </button>
                ))}
              </div>
              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-6 bg-verde-metal hover:brightness-110 text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Empezar ahora
              </a>
            </div>

            {/* Teléfono interactivo con pantallas reales */}
            <div data-reveal className="flex flex-col items-center">
              <div className="relative animate-float">
                <div className="absolute -inset-6 bg-verde/10 blur-3xl rounded-full" aria-hidden="true" />
                <div className="relative w-[260px] rounded-[2.2rem] bg-navy-ink p-2.5 shadow-2xl border border-white/10">
                  <div
                    className="relative rounded-[1.8rem] overflow-hidden border border-white/10 bg-navy-card"
                    style={{ aspectRatio: '420 / 866' }}
                  >
                    <img
                      key={pasoActual}
                      src={PASOS[pasoActual].img}
                      alt={PASOS[pasoActual].titulo}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-1 w-16 h-4 bg-navy-ink rounded-full" />
                </div>

                <button
                  onClick={() => setPasoActual((pasoActual - 1 + PASOS.length) % PASOS.length)}
                  aria-label="Pantalla anterior"
                  className="absolute top-1/2 -left-12 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPasoActual((pasoActual + 1) % PASOS.length)}
                  aria-label="Siguiente pantalla"
                  className="absolute top-1/2 -right-12 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex gap-2 mt-6">
                {PASOS.map((p, i) => (
                  <button
                    key={p.titulo}
                    onClick={() => setPasoActual(i)}
                    aria-label={`Ir a: ${p.titulo}`}
                    className={`w-2 h-2 rounded-full transition-colors ${i === pasoActual ? 'bg-verde' : 'bg-white/20'}`}
                  />
                ))}
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
              <div key={titulo} data-reveal className="relative border border-navy/10 rounded-2xl p-6 hover:border-verde/40 transition-colors">
                <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-verde/30" />
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
          <h2 className="font-display text-4xl text-white mb-5 drop-shadow-sm">Tu próximo tanque puede costarte menos</h2>
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

      <p className="text-center text-navy/40 text-xs py-4 bg-concrete">*Restricciones aplican.</p>

      <Footer />
    </div>
  )
}
