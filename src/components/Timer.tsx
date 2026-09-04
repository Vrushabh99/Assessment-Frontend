import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  /**
   * Total duration in seconds (if showing elapsed time)
   * OR expiration timestamp (if showing remaining time)
   */
  duration?: number;
  expiresAt?: Date | string;
  
  /**
   * Callback when timer reaches zero
   */
  onComplete?: () => void;
  
  /**
   * Show as elapsed time (counts up) or remaining time (counts down)
   * @default "remaining"
   */
  mode?: 'elapsed' | 'remaining';
  
  /**
   * Custom CSS class
   */
  className?: string;
  
  /**
   * Warning threshold in seconds (highlights when below this)
   * @default 300 (5 minutes)
   */
  warningThreshold?: number;
}

const Timer: React.FC<TimerProps> = ({
  duration = 0,
  expiresAt,
  onComplete,
  mode = 'remaining',
  className = '',
  warningThreshold = 300,
}) => {
  const [displayTime, setDisplayTime] = useState<string>('00:00');
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let secondsLeft: number;

      if (expiresAt) {
        const expireTime = new Date(expiresAt).getTime();
        const nowTime = Date.now();
        secondsLeft = Math.floor((expireTime - nowTime) / 1000);
      } else if (mode === 'elapsed') {
        // Not implemented in this version, using duration as total time
        secondsLeft = duration;
      } else {
        // Remaining time mode
        secondsLeft = duration;
      }

      if (secondsLeft <= 0) {
        setDisplayTime('00:00');
        setIsExpired(true);
        setIsWarning(true);
        if (onComplete) onComplete();
        clearInterval(interval);
      } else {
        setDisplayTime(formatTime(secondsLeft));
        setIsWarning(secondsLeft <= warningThreshold);
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, expiresAt, mode, warningThreshold, formatTime, onComplete]);

  const combinedClassName = `
    font-mono text-lg font-semibold tracking-wider
    ${isExpired ? 'text-red-600 animate-pulse' : isWarning ? 'text-orange-600' : 'text-gray-700'}
    ${className}
  `.trim();

  return (
    <div className={combinedClassName} aria-label="Timer">
      {displayTime}
    </div>
  );
};

export default Timer;
