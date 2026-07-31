import { useEffect, useMemo, useState } from 'react'
import { Users, Gift } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, StatCard, Badge } from '../../components/AdminUI'
import { formatoFecha } from '../../lib/constants'

const VIGENTE_HASTA = new Date('2026-08-15T23:59:59')

export default function Referidos() {
  const [referidos, setReferidos] = useState([])
  const [perfilesPorId, setPerfilesPorId] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const { data: filas, error } = await supabase
        .from('referidos')
        .select('*')
        .order('creado_en', { ascending: false })

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const ids = [...new Set((filas ?? []).flatMap((f) => [f.referidor_id, f.referido_id]).filter(Boolean))]

      let mapa = {}
      if (ids.length > 0) {
        const { data: perfiles } = await supabase.from('perfiles').select('id, nombre, numero_tarjeta').in('id', ids)
        mapa = Object.fromEntries((perfiles ?? []).map((p) => [p.id, p]))
      }

      setReferidos(filas ?? [])
      setPerfilesPorId(mapa)
      setLoading(false)
    }
    cargar()
  }, [])

  const totalPuntosOtorgados = useMemo(() => referidos.filter((r) => r.punto_otorgado).length, [referidos])

  const hoy = new Date()
  const vigente = hoy <= VIGENTE_HASTA

  return (
    <div>
      <PageHeader
        title="Referidos"
        subtitle={
          vigente
            ? `Programa vigente hasta el 15 de agosto de 2026`
            : `Programa finalizado el 15 de agosto de 2026`
        }
      />

      <div className="px-8 grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Referidos registrados" value={loading ? '—' : referidos.length} icon={Users} accent="navy" />
        <StatCard label="Enermonedas otorgadas" value={loading ? '—' : totalPuntosOtorgados} icon={Gift} accent="verde" />
        <StatCard
          label="Pendientes de otorgar"
          value={loading ? '—' : referidos.length - totalPuntosOtorgados}
          icon={Gift}
          accent="amber"
        />
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Quién invitó</th>
                <th className="px-6 py-3 font-medium">Invitado</th>
                <th className="px-6 py-3 font-medium">Código usado</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                referidos.map((r) => {
                  const referidor = perfilesPorId[r.referidor_id]
                  const referido = perfilesPorId[r.referido_id]
                  return (
                    <tr key={r.id}>
                      <td className="px-6 py-3.5">
                        <p className="text-navy font-medium">{referidor?.nombre || '—'}</p>
                        <p className="text-navy/40 text-xs font-mono">{referidor?.numero_tarjeta}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-navy font-medium">{referido?.nombre || '—'}</p>
                        <p className="text-navy/40 text-xs font-mono">{referido?.numero_tarjeta}</p>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-navy/70">{r.codigo_usado}</td>
                      <td className="px-6 py-3.5 text-navy/50 text-xs">{formatoFecha(r.creado_en)}</td>
                      <td className="px-6 py-3.5">
                        {r.punto_otorgado ? (
                          <Badge tone="verde">✅ 1 EM otorgada</Badge>
                        ) : (
                          <Badge tone="amber">⏳ Pendiente</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              {!loading && referidos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-navy/40">
                    Todavía no hay referidos registrados.
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
