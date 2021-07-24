import { EffectCallback, DependencyList } from 'react';
/**
 * Effect called only on update not on mount.
 *
 * @param cb the useEffect callback.
 * @param deps useEffect callback dependencies for triggering render.
 */
export declare function useUpdate(cb: EffectCallback, ...deps: DependencyList): boolean;
