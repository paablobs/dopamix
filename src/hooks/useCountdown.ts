import { useState, useEffect, useCallback } from 'react';

export function useCountdown(targetSeconds: number, startTime: number) {
  const [remaining, setRemaining] = useState(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(0, targetSeconds - elapsed);
  });

  const reset = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    setRemaining(Math.max(0, targetSeconds - elapsed));
  }, [targetSeconds, startTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const r = Math.max(0, targetSeconds - elapsed);
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetSeconds, startTime]);

  return { remaining, isDone: remaining <= 0, reset };
}
