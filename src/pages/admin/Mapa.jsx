import { lazy, Suspense } from 'react'
import { PageHeader } from '../../components/AdminUI'
const MapaEstaciones = lazy(() => import('../../components/MapaEstaciones'))

export default function Mapa() {
  return (
    <div>
      <PageHeader
        title="Mapa"
        subtitle="Todas tus estaciones, con su estado y si tienen bloqueada la acumulación de Enermonedas"
      />
      <div className="px-8 pb-10">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-navy/10 flex items-center justify-center bg-navy-card text-white/50 text-sm" style={{ height: '70vh' }}>
              Cargando mapa…
            </div>
          }
        >
          <MapaEstaciones admin altura="70vh" />
        </Suspense>
      </div>
    </div>
  )
}
