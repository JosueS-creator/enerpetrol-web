import { useEffect, useMemo, useState } from 'react'
import { Check, X as XIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Badge } from '../../components/AdminUI'
import { formatoFecha, formatoGalones } from '../../lib/constants'

export default function Canjes() {
  const [canjes, setCanjes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('pendiente')
  const [procesando, setProcesando] = useState(null)

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('canjes')
      .select('*, perfiles(id, nombre, numero_tarjeta, galones_acumulados)')
      .order('creado_en', { ascending: false })
    if (error) console.error(error)
    setCanjes(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtrados = useMemo(
    () => (filtroEstado === 'todos' ? canjes : canjes.filter((c) => c.estado === filtroEstado)),
    [canjes, filtroEstado]
  )

  const aprobar = async (canje) => {
    const saldoActual = canje.perfiles?.galones_acumulados || 0
    if (saldoActual < canje.enermonedas) {
      if (!confirm(`Este cliente solo tiene ${formatoGalones(saldoActual)} EM, pero el canje requiere ${canje.enermonedas}. ¿Aprobar de todas formas?`))
        return
    } else if (!confirm(`¿Aprobar este canje? Se descontarán ${canje.enermonedas} EM del saldo del cliente.`)) {
      return
    }

    setProcesando(canje.id)
    const { error: errCanje } = await supabase
      .from('canjes')
      .update({ estado: 'aprobado', resuelto_en: new Date().toISOString() })
      .eq('id', canje.id)

    if (errCanje) {
      alert('Error: ' + errCanje.message)
      setProcesando(null)
      return
    }

    await supabase
      .from('perfiles')
      .update({ galones_acumulados: saldoActual - canje.enermonedas })
      .eq('id', canje.perfiles.id)

    await supabase.from('notificaciones').insert({
      usuario_id: canje.perfiles.id,
      mensaje: `Tu canje de "${canje.descripcion}" fue aprobado. Se descontaron ${canje.enermonedas} EM de tu saldo.`,
    })

    setProcesando(null)
    cargar()
  }

  const rechazar = async (canje) => {
    if (!confirm('¿Rechazar este canje? El saldo del cliente no se modifica.')) return
    setProcesando(canje.id)
    const { error } = await supabase
      .from('canjes')
      .update({ estado: 'rechazado', resuelto_en: new Date().toISOString() })
      .eq('id', canje.id)
    if (error) {
      alert('Error: ' + error.message)
      setProcesando(null)
      return
    }
    await supabase.from('notificaciones').insert({
      usuario_id: canje.perfiles.id,
      mensaje: `Tu canje de "${canje.descripcion}" fue rechazado. Tu saldo de Enermonedas no cambió.`,
    })
    setProcesando(null)
    cargar()
  }

  return (
    <div>
      <PageHeader title="Canjes" subtitle={`${canjes.length} solicitudes de canje registradas`} />

      <div className="mx-8 mb-4 bg-gas-amber/10 border border-gas-amber/30 text-gas-amberDark text-xs rounded-lg px-4 py-3">
        Al aprobar, se descuentan las Enermonedas del saldo del cliente automáticamente. Si tu app móvil ya
        descuenta el saldo al momento de solicitar el canje, avísame para ajustar esta lógica y evitar un doble descuento.
      </div>

      <div className="px-8 pb-4 flex gap-2 flex-wrap">
        {['pendiente', 'aprobado', 'rechazado', 'todos'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filtroEstado === estado ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Premio solicitado</th>
                <th className="px-6 py-3 font-medium">EM requeridas</th>
                <th className="px-6 py-3 font-medium">Saldo actual</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
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
                    <td className="px-6 py-3.5 text-navy/70">{c.descripcion}</td>
                    <td className="px-6 py-3.5 font-mono text-navy/70">{c.enermonedas}</td>
                    <td className="px-6 py-3.5 font-mono text-navy/50">
                      {formatoGalones(c.perfiles?.galones_acumulados)}
                    </td>
                    <td className="px-6 py-3.5 text-navy/50 text-xs">{formatoFecha(c.creado_en)}</td>
                    <td className="px-6 py-3.5">
                      <Badge tone={c.estado === 'aprobado' ? 'verde' : c.estado === 'rechazado' ? 'red' : 'amber'}>
                        {c.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      {c.estado === 'pendiente' && (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => aprobar(c)}
                            disabled={procesando === c.id}
                            className="p-2 rounded-lg hover:bg-verde/10 text-verde disabled:opacity-50"
                            aria-label="Aprobar"
                            title="Aprobar"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => rechazar(c)}
                            disabled={procesando === c.id}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-50"
                            aria-label="Rechazar"
                            title="Rechazar"
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              {!loading && filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-navy/40">
                    No hay canjes con este filtro.
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
