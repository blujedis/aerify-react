import { IPagerControllerOptions, PagerCreate, IPagerControllerApi, IPager } from './types';
export declare function useCreateController<T>(props?: IPagerControllerOptions<T>): IPagerControllerApi<T>;
export declare function usePager<T>(props?: IPagerControllerOptions<T> & {
    Pager?: PagerCreate;
}): IPager<T> | null;
