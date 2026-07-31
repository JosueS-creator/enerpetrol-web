import { useEffect, useState, useRef } from 'react'

// Cuenta hacia arriba desde 0 hasta "target" cuando entra en pantalla, imitando
// el rodillo mecánico de un surtidor de gasolina.
export default function OdometroDigit({ target, duration = 1400, suffix = '' }) {
  const [valor, setValor] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValor(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {valor.toLocaleString('es-HN')}
      {suffix}
    </span>
  )
}
