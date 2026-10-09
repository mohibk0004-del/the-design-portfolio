import { useEffect, useState } from 'react'

// Windows minimised with the yellow button park here; the dock shows them and restores on click.
const minimized = new Map()
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export function minimize(id, title, restore) {
  minimized.set(id, { id, title, restore })
  emit()
}

export function release(id) {
  if (minimized.delete(id)) emit()
}

export function restore(id) {
  const entry = minimized.get(id)
  if (!entry) return
  minimized.delete(id)
  emit()
  entry.restore()
}

export function useMinimized() {
  const [, force] = useState(0)
  useEffect(() => {
    const update = () => force((n) => n + 1)
    listeners.add(update)
    return () => listeners.delete(update)
  }, [])
  return [...minimized.values()]
}
