import { useEffect, useState } from 'react';

export function useDebouncedValue(value: string, delay = 350): string {
  const [debounced, setDebounced] = useState(value);
  // TODO(SI 669): Explain why debouncing avoids a remote request for every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
