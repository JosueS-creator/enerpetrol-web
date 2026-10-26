import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Fuel, ShieldCheck } from 'lucide-react'
import LogoMark from '../components/LogoMark'
import { supabase } from '../lib/supabase'
const REGISTRO_ACTIVO = import.meta.env.VITE_TARJETA_REGISTRO_ACTIVO === 'true'

const estaciones = [
  { ciudad: 'Tegucigalpa', nombre: 'Texaco Triángulo' },
  { ciudad: 'Tegucigalpa', nombre: 'Uno Montecarlo' },
  { ciudad: 'Tegucigalpa', nombre: 'Uno Palma Real' },
  { ciudad: 'San Pedro Sula', nombre: 'Uno Copantl' },
  { ciudad: 'Siguatepeque', nombre: 'Uno Zaragoza' },
]
export default function RegistroTarjeta() {
  const [datos, setDatos] = useState({ nombre: '', identidad: '', vehiculo: '', placa: '', estacion: '' })
  const [consentimiento, setConsentimiento] = useState(false)
  const [website, setWebsite] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  async function enviar(e) {
    e.preventDefault()
    if (!REGISTRO_ACTIVO || enviando || !consentimiento) return
    setEnviando(true); setMensaje('')
    try {
      const { data, error } = await supabase.functions.invoke('solicitar-tarjeta-fisica', { body: { ...datos, consentimiento, website } })
      if (error || !data?.ok) throw new Error(data?.error || 'No se pudo enviar la solicitud')
      setExito(true); setMensaje('Solicitud recibida. Te contactaremos según el proceso de emisión de tarjetas.')
    } catch (err) { setMensaje(err.message || 'Error al enviar la solicitud') }
    finally { setEnviando(false) }
  }
  const set = (k, v) => setDatos(d => ({ ...d, [k]: v }))
  return <main className="min-h-screen bg-navy-ink text-white px-5 py-10">
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold mb-10"><LogoMark size={28}/> ENERPETROL</Link>
      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-7 mb-7 shadow-2xl">
        <Fuel className="mb-4" size={34}/>
        <p className="uppercase tracking-widest text-xs text-emerald-100">Tarjeta física Enerpetrol</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2">L 2 de descuento por galón</h1>
        <p className="mt-4 text-emerald-50">Solicita tu tarjeta física para utilizarla en cinco estaciones participantes. La solicitud no garantiza su emisión.</p>
      </div>
      <section className="bg-white text-slate-900 rounded-3xl p-6 md:p-9 shadow-xl">
        <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard/> Datos del conductor</h2>
        <p className="text-slate-600 mt-2 mb-6">Completa tus datos para solicitar la tarjeta. No necesitas instalar la aplicación.</p>
        <form onSubmit={enviar} className="space-y-5">
          {[
            ['nombre','Nombre completo','text','Nombre y apellidos'],
            ['identidad','Número de identidad','text','0000-0000-00000'],
            ['vehiculo','Marca y modelo del vehículo','text','Ej. Toyota Corolla'],
            ['placa','Número de placa','text','Ej. HAA 1234'],
          ].map(([key,label,type,placeholder])=><label key={key} className="block text-sm font-semibold">{label}
            <input type={type} autoComplete="off" value={datos[key]} onChange={e=>set(key,e.target.value)} placeholder={placeholder} required maxLength={90} className="mt-2 w-full border border-slate-300 rounded-xl p-3 min-h-12 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
          </label>)}
          <label className="block text-sm font-semibold">Estación de preferencia
            <select required value={datos.estacion} onChange={e=>set('estacion',e.target.value)} className="mt-2 w-full border border-slate-300 rounded-xl p-3 min-h-12 bg-white">
              <option value="">Selecciona una estación</option>
              {estaciones.map(s=><option key={s.nombre} value={s.nombre}>{s.ciudad} — {s.nombre}</option>)}
            </select>
          </label>
          <p className="text-sm text-slate-600">Todas las estaciones indicadas ofrecen L 2 de descuento por galón mediante la tarjeta física, una vez emitida y conforme a las condiciones del programa.</p>
          <div aria-hidden="true" className="absolute -left-[9999px]"><label>Sitio web<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={consentimiento} onChange={e=>setConsentimiento(e.target.checked)} className="mt-1 h-5 w-5"/>
            <span>Autorizo el tratamiento de mis datos para gestionar la solicitud de tarjeta física y su comunicación al operador responsable de emitirla, conforme al <a href="/privacidad.html" target="_blank" rel="noreferrer" className="text-emerald-700 underline">aviso de privacidad</a>.</span>
          </label>
          {!REGISTRO_ACTIVO && <div role="status" className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-sm">Registro próximamente disponible. Pendiente de activar el consentimiento legal y las protecciones contra abuso.</div>}
          {mensaje && <p role="status" className={exito ? "text-emerald-700" : "text-red-700"}>{mensaje}</p>}
          <button type="submit" disabled={!REGISTRO_ACTIVO || !consentimiento || enviando || exito} className="w-full rounded-xl bg-emerald-700 text-white font-bold py-4 disabled:bg-slate-400 disabled:cursor-not-allowed">{exito ? "Solicitud enviada" : enviando ? "Enviando…" : REGISTRO_ACTIVO ? "Solicitar tarjeta física" : "Registro próximamente disponible"}</button>
        </form>
      </section>
      <p className="text-center text-white/60 text-sm mt-6 flex justify-center gap-2 items-center"><ShieldCheck size={16}/> Tu información requiere tratamiento protegido.</p>
    </div>
  </main>
}
