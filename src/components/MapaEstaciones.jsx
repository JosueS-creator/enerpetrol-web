import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { supabase } from '../lib/supabase'

// Mapa 3D interactivo de la red de estaciones, usando OpenFreeMap (gratuito, sin API key).
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

      const map = new maplibregl.Map({
        container: mapDiv.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [-87.0, 14.3],
        zoom: 6.6,
        pitch: 50,
        bearing: -10,
        antialias: true,
      })
      mapRef.current = map

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

      map.on('load', () => {
        try {
          const layers = map.getStyle().layers
          const labelLayer = layers.find((l) => l.type === 'symbol' && l.layout && l.layout['text-field'])
          map.addLayer(
            {
              id: '3d-buildings',
              source: 'openmaptiles',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 13,
              paint: {
                'fill-extrusion-color': '#2A507A',
                'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
                'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                'fill-extrusion-opacity': 0.7,
              },
            },
            labelLayer ? labelLayer.id : undefined
          )
        } catch {
          // el estilo puede no traer datos de edificios en algunas zonas, no es crítico
        }

        estaciones.forEach((e) => {
          const el = document.createElement('div')
          const bloqueada = admin && e.acumula_enermonedas === false
          const inactiva = admin && !e.activa
          el.style.width = '20px'
          el.style.height = '20px'
          el.style.borderRadius = '50%'
          el.style.border = '3px solid #fff'
          el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)'
          el.style.cursor = 'pointer'
          el.style.background = inactiva ? '#94A3B8' : bloqueada ? '#EF4444' : '#5BAE2F'

          const detalleAdmin = admin
            ? `<div style="font-size:11px;margin-top:4px;color:${inactiva ? '#94A3B8' : bloqueada ? '#F87171' : '#5BAE2F'}">
                ${inactiva ? 'Inactiva' : bloqueada ? 'EM bloqueadas' : 'Activa · EM permitidas'}
               </div>`
            : ''

          const popup = new maplibregl.Popup({ offset: 16 }).setHTML(
            `<div style="font-weight:700;font-size:13px;">${e.nombre}</div>
             <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:4px;">${e.ciudad}</div>
             <div style="font-size:12px;color:#5BAE2F;font-weight:600;">Descuento: L ${e.descuento}/gal</div>
             ${detalleAdmin}`
          )

          new maplibregl.Marker({ element: el }).setLngLat([e.lng, e.lat]).setPopup(popup).addTo(map)
        })

        setCargando(false)
      })
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
        <div className="absolute inset-0 flex items-center justify-center bg-navy-ink/80 text-white text-sm">
          Cargando mapa…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-ink/90 text-white text-sm px-6 text-center">
          No se pudo cargar el mapa: {error}
        </div>
      )}
      {admin && !cargando && !error && (
        <div className="absolute bottom-3 left-3 bg-white/95 rounded-lg px-3 py-2 text-[11px] text-navy space-y-1 shadow">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-verde inline-block" /> Activa · EM permitidas</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> EM bloqueadas</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Inactiva</div>
        </div>
      )}
    </div>
  )
}
