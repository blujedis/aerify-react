import { IPaginator, IPaginatorOptions } from './types';
declare function createPaginator<T = any>(options: IPaginatorOptions<T>): IPaginator<T>;
declare function createPaginator<T = any>(items?: string | number | T[], page?: string | number, size?: string | number, pages?: string | number): IPaginator<T>;
export { createPaginator };
