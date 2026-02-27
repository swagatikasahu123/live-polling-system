import { useState, useEffect, useRef } from 'react';

export function usePollTimer(initialTime: number | null): number | null {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(initialTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (initialTime === null) {
      setTimeRemaining(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setTimeRemaining(initialTime);

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (initialTime <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialTime]);

  return timeRemaining;
}
