export const formatSeconds = (totalSeconds) => {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(clamped / 3600)
  const minutes = Math.floor((clamped % 3600) / 60)
  const seconds = clamped % 60

  return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`
}

export const formatMinutes = (input) => {
  const clamped = Math.max(0, Math.floor(input))
  const hours = Math.floor(clamped / 60)
  const minutes = Math.floor(clamped % 60)

  if (hours === 0) {
    return `${String(minutes).padStart(2, '0')}m`
  }
  return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m`
}

export const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '-'
    : `${date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })}`
}