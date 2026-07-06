import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Modal, Badge } from '../../components/AdminUI'
import { CIUDADES, DEPARTAMENTOS } from '../../lib/constants'

const VACIA = { nombre: '', direccion: '', departamento: DEPARTAMENTOS[0], ciudad: '', descuento: 1, activa: true, lat: '', lng: '' }

export default function Estaciones() {
  const [estaciones, setEstaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null) // null | { modo: 'crear' | 'editar', datos }
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('estaciones').select('*').order('ciudad').order('nombre')
    if (error) console.error(error)
    setEstaciones(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtradas = estaciones.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.ciudad.toLowerCase().includes(busqueda.toLowerCase()) ||
      (e.departamento || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    const payload = {
      nombre: modal.datos.nombre,
      direccion: modal.datos.direccion || null,
      departamento: modal.datos.departamento || null,
      ciudad: modal.datos.ciudad.trim(),
      lat: parseFloat(modal.datos.lat) || 0,
      lng: parseFloat(modal.datos.lng) || 0,
      descuento: parseFloat(modal.datos.descuento) || 0,
      activa: modal.datos.activa,
    }

    const { error: dbError } =
      modal.modo === 'crear'
        ? await supabase.from('estaciones').insert(payload)
        : await supabase.from('estaciones').update(payload).eq('id', modal.datos.id)

    setGuardando(false)
    if (dbError) {
      setError(dbError.message)
      return
    }
    setModal(null)
    cargar()
  }

  const eliminar = async (estacion) => {
    if (!confirm(`¿Eliminar la estación "${estacion.nombre}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('estaciones').delete().eq('id', estacion.id)
    if (error) {
      alert('No se pudo eliminar: ' + error.message)
      return
    }
    cargar()
  }

  const toggleActiva = async (estacion) => {
    const { error } = await supabase.from('estaciones').update({ activa: !estacion.activa }).eq('id', estacion.id)
    if (error) {
      alert('No se pudo actualizar: ' + error.message)
      return
    }
    cargar()
  }

  return (
    <div>
      <PageHeader
        title="Estaciones"
        subtitle={`${estaciones.length} estaciones registradas en la red`}
        action={
          <button
            onClick={() => setModal({ modo: 'crear', datos: VACIA })}
            className="flex items-center gap-2 bg-verde-metal hover:brightness-110 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Nueva estación
          </button>
        }
      />

      <div className="px-8 pb-4">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o ciudad…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-navy/10 text-sm outline-none focus:border-verde bg-white"
          />
        </div>
      </div>

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Estación</th>
                <th className="px-6 py-3 font-medium">Departamento</th>
                <th className="px-6 py-3 font-medium">Ciudad</th>
                <th className="px-6 py-3 font-medium">Descuento</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                filtradas.map((e) => (
                  <tr key={e.id}>
                    <td className="px-6 py-3.5">
                      <p className="text-navy font-medium">{e.nombre}</p>
                      {e.direccion && <p className="text-navy/40 text-xs">{e.direccion}</p>}
                    </td>
                    <td className="px-6 py-3.5 text-navy/70">{e.departamento || '—'}</td>
                    <td className="px-6 py-3.5 text-navy/70">{e.ciudad}</td>
                    <td className="px-6 py-3.5 font-mono text-navy/70">{e.descuento}</td>
                    <td className="px-6 py-3.5">
                      <button onClick={() => toggleActiva(e)}>
                        <Badge tone={e.activa ? 'verde' : 'default'}>{e.activa ? 'Activa' : 'Inactiva'}</Badge>
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setModal({ modo: 'editar', datos: { ...e } })}
                          className="p-2 rounded-lg hover:bg-navy/5 text-navy/60"
                          aria-label="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => eliminar(e)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-navy/40">
                    No se encontraron estaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.modo === 'crear' ? 'Nueva estación' : 'Editar estación'} onClose={() => setModal(null)}>
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Nombre</label>
              <input
                required
                value={modal.datos.nombre}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, nombre: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
            </div>
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Dirección</label>
              <input
                value={modal.datos.direccion || ''}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, direccion: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Departamento</label>
                <select
                  value={modal.datos.departamento || ''}
                  onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, departamento: e.target.value } })}
                  className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm bg-white"
                >
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Ciudad</label>
                <input
                  required
                  list="lista-ciudades"
                  value={modal.datos.ciudad}
                  onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, ciudad: e.target.value } })}
                  placeholder="Escribe o elige una ciudad"
                  className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
                />
                <datalist id="lista-ciudades">
                  {CIUDADES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="text-navy/40 text-xs mt-1.5">Elige una sugerida o escribe una ciudad nueva.</p>
              </div>
            </div>
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Descuento</label>
              <input
                type="number"
                step="0.01"
                value={modal.datos.descuento}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, descuento: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={modal.datos.lat}
                  onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, lat: e.target.value } })}
                  className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
                />
              </div>
              <div>
                <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={modal.datos.lng}
                  onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, lng: e.target.value } })}
                  className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-navy/70">
              <input
                type="checkbox"
                checked={modal.datos.activa}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, activa: e.target.checked } })}
              />
              Estación activa (visible en la app)
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando…' : 'Guardar estación'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
