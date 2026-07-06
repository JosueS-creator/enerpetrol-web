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
    icon: ShieldCheck,
    titulo: 'Sin membresías ni pagos ocultos',
    texto: 'La app es gratuita. No hay cuotas, suscripciones ni letra pequeña: el descuento es directo.',
  },
  {
    icon: MapPin,
    titulo: 'Red en 13 ciudades',
    texto: 'De Tegucigalpa a Trojes, tu tarjeta funciona igual en cualquiera de nuestras 35 estaciones.',
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
    a: 'En cualquiera de nuestras 35 estaciones distribuidas en 13 ciudades de Honduras: Tegucigalpa, San Pedro Sula, La Ceiba, Choluteca, Danlí y más.',
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
              Descuento real,<br />directo en la bomba
            </h1>
            <p className="text-white/70 text-lg mb-9 max-w-lg">
              Con la app Enerpetrol recibes <span className="text-white font-semibold">descuentos de L 1.00 y L 3.00 por galón</span>,
              aplicados al instante en cualquiera de nuestras 35 estaciones. Sin pagos ocultos, sin membresías.*
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
          <h2 className="font-display text-4xl text-navy mt-3 mb-5">Tu descuento, siempre listo para mostrar</h2>
          <p className="text-navy/70 mb-6 leading-relaxed">
            Tu tarjeta digital Enerpetrol guarda tu código único para aplicar tu descuento en caja.
            De paso, cada factura que subas queda registrada en tu historial, como un bono adicional.
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
                <p className="text-white/50 text-[11px]">Tu descuento en esta estación</p>
                <p className="text-white font-mono text-4xl mt-1">L 3.00<span className="text-base text-white/50 font-body">/gal</span></p>
                <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-lg px-3 py-2">
                  <Percent size={14} className="text-gas-amber shrink-0" />
                  <p className="text-white/80 text-[11px]">Muestra este código en caja</p>
                </div>
                <p className="text-white/40 text-[11px] mt-3">+ 128.4 galones registrados en tu historial</p>
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
