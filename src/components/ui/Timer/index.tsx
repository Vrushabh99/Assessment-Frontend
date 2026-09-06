import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { formatSeconds } from '../../../utils/helpers'

const TimerDisplay = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $warning, theme }) => ($warning ? '#b54708' : theme.colors.text)};
`

/**
 * Drift-resistant countdown: computes remaining time from a fixed start
 * timestamp + elapsed wall-clock time on every tick, rather than
 * decrementing a counter — so background-tab throttling or a slow render
 * can't cause the timer to run long.
 */
const useCountdown = ({ minutes, active = true, onExpire }) => {
  const [remainingMs, setRemainingMs] = useState(minutes != null ? minutes * 60 * 1000 : null)
  const intervalRef = useRef(null)
  const onExpireRef = useRef(onExpire)
  const hasExpiredRef = useRef(false)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (!active || minutes == null) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return undefined
    }

    hasExpiredRef.current = false
    const totalMs = minutes * 60 * 1000
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, totalMs - elapsed)
      setRemainingMs(remaining)

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true
        if (intervalRef.current) clearInterval(intervalRef.current)
        onExpireRef.current?.()
      }
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [minutes, active])

  return remainingMs
}

/**
 * <Timer minutes={45} onExpire={handleSubmit} />
 *
 * - minutes: total countdown duration.
 * - active: set false to pause/hide (e.g. once already submitted) without
 *   unmounting.
 * - warningMinutes: threshold (default 5) below which the display switches
 *   to the warning color.
 * - onExpire: called exactly once when the countdown reaches zero.
 */
export const Timer = ({ minutes, active, warningMinutes, onExpire, ...rest }) => {
  const remainingMs = useCountdown({ minutes, active, onExpire })

  if (!active || remainingMs === null) return null

  const isWarning = remainingMs <= warningMinutes * 60 * 1000

  return (
    <TimerDisplay $warning={isWarning} aria-label="Time remaining" {...rest}>
      <HourglassBottomIcon />
      {formatSeconds(remainingMs / 1000)}
    </TimerDisplay>
  )
}

Timer.propTypes = {
  minutes: PropTypes.number,
  active: PropTypes.bool,
  warningMinutes: PropTypes.number,
  onExpire: PropTypes.func,
}

Timer.defaultProps = {
  minutes: null,
  active: true,
  warningMinutes: 5,
  onExpire: undefined,
}