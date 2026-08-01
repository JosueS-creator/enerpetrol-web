import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Modal, Badge } from '../../components/AdminUI'
import { formatoFecha } from '../../lib/constants'

const VACIA = { mensaje: '', imagen_url: '', activo: true }

export default function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('banners').select('*').order('creado_en', { ascending: false })
    if (error) console.error(error)
    setBanners(data ?? [])
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
      mensaje: modal.datos.mensaje,
      imagen_url: modal.datos.imagen_url || null,
      activo: modal.datos.activo,
    }

    const { error: dbError } =
      modal.modo === 'crear'
        ? await supabase.from('banners').insert(payload)
        : await supabase.from('banners').update(payload).eq('id', modal.datos.id)

    setGuardando(false)
    if (dbError) {
      setError(dbError.message)
      return
    }
    setModal(null)
    cargar()
  }

  const eliminar = async (banner) => {
    if (!confirm('¿Eliminar este banner?')) return
    const { error } = await supabase.from('banners').delete().eq('id', banner.id)
    if (error) {
      alert('No se pudo eliminar: ' + error.message)
      return
    }
    cargar()
  }

  const toggleActivo = async (banner) => {
    const { error } = await supabase.from('banners').update({ activo: !banner.activo }).eq('id', banner.id)
    if (error) {
      alert('No se pudo actualizar: ' + error.message)
      return
    }
    cargar()
  }

  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle={`${banners.length} banners creados · solo los "Activos" se muestran en la app`}
        action={
          <button
            onClick={() => setModal({ modo: 'crear', datos: VACIA })}
            className="flex items-center gap-2 bg-verde-metal hover:brightness-110 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Nuevo banner
          </button>
        }
      />

      <div className="px-8 pb-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          banners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden">
              {b.imagen_url ? (
                <img src={b.imagen_url} alt="" className="w-full h-32 object-cover bg-navy/5" />
              ) : (
                <div className="w-full h-32 bg-navy/5 flex items-center justify-center">
                  <Megaphone size={24} className="text-navy/30" />
                </div>
              )}
              <div className="p-4">
                <p className="text-navy text-sm mb-3 line-clamp-3">{b.mensaje}</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActivo(b)}>
                    <Badge tone={b.activo ? 'verde' : 'default'}>{b.activo ? 'Activo' : 'Inactivo'}</Badge>
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setModal({ modo: 'editar', datos: { ...b } })}
                      className="p-1.5 rounded-lg hover:bg-navy/5 text-navy/60"
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => eliminar(b)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-navy/30 text-[11px] mt-2">{formatoFecha(b.creado_en)}</p>
              </div>
            </div>
          ))}
        {!loading && banners.length === 0 && (
          <p className="text-navy/40 text-sm col-span-full text-center py-10">Todavía no hay banners creados.</p>
        )}
      </div>

      {modal && (
        <Modal title={modal.modo === 'crear' ? 'Nuevo banner' : 'Editar banner'} onClose={() => setModal(null)}>
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Mensaje</label>
              <textarea
                required
                rows={3}
                value={modal.datos.mensaje}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, mensaje: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm resize-none"
                placeholder="Ej. ¡Nuevo descuento de L 3.00 este fin de semana en Tegucigalpa!"
              />
            </div>
            <div>
              <label className="block text-navy/60 text-xs uppercase tracking-wide mb-1.5">Imagen (URL, opcional)</label>
              <input
                value={modal.datos.imagen_url || ''}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, imagen_url: e.target.value } })}
                className="w-full border border-navy/10 rounded-lg px-3 py-2.5 outline-none focus:border-verde text-sm"
                placeholder="https://…"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-navy/70">
              <input
                type="checkbox"
                checked={modal.datos.activo}
                onChange={(e) => setModal({ ...modal, datos: { ...modal.datos, activo: e.target.checked } })}
              />
              Banner activo (visible en la app)
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-verde-metal hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando…' : 'Guardar banner'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
