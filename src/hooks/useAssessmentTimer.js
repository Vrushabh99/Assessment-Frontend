import { useEffect, useState } from 'react'

export function useAssessmentTimer(initialSeconds) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds)

  useEffect(() => {
    if (secondsRemaining <= 0) return undefined
    const timer = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [secondsRemaining])

  return secondsRemaining
}
