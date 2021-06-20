import { useEffect } from 'react';
import { useLastRef } from './lastref';

/**
 * Provides setTimeout hook.
 *
 * @param cb callback to run after delay
 * @param timeout the timeout delay (in ms)
 */
export function useTimeout(cb: Function, timeout: number | null) {
  
  const cbRef = useLastRef(cb);

  useEffect(() => {

    if (timeout == null) return undefined;

    const timeoutId = window.setTimeout(() => {
      cbRef.current?.();
    }, timeout);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };

  }, [cbRef, timeout]);

}
