import { CIUDADES } from '../lib/constants'

// Representa la red como una carretera con marcadores de kilometraje por ciudad.
export default function RutaCiudades() {
  return (
    <div className="relative overflow-x-auto thin-scroll pb-6" data-reveal>
      <div className="relative min-w-[900px] px-4">
        {/* Línea de carretera */}
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-navy-line -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-road-lines opacity-70 -translate-y-1/2 animate-drive" />

        <div className="relative flex justify-between items-center py-16">
          {CIUDADES.map((ciudad, i) => (
            <div key={ciudad} className="flex flex-col items-center gap-3 w-[70px] shrink-0">
              {i % 2 === 0 && (
                <span className="font-mono text-[11px] text-white/70 whitespace-nowrap -translate-y-8">
                  {ciudad}
                </span>
              )}
              <span
                className="w-3 h-3 rounded-full bg-gas-amber ring-4 ring-navy-ink animate-pulseDot"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
              {i % 2 !== 0 && (
                <span className="font-mono text-[11px] text-white/70 whitespace-nowrap translate-y-8">
                  {ciudad}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
