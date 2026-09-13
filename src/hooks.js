import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// Tween a number toward `target` with an ease-out curve. Interruptions
// (target changing mid-flight) continue from the currently shown value.
// When `snapKey` changes the value jumps instantly instead — for unit
// changes (e.g. currency) where interpolating would pair the new unit
// label with a factually wrong in-between number.
export function useTween(target, { duration = 500, snapKey } = {}) {
  const reduced = usePrefersReducedMotion()
  const [val, setVal] = useState(target)
  const shownRef = useRef(target)
  const rafRef = useRef(0)
  const snapRef = useRef(snapKey)

  useEffect(() => {
    const snapped = snapRef.current !== snapKey
    snapRef.current = snapKey
    if (reduced || snapped) {
      cancelAnimationFrame(rafRef.current)
      shownRef.current = target
      setVal(target)
      return
    }
    const from = shownRef.current
    if (from === target) return
    const t0 = performance.now()
    const step = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (target - from) * eased
      shownRef.current = v
      setVal(v)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, reduced, snapKey])

  return val
}

// One-shot visibility flag for count-up triggers.
export function useInView(ref, threshold = 0.3) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, seen])
  return seen
}
