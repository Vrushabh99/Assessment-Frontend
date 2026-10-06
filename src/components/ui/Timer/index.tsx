import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { formatSeconds } from '../../../utils/helpers'

interface TimerDisplayProps {
  $warning?: boolean;
}

const TimerDisplay = styled.div<TimerDisplayProps>`
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $warning, theme }) => ($warning ? '#b54708' : (theme as Record<string, any>).colors.text)};
`

interface UseCountdownOptions {
  minutes: number | null;
  active?: boolean;
  onExpire?: () => void;
}

/**
 * Drift-resistant countdown: computes remaining time from a fixed start
 * timestamp + elapsed wall-clock time on every tick, rather than
 * decrementing a counter — so background-tab throttling or a slow render
 * can't cause the timer to run long.
 */
const useCountdown = ({ minutes, active = true, onExpire }: UseCountdownOptions): number | null => {
  const [remainingMs, setRemainingMs] = useState<number | null>(minutes != null ? minutes * 60 * 1000 : null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef<(() => void) | undefined>(onExpire)
  const hasExpiredRef = useRef<boolean>(false)

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

interface TimerProps extends React.HTMLAttributes<HTMLDivElement> {
  minutes?: number | null;
  active?: boolean;
  warningMinutes?: number;
  onExpire?: () => void;
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
// eslint-disable-next-line react/prop-types
export const Timer: React.FC<TimerProps> = ({ 
  minutes = null,
  active = true,
  warningMinutes = 5,
  onExpire,
  ...rest 
}) => {
  const remainingMs = useCountdown({ minutes, active, onExpire })

  if (!active || remainingMs === null) return null

  const isWarning = warningMinutes != null && remainingMs <= warningMinutes * 60 * 1000

  return (
    <TimerDisplay $warning={isWarning} aria-label="Time remaining" {...rest}>
      <HourglassBottomIcon />
      {formatSeconds(remainingMs / 1000)}
    </TimerDisplay>
  )
}