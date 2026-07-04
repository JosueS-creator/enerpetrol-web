import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { PageHeader } from '../../components/AdminUI'
import { formatoGalones, formatoLempiras, formatoFecha } from '../../lib/constants'

const VALOR_POR_PUNTO = 0.15
const COLORES_ESTADO = { aprobada: '#5BAE2F', pendiente: '#F2B705', rechazada: '#EF4444' }

function primerDiaDelMes() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10)
}
function hoy() {
  return new Date().toISOString().slice(0, 10)
}

export default function Reportes() {
  const [desde, setDesde] = useState(primerDiaDelMes())
  const [hasta, setHasta] = useState(hoy())
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('facturas')
        .select('*, perfiles(nombre, numero_tarjeta, ciudad), estaciones(nombre, ciudad)')
        .gte('creado_en', desde)
        .lte('creado_en', hasta + 'T23:59:59')
        .order('creado_en', { ascending: false })
      if (error) console.error(error)
      setFacturas(data ?? [])
      setLoading(false)
    }
    cargar()
  }, [desde, hasta])

  const aprobadas = useMemo(() => facturas.filter((f) => f.estado === 'aprobada'), [facturas])

  const porCiudad = useMemo(() => {
    const mapa = {}
    aprobadas.forEach((f) => {
      const ciudad = f.estaciones?.ciudad || 'Sin ciudad'
      mapa[ciudad] = (mapa[ciudad] || 0) + Number(f.galones || 0)
    })
    return Object.entries(mapa).map(([ciudad, galones]) => ({ ciudad, galones: Number(galones.toFixed(2)) }))
  }, [aprobadas])

  const porEstado = useMemo(() => {
    const mapa = { aprobada: 0, pendiente: 0, rechazada: 0 }
    facturas.forEach((f) => (mapa[f.estado] = (mapa[f.estado] || 0) + 1))
    return Object.entries(mapa).map(([estado, total]) => ({ estado, total }))
  }, [facturas])

  const totalGalones = aprobadas.reduce((acc, f) => acc + Number(f.galones || 0), 0)
  const totalRedimible = totalGalones * VALOR_POR_PUNTO

  const exportarExcel = () => {
    const resumen = porCiudad.map((c) => ({
      Ciudad: c.ciudad,
      'Galones aprobados': c.galones,
      'Valor redimible (L)': Number((c.galones * VALOR_POR_PUNTO).toFixed(2)),
    }))
    resumen.push({
      Ciudad: 'TOTAL',
      'Galones aprobados': Number(totalGalones.toFixed(2)),
      'Valor redimible (L)': Number(totalRedimible.toFixed(2)),
    })

    const detalle = facturas.map((f) => ({
      Fecha: formatoFecha(f.creado_en),
      Cliente: f.perfiles?.nombre || '',
      Tarjeta: f.perfiles?.numero_tarjeta || '',
      Estación: f.estaciones?.nombre || '',
      Ciudad: f.estaciones?.ciudad || '',
      Galones: f.galones,
      Estado: f.estado,
    }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), 'Resumen')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detalle), 'Detalle')
    XLSX.writeFile(wb, `enerpetrol-reporte-${desde}-a-${hasta}.xlsx`)
  }

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Análisis de galones aprobados por ciudad y estado de facturas"
        action={
          <button
            onClick={exportarExcel}
            disabled={loading || facturas.length === 0}
            className="flex items-center gap-2 bg-navy hover:bg-navy-card disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download size={16} /> Exportar Excel
          </button>
        }
      />

      <div className="px-8 pb-6 flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-navy/50 text-xs uppercase tracking-wide mb-1.5">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-verde bg-white"
          />
        </div>
        <div>
          <label className="block text-navy/50 text-xs uppercase tracking-wide mb-1.5">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-verde bg-white"
          />
        </div>
      </div>

      <div className="px-8 grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
          <p className="font-mono text-2xl text-navy">{formatoGalones(totalGalones)}</p>
          <p className="text-navy/50 text-xs uppercase tracking-wide mt-1">Galones aprobados</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
          <p className="font-mono text-2xl text-navy">{formatoLempiras(totalRedimible)}</p>
          <p className="text-navy/50 text-xs uppercase tracking-wide mt-1">Valor total redimible</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
          <p className="font-mono text-2xl text-navy">{facturas.length}</p>
          <p className="text-navy/50 text-xs uppercase tracking-wide mt-1">Facturas en el periodo</p>
        </div>
      </div>

      <div className="px-8 pb-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-navy/5 shadow-sm">
          <h2 className="font-display text-navy mb-4">Galones aprobados por ciudad</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={porCiudad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F2A4A10" />
              <XAxis dataKey="ciudad" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${formatoGalones(v)} gal`} />
              <Bar dataKey="galones" fill="#5BAE2F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-navy/5 shadow-sm">
          <h2 className="font-display text-navy mb-4">Estado de facturas</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={porEstado} dataKey="total" nameKey="estado" innerRadius={50} outerRadius={90}>
                {porEstado.map((entry) => (
                  <Cell key={entry.estado} fill={COLORES_ESTADO[entry.estado]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
