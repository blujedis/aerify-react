export declare type Comparator = (a: any, b: any) => number;
export declare type ComparatorPrimer = (val: any) => any;
export declare type IComparatorOrder = 'asc' | 'desc' | 'ascending' | 'descending' | 0 | 1 | -1;
export declare type IComparatorTuple = [string, IComparatorOrder];
export declare type IComparatorField = (string | IComparatorOptions | ComparatorPrimer | IComparatorTuple);
export declare type IOrderByOptions = IComparatorField | IComparatorField[];
export interface IComparatorOptions {
    key: string;
    primer?: ComparatorPrimer;
    order?: string | number | boolean;
    comparator?: Comparator;
}
/**
 * Normalizes ordering detecting if neutral, asc or desc.
 *
 * @example
 * toOrder(-1) => 'desc'
 * toOrder(0) => 0
 * toOrder('-name') => 'desc'
 *
 * @param order the value to normalize as order.
 */
export declare function toOrder(order: number | string | boolean): "asc" | "desc" | 0;
/**
 * Converts configuration to comparator compatible options for sorting field.
 *
 * @param field converts comparator field to comparator options for order.
 * @param primer a primer used to modify property before sorting.
 */
export declare function toOptions(field: IComparatorField, primer?: ComparatorPrimer): IComparatorOptions;
/**
 * Transforms ordering configuration to comparator for sorting.
 *
 * @param order ordering configuration.
 * @param primer global primer for normalizing data before sort.
 */
export declare function toComparator(order?: IOrderByOptions, primer?: ComparatorPrimer): Comparator;
/**
 * Allow for passing directly to array.sort using default comparator
 *
 * @exmaple
 * ['one', 'two', 'three'].sort(comparator);
 */
export declare function comparator(): Comparator;
/**
 * Orders arrays of objects by property, falls back to .sort() if no fields are specified.
 *
 * @example
 * const arr = [{ name: 'bob', age: 30 }, { name: 'john', age: 22 }];
 * orderBy(arr, ['age', 'name']);
 * orderBy(arr, ['age', '-name']); // makes name desc.
 * orderBy(arr, { key: 'name', order: 'desc', primer: primerFunc });
 * orderBy(arr, ['age', 'name'], primerFunc);
 * orderBy(arr, [[age, 'asc'], [name, 'desc']])
 *
 *
 * Order property: asc, ascending, desc, descending, 1, -1, 0
 * Primer property: a method that accepts single value and is run as a preprocessor before sorting.
 *
 * @param arr the collection to be sorted.
 * @param order an array of field names or comparator options.
 */
export default function orderBy<T>(arr: T[], ...orderingOrPrimer: (IOrderByOptions | ComparatorPrimer | undefined)[]): T[];
