import { useEffect, useState } from 'react'
import { song } from '../data/site'

// One shared <audio> for every music widget on the page, playing Apple's 30-second
// preview of the track (the same kind of clip the reference site plays).
let audio = null
let previewUrl = null
let lookup = null
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

function getAudio() {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'none'
    ;['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended'].forEach((type) => audio.addEventListener(type, emit))
  }
  return audio
}

// The iTunes Search API has no CORS headers but supports JSONP, so look the preview up with a script tag.
function findPreview() {
  if (lookup) return lookup
  lookup = new Promise((resolve) => {
    const callback = `songPreview${Date.now()}`
    const script = document.createElement('script')
    const done = (url) => {
      delete window[callback]
      script.remove()
      resolve(url)
    }
    const timer = setTimeout(() => done(null), 8000)
    window[callback] = (data) => {
      clearTimeout(timer)
      const want = song.title.toLowerCase()
      const match = data?.results?.find((r) => r.trackName?.toLowerCase() === want && r.artistName?.toLowerCase().includes(song.artist.toLowerCase().replace(/^the /, '')))
      done(match?.previewUrl ?? null)
    }
    script.onerror = () => {
      clearTimeout(timer)
      done(null)
    }
    script.src = `https://itunes.apple.com/search?term=${encodeURIComponent(`${song.title} ${song.artist}`)}&entity=song&limit=10&callback=${callback}`
    document.head.appendChild(script)
  }).then((url) => {
    previewUrl = url
    emit()
    return url
  })
  return lookup
}

export async function togglePlay() {
  const el = getAudio()
  if (!el.paused) {
    el.pause()
    return
  }
  if (!el.src) {
    const url = previewUrl ?? (await findPreview())
    if (!url) {
      window.open(song.href, '_blank', 'noopener')
      return
    }
    el.src = url
  }
  try {
    await el.play()
  } catch {
    window.open(song.href, '_blank', 'noopener')
  }
}

export function skip(seconds) {
  const el = getAudio()
  if (!el.src) return
  el.currentTime = Math.max(0, Math.min((el.duration || 30) - 0.1, el.currentTime + seconds))
}

export function usePlayer() {
  const [, force] = useState(0)
  useEffect(() => {
    const update = () => force((n) => n + 1)
    listeners.add(update)
    findPreview()
    return () => listeners.delete(update)
  }, [])
  const el = audio
  const duration = el && Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 30
  const current = el?.currentTime ?? 0
  return { playing: Boolean(el && !el.paused), current, duration, progress: Math.min(1, current / duration) }
}

export const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
