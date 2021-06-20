import { useRef, useEffect, MutableRefObject } from 'react';

/**
 * Persist ref between renders/update if changes.
 *
 * @param value the value or function to persist.
 */
export function useLastRef<T>(value: T): MutableRefObject<T> {

  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;

}
