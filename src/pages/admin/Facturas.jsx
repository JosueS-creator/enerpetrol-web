import { useEffect, useMemo, useState } from 'react'
import { Check, X as XIcon, Trash2, ImageIcon, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { procesarReferidoSiAplica } from '../../lib/referidos'
import { PageHeader, Modal, Badge } from '../../components/AdminUI'
import { formatoFecha, formatoGalones } from '../../lib/constants'

export default function Facturas() {
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('pendiente')
  const [modalAprobar, setModalAprobar] = useState(null) // { factura, galones }
  const [modalEditar, setModalEditar] = useState(null) // { factura, galones }
  const [procesando, setProcesando] = useState(false)
  const [avisoReferido, setAvisoReferido] = useState('')

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('facturas')
      .select('*, perfiles(id, nombre, numero_tarjeta), estaciones(nombre, ciudad)')
      .order('creado_en', { ascending: false })
    if (error) console.error(error)
    setFacturas(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtradas = useMemo(
    () => (filtroEstado === 'todas' ? facturas : facturas.filter((f) => f.estado === filtroEstado)),
    [facturas, filtroEstado]
  )

  const urlImagen = (path) => {
    if (!path) return null
    const { data } = supabase.storage.from('Facturas').getPublicUrl(path)
    return data?.publicUrl
  }

  // Ajusta el saldo de Enermonedas del cliente por la diferencia entre lo que
  // tenía acreditado antes y lo que debe quedar acreditado después.
  const ajustarSaldoCliente = async (clienteId, delta) => {
    if (!delta) return
    const { data: perfil, error } = await supabase
      .from('perfiles')
      .select('galones_acumulados')
      .eq('id', clienteId)
      .single()
    if (error || !perfil) return
    await supabase
      .from('perfiles')
      .update({ galones_acumulados: (perfil.galones_acumulados || 0) + delta })
      .eq('id', clienteId)
  }

  const acreditadoSegun = (estado, galones) => (estado === 'aprobada' ? Number(galones || 0) : 0)

  const confirmarAprobacion = async (e) => {
    e.preventDefault()
    setProcesando(true)
    setAvisoReferido('')
    const { factura, galones } = modalAprobar
    const galonesFinal = parseFloat(galones) || 0
    const eraAprobada = factura.estado === 'aprobada'

    const { error: errFactura } = await supabase
      .from('facturas')
      .update({ estado: 'aprobada', galones: galonesFinal, resuelto_en: new Date().toISOString() })
      .eq('id', factura.id)

    if (errFactura) {
      alert('Error al aprobar: ' + errFactura.message)
      setProcesando(false)
      return
    }

    const delta = acreditadoSegun('aprobada', galonesFinal) - acreditadoSegun(factura.estado, factura.galones)
    await ajustarSaldoCliente(factura.perfiles.id, delta)

    if (!eraAprobada) {
      const resultado = await procesarReferidoSiAplica(factura.perfiles.id)
      if (resultado.aplico) {
        setAvisoReferido(`✅ Se acreditó 1 Enermoneda a ${resultado.referidor} por referir a este cliente.`)
      }
    }

    setProcesando(false)
    setModalAprobar(null)
    cargar()
  }

  const rechazar = async (factura) => {
    const advertencia =
      factura.estado === 'aprobada'
        ? `Esta factura ya estaba aprobada y sus ${formatoGalones(factura.galones)} galones fueron acreditados. Al rechazarla, se le restarán esas Enermonedas al cliente. ¿Continuar?`
        : '¿Rechazar esta factura?'
    if (!confirm(advertencia)) return

    const delta = acreditadoSegun('rechazada', factura.galones) - acreditadoSegun(factura.estado, factura.galones)

    const { error } = await supabase
      .from('facturas')
      .update({ estado: 'rechazada', resuelto_en: new Date().toISOString() })
      .eq('id', factura.id)
    if (error) {
      alert('Error: ' + error.message)
      return
    }
    await ajustarSaldoCliente(factura.perfiles.id, delta)
    cargar()
  }

  const confirmarEdicionGalones = async (e) => {
    e.preventDefault()
    setProcesando(true)
    const { factura, galones } = modalEditar
    const galonesFinal = parseFloat(galones) || 0

    const { error } = await supabase.from('facturas').update({ galones: galonesFinal }).eq('id', factura.id)
    if (error) {
      alert('Error: ' + error.message)
      setProcesando(false)
      return
    }

    const delta = acreditadoSegun(factura.estado, galonesFinal) - acreditadoSegun(factura.estado, factura.galones)
    await ajustarSaldoCliente(factura.perfiles.id, delta)

    setProcesando(false)
    setModalEditar(null)
    cargar()
  }

  const eliminar = async (factura) => {
    const advertencia =
      factura.estado === 'aprobada'
        ? 'Esta factura ya fue aprobada. Eliminarla NO revertirá los galones ya acreditados al usuario (usa "Rechazar" primero si quieres revertirlos). ¿Deseas continuar?'
        : '¿Eliminar esta factura permanentemente?'
    if (!confirm(advertencia)) return
    const { error } = await supabase.from('facturas').delete().eq('id', factura.id)
    if (error) {
      alert('Error: ' + error.message)
      return
    }
    cargar()
  }

  return (
    <div>
      <PageHeader title="Facturas" subtitle={`${facturas.length} facturas registradas en total`} />

      {avisoReferido && (
        <div className="mx-8 mb-4 bg-verde/10 border border-verde/30 text-verde-dark text-sm rounded-lg px-4 py-3">
          {avisoReferido}
        </div>
      )}

      <div className="px-8 pb-4 flex gap-2 flex-wrap">
        {['pendiente', 'aprobada', 'rechazada', 'todas'].map((estado) => (
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
                <th className="px-6 py-3 font-medium">Estación</th>
                <th className="px-6 py-3 font-medium">Galones</th>
                <th className="px-6 py-3 font-medium">Factura</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                filtradas.map((f) => (
                  <tr key={f.id}>
                    <td className="px-6 py-3.5">
                      <p className="text-navy font-medium">{f.perfiles?.nombre || '—'}</p>
                      <p className="text-navy/40 text-xs font-mono">{f.perfiles?.numero_tarjeta}</p>
                    </td>
                    <td className="px-6 py-3.5 text-navy/70">
                      {f.estaciones?.nombre || '—'}
                      <p className="text-navy/40 text-xs">{f.estaciones?.ciudad}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-navy/70">{formatoGalones(f.galones)}</span>
                        <button
                          onClick={() => setModalEditar({ factura: f, galones: f.galones })}
                          className="p-1 rounded hover:bg-navy/5 text-navy/40 hover:text-navy"
                          aria-label="Editar galones"
                          title="Editar galones"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      {f.imagen_url ? (
                        <a
                          href={urlImagen(f.imagen_url)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-verde hover:underline text-xs font-medium"
                        >
                          <ImageIcon size={14} /> Ver imagen
                        </a>
                      ) : (
                        <span className="text-navy/30 text-xs">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-navy/50 text-xs">{formatoFecha(f.creado_en)}</td>
                    <td className="px-6 py-3.5">
                      <Badge
                        tone={f.estado === 'aprobada' ? 'verde' : f.estado === 'rechazada' ? 'red' : 'amber'}
                      >
                        {f.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        {f.estado !== 'aprobada' && (
                          <button
                            onClick={() => setModalAprobar({ factura: f, galones: f.galones })}
                            className="p-2 rounded-lg hover:bg-verde/10 text-verde"
                            aria-label="Aprobar"
                            title="Aprobar"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {f.estado !== 'rechazada' && (
                          <button
                            onClick={() => rechazar(f)}
                            className="p-2 rounded-lg hover:bg-gas-amber/10 text-gas-amberDark"
                            aria-label="Rechazar"
                            title="Rechazar"
                          >
                            <XIcon size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => eliminar(f)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-navy/40">
                    No hay facturas con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAprobar && (
        <Modal title="Aprobar factura" onClose={() => setModalAprobar(null)}>
          <form onSubmit={confirmarAprobacion} className="space-y-4">
            <p className="text-navy/60 text-sm">
              Cliente: <span className="font-medium text-navy">{modalAprobar.factura.perfiles?.nombre}</span>
            </p>
            {modalAprobar.factura.estado === 'rechazada' && (
              <p className="text-gas-amberDark text-xs bg-gas-amber/10 rounded-lg px-3 py-2">
                Esta factura estaba rechazada. Al aprobarla se le acreditarán los galones al cliente.
              </p>
            )}
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">
                Galones a acreditar
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={modalAprobar.galones}
                onChange={(e) => setModalAprobar({ ...modalAprobar, galones: e.target.value })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
              <p className="text-navy/40 text-xs mt-1.5">
                Puedes ajustar el monto si la factura muestra un valor distinto al reportado.
              </p>
            </div>
            <button
              type="submit"
              disabled={procesando}
              className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {procesando ? 'Aprobando…' : 'Aprobar y acreditar Enermonedas'}
            </button>
          </form>
        </Modal>
      )}

      {modalEditar && (
        <Modal title="Editar galones de la factura" onClose={() => setModalEditar(null)}>
          <form onSubmit={confirmarEdicionGalones} className="space-y-4">
            <p className="text-navy/60 text-sm">
              Cliente: <span className="font-medium text-navy">{modalEditar.factura.perfiles?.nombre}</span>
            </p>
            {modalEditar.factura.estado === 'aprobada' && (
              <p className="text-gas-amberDark text-xs bg-gas-amber/10 rounded-lg px-3 py-2">
                Esta factura ya está aprobada: el saldo de Enermonedas del cliente se ajustará automáticamente
                por la diferencia.
              </p>
            )}
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Galones</label>
              <input
                type="number"
                step="0.01"
                required
                value={modalEditar.galones}
                onChange={(e) => setModalEditar({ ...modalEditar, galones: e.target.value })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={procesando}
              className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {procesando ? 'Guardando…' : 'Guardar cambio'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
