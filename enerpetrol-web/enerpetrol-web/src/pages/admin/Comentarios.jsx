import { useEffect, useMemo, useState } from 'react'
import { Search, Download, MessageSquare } from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '../../lib/supabase'
import { PageHeader, StatCard, Badge } from '../../components/AdminUI'
import { formatoFecha } from '../../lib/constants'

const TONOS_CALIFICACION = {
  excelente: 'verde',
  bueno: 'default',
  regular: 'amber',
  malo: 'red',
}

export default function Comentarios() {
  const [comentarios, setComentarios] = useState([])
  const [estaciones, setEstaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstacion, setFiltroEstacion] = useState('todas')
  const [filtroCalificacion, setFiltroCalificacion] = useState('todas')

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const [{ data: filas, error }, { data: listaEstaciones }] = await Promise.all([
        supabase
          .from('calificaciones')
          .select('*, estaciones(id, nombre, ciudad)')
          .order('creado_en', { ascending: false }),
        supabase.from('estaciones').select('id, nombre, ciudad').order('nombre'),
      ])
      if (error) console.error(error)

      const idsClientes = [...new Set((filas ?? []).map((f) => f.cliente_id).filter(Boolean))]
      let perfilesPorId = {}
      if (idsClientes.length > 0) {
        const { data: perfiles } = await supabase
          .from('perfiles')
          .select('id, nombre, numero_tarjeta')
          .in('id', idsClientes)
        perfilesPorId = Object.fromEntries((perfiles ?? []).map((p) => [p.id, p]))
      }

      const filasConCliente = (filas ?? []).map((f) => ({ ...f, perfiles: perfilesPorId[f.cliente_id] || null }))

      setComentarios(filasConCliente)
      setEstaciones(listaEstaciones ?? [])
      setLoading(false)
    }
    cargar()
  }, [])

  const filtrados = useMemo(() => {
    return comentarios.filter((c) => {
      if (filtroEstacion !== 'todas' && String(c.estacion_id) !== filtroEstacion) return false
      if (filtroCalificacion !== 'todas' && c.calificacion !== filtroCalificacion) return false
      if (busqueda) {
        const texto = `${c.comentario || ''} ${c.perfiles?.nombre || ''} ${c.estaciones?.nombre || ''}`.toLowerCase()
        if (!texto.includes(busqueda.toLowerCase())) return false
      }
      return true
    })
  }, [comentarios, filtroEstacion, filtroCalificacion, busqueda])

  const conteos = useMemo(() => {
    const base = { excelente: 0, bueno: 0, regular: 0, malo: 0 }
    filtrados.forEach((c) => {
      if (base[c.calificacion] !== undefined) base[c.calificacion]++
    })
    return base
  }, [filtrados])

  const exportarExcel = () => {
    const filas = filtrados.map((c) => ({
      Fecha: formatoFecha(c.creado_en),
      Cliente: c.perfiles?.nombre || '',
      Tarjeta: c.perfiles?.numero_tarjeta || '',
      Estación: c.estaciones?.nombre || '',
      Ciudad: c.estaciones?.ciudad || '',
      Calificación: c.calificacion,
      Comentario: c.comentario || '',
    }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filas), 'Comentarios')
    const nombreEstacion =
      filtroEstacion === 'todas' ? 'todas-las-estaciones' : (estaciones.find((e) => String(e.id) === filtroEstacion)?.nombre || 'estacion').replace(/\s+/g, '-').toLowerCase()
    XLSX.writeFile(wb, `enerpetrol-comentarios-${nombreEstacion}.xlsx`)
  }

  return (
    <div>
      <PageHeader
        title="Comentarios"
        subtitle={`${comentarios.length} calificaciones registradas en total`}
        action={
          <button
            onClick={exportarExcel}
            disabled={filtrados.length === 0}
            className="flex items-center gap-2 bg-navy hover:bg-navy-card disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download size={16} /> Descargar Excel
          </button>
        }
      />

      <div className="px-8 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Excelente" value={loading ? '—' : conteos.excelente} icon={MessageSquare} accent="verde" />
        <StatCard label="Bueno" value={loading ? '—' : conteos.bueno} icon={MessageSquare} accent="navy" />
        <StatCard label="Regular" value={loading ? '—' : conteos.regular} icon={MessageSquare} accent="amber" />
        <StatCard label="Malo" value={loading ? '—' : conteos.malo} icon={MessageSquare} accent="amber" />
      </div>

      <div className="px-8 pb-4 flex flex-wrap gap-3 items-center">
        <div className="relative max-w-xs flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en comentarios o cliente…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-navy/10 text-sm outline-none focus:border-verde bg-white"
          />
        </div>

        <select
          value={filtroEstacion}
          onChange={(e) => setFiltroEstacion(e.target.value)}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-verde bg-white"
        >
          <option value="todas">Todas las estaciones</option>
          {estaciones.map((e) => (
            <option key={e.id} value={String(e.id)}>
              {e.nombre} — {e.ciudad}
            </option>
          ))}
        </select>

        <select
          value={filtroCalificacion}
          onChange={(e) => setFiltroCalificacion(e.target.value)}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-verde bg-white"
        >
          <option value="todas">Todas las calificaciones</option>
          <option value="excelente">Excelente</option>
          <option value="bueno">Bueno</option>
          <option value="regular">Regular</option>
          <option value="malo">Malo</option>
        </select>
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Estación</th>
                <th className="px-6 py-3 font-medium">Calificación</th>
                <th className="px-6 py-3 font-medium">Comentario</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                filtrados.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-3.5">
                      <p className="text-navy font-medium">{c.perfiles?.nombre || '—'}</p>
                      <p className="text-navy/40 text-xs font-mono">{c.perfiles?.numero_tarjeta}</p>
                    </td>
                    <td className="px-6 py-3.5 text-navy/70">
                      {c.estaciones?.nombre || '—'}
                      <p className="text-navy/40 text-xs">{c.estaciones?.ciudad}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge tone={TONOS_CALIFICACION[c.calificacion] || 'default'}>{c.calificacion}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-navy/70 max-w-sm">
                      {c.comentario || <span className="text-navy/30 text-xs">Sin comentario</span>}
                    </td>
                    <td className="px-6 py-3.5 text-navy/50 text-xs whitespace-nowrap">{formatoFecha(c.creado_en)}</td>
                  </tr>
                ))}
              {!loading && filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-navy/40">
                    No hay comentarios con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
