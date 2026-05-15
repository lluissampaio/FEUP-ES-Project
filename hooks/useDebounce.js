import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const timeOutId = setTimeout(() => setVal(value), delay);
    return () => clearTimeout(timeOutId);
  }, [value, delay]);
  return val;
}
