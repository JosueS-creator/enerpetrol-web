import { useEffect, useState } from 'react'
import { Pencil, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Modal, Badge } from '../../components/AdminUI'
import { CIUDADES, formatoGalones, formatoFecha } from '../../lib/constants'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('perfiles').select('*').order('creado_en', { ascending: false })
    if (error) console.error(error)
    setUsuarios(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtrados = usuarios.filter(
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

  return (
    <div>
      <PageHeader title="Usuarios" subtitle={`${usuarios.length} cuentas registradas`} />

      <div className="px-8 pb-4">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o tarjeta…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-navy/10 text-sm outline-none focus:border-verde bg-white"
          />
        </div>
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Usuario</th>
                <th className="px-6 py-3 font-medium">Tarjeta</th>
                <th className="px-6 py-3 font-medium">Ciudad</th>
                <th className="px-6 py-3 font-medium">Galones</th>
                <th className="px-6 py-3 font-medium">Rol</th>
                <th className="px-6 py-3 font-medium">Desde</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                filtrados.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-3.5 text-navy font-medium">{u.nombre}</td>
                    <td className="px-6 py-3.5 font-mono text-navy/60 text-xs">{u.numero_tarjeta}</td>
                    <td className="px-6 py-3.5 text-navy/70">{u.ciudad}</td>
                    <td className="px-6 py-3.5 font-mono text-navy/70">{formatoGalones(u.galones_acumulados)}</td>
                    <td className="px-6 py-3.5">
                      <Badge tone={u.rol === 'admin' ? 'amber' : 'default'}>{u.rol}</Badge>
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
                ))}
              {!loading && filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-navy/40">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={`Editar usuario · ${modal.datos.numero_tarjeta}`} onClose={() => setModal(null)}>
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
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Galones acumulados</label>
              <input
                type="number"
                step="0.01"
                value={modal.datos.galones_acumulados}
                onChange={(e) => setModal({ datos: { ...modal.datos, galones_acumulados: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
              <p className="text-navy/40 text-xs mt-1.5">
                Ajusta este valor manualmente solo si necesitas corregir un error. Normalmente se actualiza al aprobar facturas.
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-verde hover:bg-verde-light disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
