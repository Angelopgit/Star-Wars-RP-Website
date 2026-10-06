import { useEffect, useState, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

// Tiny observable store so DOM sections can steer the 3D scene (e.g. selected planet).
function createStore<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set: (next: T) => {
      value = next
      listeners.forEach((l) => l())
    },
    subscribe: (l: () => void) => {
      listeners.add(l)
      return () => {
        listeners.delete(l)
      }
    },
  }
}

export const selectedPlanet = createStore<string>('christophsis')
export const usePlanetId = () => useSyncExternalStore(selectedPlanet.subscribe, selectedPlanet.get)

// Battalion color chosen in the character creator; tints the 3D hologram.
export const holoColor = createStore<string>('#5cc8ff')
export const useHoloColor = () => useSyncExternalStore(holoColor.subscribe, holoColor.get)
