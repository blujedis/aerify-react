import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

/**
 * Effect called only on update not on mount.
 * 
 * @param cb the useEffect callback.
 * @param deps useEffect callback dependencies for triggering render.
 */
export function useUpdate(cb: EffectCallback, ...deps: DependencyList): boolean {

  const mounted = useRef(false);

  useEffect(() => {

    if (mounted.current)
      return cb();

    mounted.current = true;
    return undefined;

  }, deps);

  return mounted.current;

}