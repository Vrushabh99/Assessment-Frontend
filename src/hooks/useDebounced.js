import { useState, useEffect } from 'react'

/**
 * Debounces any changing value. Returns the debounced value, which only
 * updates once `value` has stopped changing for `delay` ms.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}