import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BadgeDollarSign,
  Check,
  FileCheck2,
  Fuel,
  Handshake,
  MapPin,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { DEPARTAMENTOS } from '../lib/constants'

const WHATSAPP_NUMBER = '50487401299'

const PASOS = [
  {
    icon: MapPin,
    titulo: 'Los conductores encuentran estaciones participantes',
    texto: 'Los usuarios consultan las opciones disponibles en Enerpetrol y conocen las alternativas para abastecerse.',
  },
  {
    icon: Users,
    titulo: 'Enerpetrol agrupa la demanda',
    texto: 'Las compras de diferentes usuarios pueden contribuir a alcanzar los volúmenes necesarios para negociar descuentos.',
  },
  {
    icon: Handshake,
    titulo: 'Acordamos las condiciones comerciales',
    texto: 'Enerpetrol y la estación definen el descuento por galón, los umbrales de volumen y las condiciones de participación.',
  },
  {
    icon: Fuel,
    titulo: 'Los usuarios pueden aprovechar el beneficio acordado',
    texto: 'Las compras elegibles se gestionan conforme a las condiciones establecidas para la estación y al funcionamiento de Enerpetrol.',
  },
]

const BENEFICIOS = [
  {
    icon: Users,
    titulo: 'Una oportunidad para atraer compradores',
    texto: 'Presenta tu estación ante usuarios que consideran el ahorro al elegir dónde abastecerse.',
  },
  {
    icon: BadgeDollarSign,
    titulo: 'Negociación basada en volumen',
    texto: 'Explora condiciones de descuento vinculadas a la agrupación de compras, de acuerdo con la capacidad y los objetivos de tu estación.',
  },
  {
    icon: Fuel,
    titulo: 'Una propuesta comercial diferenciada',
    texto: 'Incorpora el ahorro como un elemento adicional para competir y dar a los conductores una razón para considerar tu estación.',
  },
  {
    icon: SlidersHorizontal,
    titulo: 'Condiciones adaptadas a tu negocio',
    texto: 'El descuento, los umbrales de volumen y las demás condiciones se negocian individualmente. No todas las estaciones tienen que operar bajo un acuerdo idéntico.',
  },
]

const ASPECTOS = [
  'Descuento por galón',
  'Umbrales y períodos de medición del volumen',
  'Combustibles y compras elegibles',
  'Validación de operaciones y facturas',
  'Liquidación de los descuentos',
  'Responsabilidades de cada parte',
  'Condiciones económicas de la alianza',
]

const PREGUNTAS = [
  {
    q: '¿Tiene algún costo afiliar mi gasolinera?',
    a: 'Las condiciones económicas se conversan directamente con cada estación. Durante la negociación se definirán los términos aplicables a la participación.',
  },
  {
    q: '¿Debo ofrecer el mismo descuento que otras estaciones?',
    a: 'No necesariamente. El descuento y los umbrales de volumen se definen según el acuerdo comercial establecido con cada estación.',
  },
  {
    q: '¿Enerpetrol garantiza que aumentarán mis ventas?',
    a: 'No podemos garantizar un incremento específico. La plataforma busca generar oportunidades comerciales al conectar usuarios con estaciones participantes, pero los resultados dependerán de la demanda, las condiciones acordadas y el comportamiento de compra.',
  },
  {
    q: '¿Cómo se valida el combustible comprado?',
    a: 'Enerpetrol contempla el registro de compras mediante la carga de facturas en la aplicación. Los requisitos de validación, elegibilidad y conciliación deberán quedar establecidos en el acuerdo comercial.',
  },
  {
    q: '¿Cómo sé cuándo se alcanza el volumen negociado?',
    a: 'El mecanismo de medición, el período de evaluación y el procedimiento para confirmar el volumen elegible deben definirse con Enerpetrol antes de formalizar la participación.',
  },
  {
    q: '¿Cómo puedo participar?',
    a: 'Completa el formulario comercial para preparar una solicitud. Al abrir el enlace, WhatsApp recibirá el texto para preparar el chat; tendrás que pulsar Enviar allí para que Enerpetrol reciba la solicitud.',
  },
]

function TextField({ label, name, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-navy">{label} <span className="text-verde" aria-hidden="true">*</span></span>
      <input
        name={name}
        required
        {...props}
        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-verde focus:ring-2 focus:ring-verde/20"
      />
    </label>
  )
}

function SelectField({ label, name, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-navy">{label} <span className="text-verde" aria-hidden="true">*</span></span>
      <select
        name={name}
        required
        defaultValue=""
        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-verde focus:ring-2 focus:ring-verde/20"
      >
        {children}
      </select>
    </label>
  )
}

export default function Gasolineras() {
  const [phoneError, setPhoneError] = useState('')
  const [preparedRequest, setPreparedRequest] = useState(null)

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = 'Para gasolineras | Enerpetrol Honduras'
    if (description) {
      description.content = 'Conoce cómo Enerpetrol conecta conductores con estaciones participantes mediante compras agrupadas y descuentos por volumen negociados con cada gasolinera.'
    }
    return () => {
      document.title = previousTitle
      if (description && previousDescription) description.content = previousDescription
    }
  }, [])

  function prepareRequest(event) {
    event.preventDefault()
    if (preparedRequest) return

    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())
    const phoneInput = fields.telefono.trim()
    const phoneDigits = fields.telefono.replace(/\D/g, '')
    const phoneCharactersAreValid = /^[+\d\s().-]+$/.test(phoneInput)
    if (!phoneCharactersAreValid || (phoneDigits.length !== 8 && !(phoneDigits.length === 11 && phoneDigits.startsWith('504')))) {
      setPhoneError('Ingresa un teléfono hondureño de 8 dígitos. Puedes incluir el código +504.')
      form.elements.telefono.focus()
      return
    }

    setPhoneError('')
    const phone = phoneDigits.length === 8 ? `+504 ${phoneDigits}` : `+504 ${phoneDigits.slice(3)}`
    const message = [
      '*Solicitud de información comercial — Enerpetrol*',
      '',
      `Gasolinera: ${fields.gasolinera}`,
      `Contacto: ${fields.nombre}`,
      `Cargo: ${fields.cargo}`,
      `Ciudad: ${fields.ciudad}`,
      `Departamento: ${fields.departamento}`,
      `Estaciones administradas: ${fields.estaciones}`,
      `Teléfono de contacto: ${phone}`,
    ].join('\n')

    setPreparedRequest({
      url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      message,
    })
  }

  return (
    <div id="top" className="bg-concrete text-navy">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-navy-ink pt-32 pb-16 text-white sm:pt-40 sm:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-tech-grid-fine bg-[length:40px_40px] opacity-30" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-verde/30 bg-verde/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-verde">
                <span className="h-1.5 w-1.5 rounded-full bg-verde" /> Alianzas comerciales · Honduras
              </span>
              <h1 className="mb-6 max-w-2xl font-display text-5xl leading-[1.05] text-white sm:text-6xl">
                Una nueva oportunidad para tu estación de servicio
              </h1>
              <p className="mb-9 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Enerpetrol conecta a conductores que buscan ahorrar con estaciones de servicio participantes. A través de la agrupación de compras, buscamos facilitar la negociación de descuentos por galón según los volúmenes y las condiciones acordadas.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#contacto-comercial" className="inline-flex items-center justify-center gap-2 rounded-full bg-verde-metal px-7 py-3.5 font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-verde-light focus:ring-offset-2 focus:ring-offset-navy-ink">
                  Quiero afiliar mi gasolinera <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a href="#como-funciona" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70">
                  Cómo funciona
                </a>
              </div>
            </div>

            <figure className="relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-navy-card sm:min-h-[27rem]">
              <img
                src="/video/hero-poster.jpg"
                alt="Abastecimiento de combustible en una estación de servicio"
                className="absolute inset-0 h-full w-full scale-[1.35] object-cover object-bottom origin-bottom"
                fetchpriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/90 via-navy-ink/15 to-navy-ink/10" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-verde-light">Un modelo por volumen</span>
                <span className="block max-w-sm font-display text-2xl text-white sm:text-3xl">Condiciones conversadas directamente con cada estación.</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-verde">Cómo funciona</span>
              <h2 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl">Del ahorro individual a una oportunidad por volumen</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy/60 sm:text-base">Un proceso de conversación y acuerdos entre Enerpetrol y cada estación participante.</p>
            </div>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PASOS.map(({ icon: Icon, titulo, texto }, index) => (
                <li key={titulo} className="relative rounded-2xl border border-navy/10 bg-concrete/70 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-verde-light"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className="font-mono text-sm text-navy/35">0{index + 1}</span>
                  </div>
                  <h3 className="mb-3 font-display text-xl leading-snug text-navy">{titulo}</h3>
                  <p className="text-sm leading-relaxed text-navy/60">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-concrete py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-verde">Oportunidad comercial</span>
              <h2 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl">¿Por qué participar en Enerpetrol?</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {BENEFICIOS.map(({ icon: Icon, titulo, texto }) => (
                <article key={titulo} className="flex gap-5 rounded-2xl border border-navy/10 bg-white p-6 sm:p-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-verde/10 text-verde-dark"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                  <div>
                    <h3 className="mb-2 font-display text-xl text-navy">{titulo}</h3>
                    <p className="text-sm leading-relaxed text-navy/60">{texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy-ink py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-verde-light">Modelo comercial</span>
              <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Un acuerdo definido para cada estación</h2>
              <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
                Cada estación tiene su propia estructura comercial, capacidad operativa y objetivos. Por eso, Enerpetrol propone establecer las condiciones de participación mediante una negociación directa.
              </p>
              <p className="mt-5 border-l-2 border-verde pl-4 text-sm leading-relaxed text-white/85">
                La participación queda sujeta a la aceptación de las condiciones acordadas entre Enerpetrol y la estación.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <h3 className="mb-6 font-display text-2xl">Aspectos que conversaremos</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {ASPECTOS.map((aspecto) => (
                  <li key={aspecto} className="flex gap-3 text-sm leading-relaxed text-white/75">
                    <Check size={17} className="mt-0.5 shrink-0 text-verde-light" aria-hidden="true" /> {aspecto}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="preguntas-comerciales" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-verde">Preguntas frecuentes</span>
              <h2 className="mt-3 font-display text-4xl text-navy sm:text-5xl">Conversemos con claridad</h2>
            </div>
            <div className="divide-y divide-navy/10 border-y border-navy/10">
              {PREGUNTAS.map(({ q, a }, index) => (
                <details key={q} className="group py-5" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-navy marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde">
                    {q}
                    <span className="text-verde transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
                  </summary>
                  <p className="max-w-2xl pt-4 pr-8 text-sm leading-relaxed text-navy/65">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto-comercial" className="scroll-mt-24 bg-concrete py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-verde">Hablemos de tu estación</span>
              <h2 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl">Hablemos del potencial de tu estación</h2>
              <p className="mt-4 text-sm leading-relaxed text-navy/60 sm:text-base">Conversemos sobre tus objetivos comerciales y evaluemos si el modelo de compras agrupadas de Enerpetrol se adapta a tu negocio.</p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-12">
              <aside className="rounded-2xl bg-navy-ink p-6 text-white sm:p-8">
                <MessageCircle className="mb-5 text-verde-light" size={27} strokeWidth={1.8} aria-hidden="true" />
                <h3 className="mb-3 font-display text-2xl">Una conversación directa</h3>
                <p className="mb-6 text-sm leading-relaxed text-white/65">Comparte la información básica de tu estación y prepara una solicitud para el equipo de Enerpetrol.</p>
                <p className="border-t border-white/10 pt-5 text-xs leading-relaxed text-white/50">Este sitio no guarda tu información. Al abrir WhatsApp, los datos incluidos en el enlace se comparten con ese servicio para preparar el chat; el mensaje llega al equipo de Enerpetrol solo si presionas Enviar.</p>
              </aside>

              <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm sm:p-8">
                {preparedRequest ? (
                  <div role="status" aria-live="polite">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-verde/10 text-verde-dark"><FileCheck2 size={23} aria-hidden="true" /></div>
                    <h3 className="font-display text-2xl text-navy">Mensaje preparado, aún no enviado</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy/65">Se abrirá WhatsApp con los datos de tu solicitud. Revisa el mensaje y presiona <strong>Enviar</strong> en WhatsApp para que Enerpetrol lo reciba.</p>
                    <details className="mt-5 rounded-xl border border-navy/10 bg-concrete p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-navy">Revisar los datos que compartirás</summary>
                      <pre className="mt-4 whitespace-pre-wrap font-body text-xs leading-relaxed text-navy/70">{preparedRequest.message}</pre>
                    </details>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a href={preparedRequest.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-verde-metal px-6 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2">
                        Abrir WhatsApp para enviar <ArrowRight size={16} aria-hidden="true" />
                      </a>
                      <button type="button" onClick={() => setPreparedRequest(null)} className="min-h-12 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy/50 focus:outline-none focus:ring-2 focus:ring-verde">Editar información</button>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-navy/50">WhatsApp recibirá el texto al abrir el enlace. La solicitud llegará a Enerpetrol únicamente si la envías desde WhatsApp.</p>
                  </div>
                ) : (
                  <form onSubmit={prepareRequest}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2"><TextField label="Nombre comercial de la gasolinera" name="gasolinera" autoComplete="organization" placeholder="Ej. Estación Central" /></div>
                      <TextField label="Nombre y apellido del contacto" name="nombre" autoComplete="name" placeholder="Tu nombre completo" />
                      <SelectField label="Cargo" name="cargo">
                        <option value="" disabled>Selecciona tu cargo</option>
                        <option>Propietario</option><option>Gerente</option><option>Representante comercial</option>
                      </SelectField>
                      <TextField label="Ciudad" name="ciudad" autoComplete="address-level2" placeholder="Ciudad" />
                      <SelectField label="Departamento" name="departamento">
                        <option value="" disabled>Selecciona un departamento</option>
                        {DEPARTAMENTOS.map((departamento) => <option key={departamento}>{departamento}</option>)}
                      </SelectField>
                      <SelectField label="Estaciones que administra" name="estaciones">
                        <option value="" disabled>Selecciona una opción</option>
                        <option>Una</option><option>De 2 a 5</option><option>6 o más</option>
                      </SelectField>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-navy">Teléfono de contacto <span className="text-verde" aria-hidden="true">*</span></span>
                        <input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+504 9876-5432" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? 'telefono-error' : 'telefono-ayuda'} onChange={() => phoneError && setPhoneError('')} className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-verde focus:ring-2 focus:ring-verde/20" />
                        {phoneError ? <span id="telefono-error" className="mt-2 block text-xs text-red-700" role="alert">{phoneError}</span> : <span id="telefono-ayuda" className="mt-2 block text-xs text-navy/45">Número hondureño de 8 dígitos; puedes incluir +504.</span>}
                      </label>
                    </div>

                    <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-navy/60">
                      <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#5BAE2F]" />
                      <span>Autorizo generar un enlace con mis datos para abrir WhatsApp y preparar una consulta a Enerpetrol. Entiendo que WhatsApp recibirá el texto al abrir el enlace; revisaré el mensaje antes de decidir si lo envío al equipo.</span>
                    </label>

                    <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-verde-metal px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2 sm:w-auto">
                      Solicitar información comercial <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-navy/45"><ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> El sitio no guarda la solicitud. Al abrir el enlace, WhatsApp recibe el texto para preparar el chat; Enerpetrol solo lo recibe si presionas Enviar.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
