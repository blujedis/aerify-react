export declare type MapKey = keyof typeof MAP_VALUES;
export declare type MapValues<K extends MapKey> = typeof MAP_VALUES[K];
export declare type MapValue<K extends MapKey> = MapValues<K>[number];
export declare type Variant = MapValue<'variant'>;
export declare type Size = MapValue<'size'>;
export declare type Width = MapValue<'width'>;
export declare type Margin = MapValue<'margin'>;
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
export declare const SEPARATOR = "-";
export declare const VARIANT: readonly ["normal", "primary", "secondary", "danger", "success", "warning"];
export declare const SIZE: readonly ["normal", "small", "large"];
export declare const WIDTH: readonly [];
export declare const MARGIN: readonly [];
export declare const MAP_VALUES: {
    variant: readonly ["normal", "primary", "secondary", "danger", "success", "warning"];
    size: readonly ["normal", "small", "large"];
    width: readonly [];
    margin: readonly [];
};
declare type MappedValues = Record<keyof typeof MAP_VALUES, (prefix: string) => <K extends MapKey>(key: K, value: MapValue<K>, options?: ITransformOptions) => string>;
export declare const MAPPED_TRANSFORMS: MappedValues;
/**
 * Creates a class mapper for the given type/prefix.
 *
 * @param prefix the prefix to create class map for (ex: btn)
 */
export declare function createClassMap(prefix: string): <K extends "variant" | "size" | "width" | "margin">(key: K, value: MapValue<K>, options?: ITransformOptions | undefined) => string;
export {};
