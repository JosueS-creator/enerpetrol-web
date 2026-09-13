import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../lib/supabase'

// Mapa 2D de la red de estaciones con Leaflet + OpenStreetMap (gratuito, sin API key).
// Se eligió Leaflet (sin WebGL/3D) después de que la versión 3D con MapLibre
// se trababa en dispositivos reales, incluida una laptop de gama media.
// admin=false → landing público: solo estaciones activas, popup simple.
// admin=true  → panel admin: todas las estaciones, popup con más detalle y color por estado.
export default function MapaEstaciones({ admin = false, altura = '480px' }) {
  const mapDiv = useRef(null)
  const mapRef = useRef(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelado = false

    const iniciar = async () => {
      let query = supabase.from('estaciones').select('id, nombre, ciudad, descuento, activa, acumula_enermonedas, lat, lng')
      if (!admin) query = query.eq('activa', true)
      const { data, error: dbError } = await query

      if (cancelado) return
      if (dbError) {
        setError(dbError.message)
        setCargando(false)
        return
      }

      const estaciones = (data ?? []).filter((e) => e.lat && e.lng && !(e.lat === 0 && e.lng === 0))

      const map = L.map(mapDiv.current, {
        center: [14.3, -87.0],
        zoom: 7,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      estaciones.forEach((e) => {
        const bloqueada = admin && e.acumula_enermonedas === false
        const inactiva = admin && !e.activa
        const color = inactiva ? '#94A3B8' : bloqueada ? '#EF4444' : '#5BAE2F'

        const icono = L.divIcon({
          className: '',
          html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })

        const detalleAdmin = admin
          ? `<div style="font-size:11px;margin-top:4px;color:${color};font-weight:600;">
              ${inactiva ? 'Inactiva' : bloqueada ? 'EM bloqueadas' : 'Activa · EM permitidas'}
             </div>`
          : ''

        L.marker([e.lat, e.lng], { icon: icono })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:inherit;">
               <div style="font-weight:700;font-size:13px;color:#0F2A4A;">${e.nombre}</div>
               <div style="font-size:11px;color:#64748B;margin-bottom:4px;">${e.ciudad}</div>
               <div style="font-size:12px;color:#458023;font-weight:600;">Descuento: L ${e.descuento}/gal</div>
               ${detalleAdmin}
             </div>`
          )
      })

      setCargando(false)
    }

    iniciar()

    return () => {
      cancelado = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [admin])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-navy/10" style={{ height: altura }}>
      <div ref={mapDiv} className="w-full h-full" />
      {cargando && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-ink/80 text-white text-sm pointer-events-none">
          Cargando mapa…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-ink/90 text-white text-sm px-6 text-center">
          No se pudo cargar el mapa: {error}
        </div>
      )}
      {admin && !cargando && !error && (
        <div className="absolute bottom-3 left-3 bg-white/95 rounded-lg px-3 py-2 text-[11px] text-navy space-y-1 shadow z-[1000]">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-verde inline-block" /> Activa · EM permitidas</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> EM bloqueadas</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Inactiva</div>
        </div>
      )}
    </div>
  )
}
