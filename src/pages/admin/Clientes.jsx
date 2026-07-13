
import { useEffect, useState } from 'react'
import { Pencil, Search, Gift } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Modal, Badge } from '../../components/AdminUI'
import { CIUDADES, formatoGalones, formatoFecha, formatoLempiras } from '../../lib/constants'

const UMBRAL_CANJE = 400

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('perfiles').select('*').order('galones_acumulados', { ascending: false })
    if (error) console.error(error)
    setClientes(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtrados = clientes.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.numero_tarjeta?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    const { error: dbError } = await supabase
      .from('perfiles')
      .update({
        nombre: modal.datos.nombre,
        ciudad: modal.datos.ciudad,
        rol: modal.datos.rol,
        galones_acumulados: parseFloat(modal.datos.galones_acumulados) || 0,
        excluido_referidos: modal.datos.excluido_referidos,
      })
      .eq('id', modal.datos.id)

    setGuardando(false)
    if (dbError) {
      setError(dbError.message)
      return
    }
    setModal(null)
    cargar()
  }

  const alcanzoUmbral = clientes.filter((c) => (c.galones_acumulados || 0) >= UMBRAL_CANJE).length

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} cuentas registradas · ${alcanzoUmbral} listas para canjear (≥ ${UMBRAL_CANJE} EM)`}
      />

      <div className="px-8 pb-4">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o tarjeta ENP…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-navy/10 text-sm outline-none focus:border-verde bg-white"
          />
        </div>
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Ciudad</th>
                <th className="px-6 py-3 font-medium">Enermonedas</th>
                <th className="px-6 py-3 font-medium">Valor (L)</th>
                <th className="px-6 py-3 font-medium">Rol</th>
                <th className="px-6 py-3 font-medium">Referidos</th>
                <th className="px-6 py-3 font-medium">Desde</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                filtrados.map((u) => {
                  const em = u.galones_acumulados || 0
                  const listoParaCanjear = em >= UMBRAL_CANJE
                  return (
                    <tr key={u.id} className={listoParaCanjear ? 'bg-gas-amber/10' : ''}>
                      <td className="px-6 py-3.5">
                        <p className="text-navy font-medium">{u.nombre}</p>
                        <p className="text-navy/40 text-xs font-mono">{u.numero_tarjeta}</p>
                      </td>
                      <td className="px-6 py-3.5 text-navy/70">{u.ciudad}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-navy">{formatoGalones(em)}</span>
                          {listoParaCanjear && (
                            <span title={`Alcanzó el umbral de canje (${UMBRAL_CANJE} EM)`}>
                              <Gift size={14} className="text-gas-amberDark" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-navy/50 text-xs">{formatoLempiras(em * 0.15)}</td>
                      <td className="px-6 py-3.5">
                        <Badge tone={u.rol === 'admin' ? 'amber' : 'default'}>{u.rol}</Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        {u.excluido_referidos ? (
                          <Badge tone="red">Excluido</Badge>
                        ) : (
                          <Badge tone="verde">Participa</Badge>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-navy/50 text-xs">{formatoFecha(u.creado_en)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setModal({ datos: { ...u } })}
                            className="p-2 rounded-lg hover:bg-navy/5 text-navy/60"
                            aria-label="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              {!loading && filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-navy/40">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={`Editar cliente · ${modal.datos.numero_tarjeta}`} onClose={() => setModal(null)}>
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Nombre</label>
              <input
                required
                value={modal.datos.nombre}
                onChange={(e) => setModal({ datos: { ...modal.datos, nombre: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Ciudad</label>
                <select
                  value={modal.datos.ciudad}
                  onChange={(e) => setModal({ datos: { ...modal.datos, ciudad: e.target.value } })}
                  className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm bg-white"
                >
                  {CIUDADES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Rol</label>
                <select
                  value={modal.datos.rol}
                  onChange={(e) => setModal({ datos: { ...modal.datos, rol: e.target.value } })}
                  className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm bg-white"
                >
                  <option value="cliente">cliente</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Enermonedas (EM)</label>
              <input
                type="number"
                step="0.01"
                value={modal.datos.galones_acumulados}
                onChange={(e) => setModal({ datos: { ...modal.datos, galones_acumulados: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
              <p className="text-navy/40 text-xs mt-1.5">
                1 galón aprobado = 1 Enermoneda. Ajusta manualmente solo para corregir errores. Umbral de canje: {UMBRAL_CANJE} EM.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-navy/70">
              <input
                type="checkbox"
                checked={!!modal.datos.excluido_referidos}
                onChange={(e) => setModal({ datos: { ...modal.datos, excluido_referidos: e.target.checked } })}
              />
              Excluir del programa de referidos (no gana Enermonedas por referir)
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
