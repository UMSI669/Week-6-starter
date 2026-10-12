import { useEffect, useState } from 'react';

export function useDebouncedValue(value: string, delay = 350): string {
  const [debounced, setDebounced] = useState(value);
  //QJ Comment: "Debouncing ensures that a function is only called after a certain amount of time has passed since the last invocation, effectively delaying the execution until the user stops typing." 
  //info found from  https://www.geeksforgeeks.org/reactjs/how-to-use-debouncing-and-throttling-with-react-hooks/
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
