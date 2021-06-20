import { get } from 'dot-prop';

export type Comparator = (a, b) => number;
export type ComparatorPrimer = (val: any) => any;
export type IComparatorOrder = 'asc' | 'desc' | 'ascending' | 'descending' | 0 | 1 | -1;
export type IComparatorTuple = [string, IComparatorOrder];
export type IComparatorField = (string | IComparatorOptions | ComparatorPrimer | IComparatorTuple);

export type IOrderByOptions = IComparatorField | IComparatorField[];

export interface IComparatorOptions {
  key: string;
  primer?: ComparatorPrimer;
  order?: string | number | boolean;
  comparator?: Comparator;
}

function defComparator(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/**
 * Normalizes the comparator to be used.
 * 
 * @param primer optional primer func before ordering.
 * @param order the order to normalize by.
 */
function normalize(primer?: ComparatorPrimer, order?: string | number | boolean) {
  let comp = defComparator;
  if (primer)
    comp = (a, b) => defComparator(primer(a), primer(b));
  if (order && /^(desc|descending|-1|true)/.test(order + ''))
    return (a, b) => {
      return -1 * comp(a, b);
    };
  return comp;
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
export function toOrder(order: number | string | boolean) {
  if (typeof order === 'undefined' || !order)
    return 0;
  if (/^(desc|descending|-1|true)/.test(order + ''))
    return 'desc';
  return 'asc';
}

/**
 * Converts configuration to comparator compatible options for sorting field.
 * 
 * @param field converts comparator field to comparator options for order.  
 * @param primer a primer used to modify property before sorting.
 */
export function toOptions(field: IComparatorField, primer?: ComparatorPrimer): IComparatorOptions {

  let options = field as Required<IComparatorOptions>;

  if (typeof options === 'string') {
    options = { key: field } as Required<IComparatorOptions>;
    options.order = /^-/.test(field + ''); // if prefixed with "-" is reversed.
  }

  else if (Array.isArray(options)) {
    options = { key: field[0] } as Required<IComparatorOptions>;
    options.order = field[1];
  }

  options.order = toOrder(options.order);
  options.primer = options.primer || primer;

  // Normalize the comparator for this field.
  options.comparator = normalize(options.primer, options.order);

  return options;

}

/**
 * Transforms ordering configuration to comparator for sorting.
 * 
 * @param order ordering configuration.
 * @param primer global primer for normalizing data before sort.
 */
export function toComparator(order?: IOrderByOptions, primer?: ComparatorPrimer): Comparator {

  if (typeof order !== undefined && !Array.isArray(order))
    order = [order as IComparatorField];

  let fields = order as IComparatorOptions[];
  fields = fields || [];
  const _primer = primer || (v => v);

  // if fields NOT specified simple sort.
  if (!fields.length) {

    return (a: any, b: any) => {

      a = _primer(a);
      b = _primer(b);

      if (typeof a === 'number' && typeof b === 'number')
        return a - b;

      if (a < b)
        return -1;
      else if (a > b)
        return 1;
      else
        return 0;

    };

  }

  fields = fields.map(f => toOptions(f, primer));

  return (a, b) => {
    let result;
    for (const field of fields) {
      const f = field as Required<IComparatorOptions>;
      result = f.comparator(get(a, f.key) || '', get(b, f.key) || '');
      if (result !== 0)
        break;
    }
    return result;
  };

}

/**
 * Allow for passing directly to array.sort using default comparator
 * 
 * @exmaple 
 * ['one', 'two', 'three'].sort(comparator);
 */
export function comparator() {
  return toComparator();
}

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
export default function orderBy<T>(arr: T[], ...orderingOrPrimer: (IOrderByOptions | ComparatorPrimer | undefined)[]) {

  let ordering: IOrderByOptions = [];
  let primer: ComparatorPrimer | undefined = undefined;

  orderingOrPrimer = orderingOrPrimer.filter(v => typeof v !== 'undefined');

  if (orderingOrPrimer.length) {

    if (typeof orderingOrPrimer[0] === 'function') {
      primer = orderingOrPrimer.shift() as ComparatorPrimer;
      ordering = orderingOrPrimer as IOrderByOptions;
    }

    else if (typeof orderingOrPrimer.slice(-1)[0] === 'function') {
      primer = orderingOrPrimer.pop() as ComparatorPrimer;
      ordering = orderingOrPrimer as IOrderByOptions;
    }

    else {
      ordering = orderingOrPrimer as IOrderByOptions;
    }

  }

  return arr.sort(toComparator(ordering, primer)) as T[];

}