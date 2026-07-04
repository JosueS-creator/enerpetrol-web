import { useEffect, useState } from 'react'
import { MapPin, Users, Receipt, Fuel, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, StatCard } from '../../components/AdminUI'
import { formatoFecha, formatoGalones } from '../../lib/constants'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recientes, setRecientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const [estaciones, usuarios, facturas, pendientes, recientesRes] = await Promise.all([
        supabase.from('estaciones').select('id', { count: 'exact', head: true }),
        supabase.from('perfiles').select('id', { count: 'exact', head: true }),
        supabase.from('facturas').select('id', { count: 'exact', head: true }),
        supabase.from('facturas').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente'),
        supabase
          .from('facturas')
          .select('id, galones, estado, creado_en, perfiles(nombre), estaciones(nombre)')
          .order('creado_en', { ascending: false })
          .limit(6),
      ])

      setStats({
        estaciones: estaciones.count ?? 0,
        usuarios: usuarios.count ?? 0,
        facturas: facturas.count ?? 0,
        pendientes: pendientes.count ?? 0,
      })
      setRecientes(recientesRes.data ?? [])
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <div>
      <PageHeader title="Resumen" subtitle="Vista general de la red Enerpetrol en tiempo real" />

      <div className="px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Estaciones activas" value={loading ? '—' : stats.estaciones} icon={MapPin} accent="verde" />
        <StatCard label="Usuarios registrados" value={loading ? '—' : stats.usuarios} icon={Users} accent="navy" />
        <StatCard label="Facturas totales" value={loading ? '—' : stats.facturas} icon={Receipt} accent="navy" />
        <StatCard label="Pendientes de revisar" value={loading ? '—' : stats.pendientes} icon={Clock} accent="amber" />
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm">
          <div className="px-6 py-4 border-b border-navy/5 flex items-center gap-2">
            <Fuel size={16} className="text-verde" />
            <h2 className="font-display text-navy">Facturas recientes</h2>
          </div>
          <div className="divide-y divide-navy/5">
            {!loading && recientes.length === 0 && (
              <p className="px-6 py-8 text-navy/40 text-sm text-center">Aún no hay facturas registradas.</p>
            )}
            {recientes.map((f) => (
              <div key={f.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-navy text-sm font-medium truncate">{f.perfiles?.nombre || 'Cliente'}</p>
                  <p className="text-navy/40 text-xs">
                    {f.estaciones?.nombre || 'Estación'} · {formatoFecha(f.creado_en)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-navy text-sm">{formatoGalones(f.galones)} gal</p>
                  <p
                    className={`text-xs capitalize ${
                      f.estado === 'aprobada' ? 'text-verde' : f.estado === 'rechazada' ? 'text-red-500' : 'text-gas-amberDark'
                    }`}
                  >
                    {f.estado}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
