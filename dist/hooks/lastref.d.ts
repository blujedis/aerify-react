import { MutableRefObject } from 'react';
/**
 * Persist ref between renders/update if changes.
 *
 * @param value the value or function to persist.
 */
export declare function useLastRef<T>(value: T): MutableRefObject<T>;
