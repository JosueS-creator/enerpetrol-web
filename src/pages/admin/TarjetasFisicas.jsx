import { useEffect, useState } from 'react'
import { CreditCard, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '../../lib/supabase'

export default function TarjetasFisicas() {
  const [solicitudes, setSolicitudes] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [exportando, setExportando] = useState(false)
  useEffect(() => {
    let activo = true
    async function cargar() {
      const { data, error } = await supabase.from('solicitudes_tarjeta_fisica')
        .select('id,nombre,identidad,vehiculo,placa,estacion,estado,creado_en,origen,consentimiento_version,consentimiento_fecha')
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
    if (!solicitudes.length || exportando) return
    setExportando(true)
    setError('')
    try {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) throw new Error('Sesión no válida')
      const { error: auditError } = await supabase.from('auditoria_exportacion_tarjetas').insert({
        admin_id: auth.user.id, cantidad: solicitudes.length,
      })
      if (auditError) throw new Error('No se pudo registrar la auditoría de descarga')
      const filas = solicitudes.map(s => ({
        'Fecha': s.creado_en, 'Nombre completo': s.nombre, 'Identidad': s.identidad,
        'Vehículo': s.vehiculo, 'Placa': s.placa, 'Estación': s.estacion,
        'Estado': s.estado, 'Origen': s.origen, 'Consentimiento': s.consentimiento_version,
        'Fecha de consentimiento': s.consentimiento_fecha,
      }))
      const hoja = XLSX.utils.json_to_sheet(filas)
      // Preservar identificaciones como texto, evitando notación científica.
      for (const cell of Object.values(hoja)) if (cell && typeof cell === 'object' && cell.t === 's') cell.z = '@'
      const libro = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(libro, hoja, 'Solicitudes')
      XLSX.writeFile(libro, 'Enerpetrol_tarjetas_fisicas.xlsx')
    } catch (e) { setError(e.message || 'Error exportando archivo') }
    finally { setExportando(false) }
  }
  return <div className="p-6 md:p-10">
    <h1 className="text-3xl font-bold text-navy-ink flex items-center gap-3"><CreditCard/> Tarjetas físicas</h1>
    <p className="mt-3 text-slate-600">Solicitudes de tarjeta física Enerpetrol — L 2 por galón en cinco estaciones.</p>
    <section className="mt-8 rounded-2xl bg-white shadow-sm p-6 border border-slate-200">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div><h2 className="font-bold text-xl">Registros</h2><p className="text-slate-600 mt-1">{cargando ? 'Cargando…' : solicitudes.length + ' registros (máximo 1,000 por consulta)'}</p></div>
        <button disabled={cargando || !solicitudes.length || exportando} onClick={exportar} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"><Download size={18}/>{exportando ? 'Preparando…' : 'Descargar Excel'}</button>
      </div>
      {error && <p role="alert" className="text-red-700 mt-4">{error}</p>}
      <div className="overflow-x-auto mt-6"><table className="w-full text-left text-sm">
        <thead><tr className="border-b">{['Fecha','Nombre','Identidad','Vehículo','Placa','Estación','Estado'].map(h=><th className="p-3" key={h}>{h}</th>)}</tr></thead>
        <tbody>{solicitudes.map(s=><tr key={s.id} className="border-b border-slate-100">{[new Date(s.creado_en).toLocaleDateString('es-HN'),s.nombre,s.identidad,s.vehiculo,s.placa,s.estacion,s.estado].map((v,i)=><td className="p-3" key={i}>{v}</td>)}</tr>)}</tbody>
      </table></div>
    </section>
  </div>
}
