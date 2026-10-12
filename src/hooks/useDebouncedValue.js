import { useEffect, useState } from 'react';

// Returns `value` only after it has stopped changing for `delayMs`.
// Used so we don't call TMDB on every keystroke.
//cmt add latency for searching, it does not call until the user stop typing.
export function useDebouncedValue(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
