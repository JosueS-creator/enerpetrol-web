import { useEffect, useState } from 'react'
import { CreditCard, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '../../lib/supabase'

const CAMPOS = 'id,nombre,identidad,telefono,vehiculo,placa,estacion,estado,creado_en,origen,consentimiento_version,consentimiento_fecha'

export default function TarjetasFisicas() {
  const [solicitudes, setSolicitudes] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [exportando, setExportando] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    let activo = true
    async function cargar() {
      const { data, error } = await supabase.from('solicitudes_tarjeta_fisica')
        .select(CAMPOS)
        .order('creado_en', { ascending: false }).limit(1000)
      if (!activo) return
      if (error) setError('No fue posible consultar las solicitudes: ' + error.message)
      else setSolicitudes(data || [])
      setCargando(false)
    }
    cargar()
    return () => { activo = false }
  }, [])

  async function exportar() {
    if (exportando) return
    setError('')
    if (!fechaInicio || !fechaFin) {
      setError('Selecciona la fecha inicial y la fecha final.')
      return
    }
    if (fechaInicio > fechaFin) {
      setError('La fecha inicial no puede ser posterior a la fecha final.')
      return
    }

    setExportando(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) throw new Error('Sesión no válida')

      // El límite superior es exclusivo y se calcula en hora local para incluir
      // todos los registros del último día seleccionado.
      const desde = new Date(fechaInicio + 'T00:00:00')
      const hasta = new Date(fechaFin + 'T00:00:00')
      hasta.setDate(hasta.getDate() + 1)
      const desdeISO = desde.toISOString()
      const hastaISO = hasta.toISOString()

      // Descargar por bloques para no truncar el Excel al límite de filas
      // que Supabase suele aplicar por consulta.
      const registros = []
      const tamanoBloque = 1000
      for (let inicio = 0; ; inicio += tamanoBloque) {
        const { data, error: consultaError } = await supabase
          .from('solicitudes_tarjeta_fisica')
          .select(CAMPOS)
          .gte('creado_en', desdeISO)
          .lt('creado_en', hastaISO)
          .order('creado_en', { ascending: false })
          .range(inicio, inicio + tamanoBloque - 1)
        if (consultaError) throw new Error('No fue posible consultar el período: ' + consultaError.message)
        registros.push(...(data || []))
        if (!data || data.length < tamanoBloque) break
      }

      if (!registros.length) throw new Error('No hay solicitudes registradas en el período seleccionado.')

      const { error: auditError } = await supabase.from('auditoria_exportacion_tarjetas').insert({
        admin_id: auth.user.id,
        cantidad: registros.length,
      })
      if (auditError) throw new Error('No se pudo registrar la auditoría de descarga')

      const filas = registros.map(s => ({
        'Fecha': s.creado_en,
        'Nombre completo': s.nombre,
        'Identidad': s.identidad,
        'Teléfono': s.telefono ? '+504 ' + s.telefono : '',
        'Vehículo': s.vehiculo,
        'Placa': s.placa,
        'Estación': s.estacion,
        'Estado': s.estado,
        'Origen': s.origen,
        'Consentimiento': s.consentimiento_version,
        'Fecha de consentimiento': s.consentimiento_fecha,
      }))
      const hoja = XLSX.utils.json_to_sheet(filas)
      for (const cell of Object.values(hoja)) {
        if (cell && typeof cell === 'object' && cell.t === 's') cell.z = '@'
      }
      const libro = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(libro, hoja, 'Solicitudes')
      XLSX.writeFile(libro, `Enerpetrol_tarjetas_${fechaInicio}_a_${fechaFin}.xlsx`)
    } catch (e) {
      setError(e.message || 'Error exportando archivo')
    } finally {
      setExportando(false)
    }
  }

  return <div className="p-6 md:p-10">
    <h1 className="text-3xl font-bold text-navy-ink flex items-center gap-3"><CreditCard/> Tarjetas físicas</h1>
    <p className="mt-3 text-slate-600">Solicitudes de tarjeta física Enerpetrol — L 2 por galón en cinco estaciones.</p>
    <section className="mt-8 rounded-2xl bg-white shadow-sm p-6 border border-slate-200">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div><h2 className="font-bold text-xl">Registros</h2><p className="text-slate-600 mt-1">{cargando ? 'Cargando…' : solicitudes.length + ' registros recientes (máximo 1,000 en pantalla)'}</p></div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-800">Descargar solicitudes por período</h3>
        <p className="text-sm text-slate-600 mt-1">El archivo incluirá todas las solicitudes creadas desde la fecha inicial hasta el final, inclusive.</p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Fecha inicial
            <input type="date" value={fechaInicio} max={fechaFin || undefined} onChange={e => setFechaInicio(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2"/>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Fecha final
            <input type="date" value={fechaFin} min={fechaInicio || undefined} onChange={e => setFechaFin(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2"/>
          </label>
          <button disabled={cargando || exportando || !fechaInicio || !fechaFin} onClick={exportar} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed">
            <Download size={18}/>{exportando ? 'Preparando Excel…' : 'Descargar Excel'}
          </button>
        </div>
      </div>

      {error && <p role="alert" className="text-red-700 mt-4">{error}</p>}
      <div className="overflow-x-auto mt-6"><table className="w-full text-left text-sm">
        <thead><tr className="border-b">{['Fecha','Nombre','Identidad','Teléfono','Vehículo','Placa','Estación','Estado'].map(h=><th className="p-3" key={h}>{h}</th>)}</tr></thead>
        <tbody>{solicitudes.map(s=><tr key={s.id} className="border-b border-slate-100">{[new Date(s.creado_en).toLocaleDateString('es-HN'),s.nombre,s.identidad,s.telefono ? '+504 ' + s.telefono : '—',s.vehiculo,s.placa,s.estacion,s.estado].map((v,i)=><td className="p-3" key={i}>{v}</td>)}</tr>)}</tbody>
      </table></div>
    </section>
  </div>
}
