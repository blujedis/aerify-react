import clsx from 'clsx';

export type MapKey = keyof typeof MAP_VALUES;
export type MapValues<K extends MapKey> = typeof MAP_VALUES[K];
export type MapValue<K extends MapKey> = MapValues<K>[number];

export type Variant = MapValue<'variant'>;
export type Size = MapValue<'size'>;
export type Width = MapValue<'width'>;
export type Margin = MapValue<'margin'>;

export interface ITransformOptions {
  /**
   * When true the prefix that's supplied is prepended.
   * @example
   * (prefix: 'btn') => 'btn btn-primary' // otherwise just 'btn-primary'
   */
  includePrefix?: boolean;

  /**
   * Additional classes to extend with.
   */
  extendWith?: string | number | boolean | (string | number | boolean)[];

  /**
   * The separator to use when joining prefix to value.
   */
  separator?: string;

  /**
   * When true a 'default' key results in '' or empty string.
   */
  defaultAsEmpty?: boolean;

}

export const SEPARATOR = '-';

export const VARIANT = [
  'normal',
  'primary',
  'secondary',
  'danger',
  'success',
  'warning',
] as const;

export const SIZE = ['normal', 'small', 'large'] as const;
export const WIDTH = [] as const;
export const MARGIN = [] as const;

export const MAP_VALUES = {
  variant: VARIANT,
  size: SIZE,
  width: WIDTH,
  margin: MARGIN,
};

type MappedValues = Record<
  keyof typeof MAP_VALUES,
  ( prefix: string) => <K extends MapKey>(
    key: K,
    value: MapValue<K>,
    options?: ITransformOptions
  ) => string
>;

export const MAPPED_TRANSFORMS = Object.keys(MAP_VALUES).reduce((a, c) => {
  a[c as keyof MappedValues] = (prefix: string) => createClassMap(prefix);
  return a;
}, {} as MappedValues);

/**
 * Creates a class mapper for the given type/prefix.
 *
 * @param prefix the prefix to create class map for (ex: btn)
 */
export function createClassMap(prefix: string) {

  return <K extends MapKey>(
    key: K,
    value: MapValue<K>,
    options?: ITransformOptions
  ) => {
    options = {
      includePrefix: true,
      separator: SEPARATOR,
      extendWith: [],
      ...options,
    };

    const { includePrefix, extendWith, separator } = options;

    const values = (MAP_VALUES[key] as unknown) as any[];
    
    // Reject warn in console. Should we throw error here?
    if (!values.includes(value)) {
      console.warn(
        `Value ${value} is not contained in values ${values.join(
          ', '
        )} for key ${key}.`
      );
      return '';
    }

    // building up for example 'btn-primary'
    value = (prefix + separator + value) as any;

    // If not including just set to empty string.
    prefix = includePrefix ? prefix : '';

    // Using clsx build up the classNames.
    return clsx(prefix, value, extendWith);
    
  };

}
