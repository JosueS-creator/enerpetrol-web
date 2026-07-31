import { useEffect, useRef } from 'react'

// Agrega la clase "is-visible" a los hijos con [data-reveal] cuando entran en el viewport.
export function useReveal() {
  const containerRef = useRef(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const els = root.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return containerRef
}
