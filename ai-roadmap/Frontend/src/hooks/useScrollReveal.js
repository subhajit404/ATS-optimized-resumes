import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — mirrors the Luminous Labs `.blur-animation` + `.is-act` pattern.
 * Adds `is-visible` class to observed elements when they enter the viewport.
 *
 * @param {object} options - IntersectionObserver options
 * @param {number} options.threshold - 0–1, default 0.12
 * @param {string} options.rootMargin - CSS margin, default '0px 0px -40px 0px'
 * @param {boolean} options.once - remove observer after first trigger (default true)
 * @returns {function} ref callback to attach to a wrapper element
 */
export function useScrollReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
} = {}) {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            if (once) observerRef.current.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { threshold, rootMargin }
    )

    // Observe all elements with [data-reveal] inside document
    const targets = document.querySelectorAll('[data-reveal]')
    targets.forEach((el) => observerRef.current.observe(el))

    return () => observerRef.current.disconnect()
  }, [threshold, rootMargin, once])
}
