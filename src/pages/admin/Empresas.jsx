import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Modal, Badge } from '../../components/AdminUI'

const VACIA = { nombre: '', imagen_url: '', activa: true }

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [conteoClientes, setConteoClientes] = useState({})
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    setLoading(true)
    const [{ data, error }, { data: clientes }] = await Promise.all([
      supabase.from('empresas').select('*').order('nombre'),
      supabase.from('perfiles').select('empresa_id').not('empresa_id', 'is', null),
    ])
    if (error) console.error(error)

    const conteo = {}
    ;(clientes ?? []).forEach((c) => {
      conteo[c.empresa_id] = (conteo[c.empresa_id] || 0) + 1
    })

    setEmpresas(data ?? [])
    setConteoClientes(conteo)
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    const payload = {
      nombre: modal.datos.nombre,
      imagen_url: modal.datos.imagen_url || null,
      activa: modal.datos.activa,
    }

    const { error: dbError } =
      modal.modo === 'crear'
        ? await supabase.from('empresas').insert(payload)
        : await supabase.from('empresas').update(payload).eq('id', modal.datos.id)

    setGuardando(false)
    if (dbError) {
      setError(dbError.message)
      return
    }
    setModal(null)
    cargar()
  }

  const eliminar = async (empresa) => {
    const cantidad = conteoClientes[empresa.id] || 0
    const advertencia =
      cantidad > 0
        ? `"${empresa.nombre}" tiene ${cantidad} cliente(s) vinculado(s). Eliminarla podría afectar su tarjeta corporativa. ¿Continuar?`
        : `¿Eliminar la empresa "${empresa.nombre}"?`
    if (!confirm(advertencia)) return
    const { error } = await supabase.from('empresas').delete().eq('id', empresa.id)
    if (error) {
      alert('No se pudo eliminar: ' + error.message)
      return
    }
    cargar()
  }

  const toggleActiva = async (empresa) => {
    const { error } = await supabase.from('empresas').update({ activa: !empresa.activa }).eq('id', empresa.id)
    if (error) {
      alert('No se pudo actualizar: ' + error.message)
      return
    }
    cargar()
  }

  return (
    <div>
      <PageHeader
        title="Empresas"
        subtitle={`${empresas.length} empresas con convenio corporativo`}
        action={
          <button
            onClick={() => setModal({ modo: 'crear', datos: VACIA })}
            className="flex items-center gap-2 bg-verde-metal hover:brightness-110 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Nueva empresa
          </button>
        }
      />

      <div className="px-8 pb-10">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-x-auto thin-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide border-b border-navy/5">
                <th className="px-6 py-3 font-medium">Empresa</th>
                <th className="px-6 py-3 font-medium">Clientes vinculados</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {!loading &&
                empresas.map((e) => (
                  <tr key={e.id}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {e.imagen_url ? (
                          <img src={e.imagen_url} alt={e.nombre} className="w-8 h-8 rounded-lg object-contain bg-navy/5" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
                            <Building2 size={16} className="text-navy/40" />
                          </div>
                        )}
                        <p className="text-navy font-medium">{e.nombre}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-navy/70">{conteoClientes[e.id] || 0}</td>
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
              {!loading && empresas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-navy/40">
                    Todavía no hay empresas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.modo === 'crear' ? 'Nueva empresa' : 'Editar empresa'} onClose={() => setModal(null)}>
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Nombre</label>
              <input
                required
                value={modal.datos.nombre}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, nombre: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
                placeholder="Ej. Ibex"
              />
            </div>
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Logo (URL de imagen)</label>
              <input
                value={modal.datos.imagen_url || ''}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, imagen_url: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
                placeholder="https://…"
              />
              <p className="text-navy/40 text-xs mt-1.5">Opcional. Sube la imagen a cualquier hosting y pega el link aquí.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-navy/70">
              <input
                type="checkbox"
                checked={modal.datos.activa}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, activa: e.target.checked } })}
              />
              Empresa activa (visible para asignar a clientes)
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando…' : 'Guardar empresa'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
