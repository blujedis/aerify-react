import { useLayoutEffect } from 'react';
import { ThemeMap, Themes } from './types';
export declare const THEME_NAME = "__aerify_theme__";
export declare const THEME_GLOBALS_NAME = "__aerify_global__";
/**
 * Creates isomorphic hook for useLayoutEffect
 *
 * @returns isomorphic use effect.
 */
export declare const useIsomorphicLayoutEffect: typeof useLayoutEffect;
/**
 * A non-operation function.
 *
 * @param _args rest param of args
 * @returns void
 */
export declare const noop: (..._args: any[]) => void;
/**
 * Lightweight unique identifier generator.
 *
 * @param radix the base mathmatical numeral system.
 * @returns a unique identifier.
 */
export declare const genUID: (radix?: number) => string;
/**
 * Normalizes css string from template literal.
 * NOTE installed the following extension for proper template highlighting.
 *
 * @see https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components
 *
 * @param strings the template strings to process.
 * @param args arg to apply.
 * @returns a normalized css string.
 */
export declare const css: (strings: TemplateStringsArray, ...args: any[]) => string;
/**
 * Accepts a css variable and converts to camelcase.
 *
 * @example
 * backgroundColor = fromVar('--background-color');
 *
 * @param str the string to be converted.
 * @returns a css var string converted to camelcase.
 */
export declare const fromCSSVar: (str?: string) => string;
/**
* Converts a camelcase string to a css variable.
*
* @example
* --background-color = fromVar('backgroundColor');
*
* @param str the string to convert to css variable.
* @returns a string css variable.
*/
export declare const toCSSVar: (str?: string) => string;
/**
 * Flattens a theme object into css key variables and its value.
 *
 * @param obj an object containing theme vars.
 * @param prefix a prefix to be added to every variable.
 * @param parents optional array when recursing.
 * @returns a flattened object of css variable key/values.
 */
export declare const flattenTheme: (obj: ThemeMap, prefix?: string, parents?: string[]) => string;
/**
 * Generates SASS variables for the specified theme.
 *
 * @param obj the theme object to parse as SASS variables or variables in map.
 * @param mapName an optional name for sass map name commonly $vars.
 * @param includeDefault include !default after variable or after map when using mapName.
 * @param parents internally uses when recursing the variables from the theme.
 * @returns a string representation of the theme.
 */
export declare function genSassVars(obj: ThemeMap, mapName?: string | null, includeDefault?: boolean, parents?: string[]): string;
/**
 * Initializes a simple API for interacting with localStorage.
 *
 * @example
 * const storage = initLocalStorage('blue');
 * sorage.set('red');
 * const storedTheme = storage.get();
 *
 * @param defaultTheme a default theme to use when getter returns null.
 * @returns a simple api for interacting with localStorage.
 */
export declare const initLocalStorage: <T extends Themes>() => {
    /**
     * Sets the default theme used ensures theme in localStorage.
     *
     * @param theme the theme to return as default.
     * @returns the default theme.
     */
    init: (defaultTheme: keyof T) => keyof T;
    /**
     * Check if localStorage is is available.
     *
     * @returns boolean indicating if localStorage is present.
     */
    hasStorage: () => boolean;
    /**
     * Gets the currently stored theme in localStorage.
     *
     * @returns the theme stored in localStorage.
     */
    get: () => keyof T | undefined;
    /**
     * Sets the active theme in localStorage.
     *
     * @param theme the currently set theme.
     * @returns void
     */
    set: (theme: keyof T) => void;
};
/**
 * Converts pixel value to rem.
 * NOTE: for this to work html font-size
 * must be set to 62.5%
 *
 * @example
 * 1.6rem = toRem('16px');
 *
 * @param val the value to convert to rem.
 * @returns a string represented in rem.
 */
export declare function toRem(val: string | number): string;
/**
 * Converts rem value to pixels.
 * NOTE: for this to work html font-size
 * must be set to 62.5%
 *
 * @example
 * 16px = toPixels('1.6rem');
 *
 * @param val the value to convert to pixels.
 * @returns a string represented in pixels.
 */
export declare function toPixels(val: string | number): string;
/**
 * Rounds a number with precision in decimals.
 *
 * @param val the value to be rounded.
 * @param precision the precision in decimal places to round
 * @returns a rounded number.
 */
export declare function round(val: string | number, precision?: number): number;
/**
 * Gets the scale between two values.
 *
 * @param newVal the large or new value in the scale.
 * @param oldVal the original or smaller value in the scale.
 * @returns a scale between two values.
 */
export declare const getScale: (newVal: string | number, oldVal: string | number) => number;
/**
 * Scales a value up by a given factor.
 *
 * @param val the value to be scaled up.
 * @param factor the factor by which to scale.
 * @param roundPrecision the rounding precision.
 * @returns a scaled value by provided factor.
 */
export declare const scaleUp: (val: string | number, factor: number, roundPrecision?: number) => number;
/**
 * Scales a value down by a given factor.
 *
 * @param val the value to be scaled down.
 * @param factor the factor by which to scale.
 * @param roundPrecision the rounding precision.
 * @returns a scaled value by provided factor.
 */
export declare const scaleDown: (val: string | number, factor: number, roundPrecision?: number) => number;
/**
 * Scales up from a given value by supplied factor.
 *
 * @example
 * [ 3.92, 5.49, 7.69 ] = createScaleUp(2.8, 1.4, 3)
 *
 * @param val the value to start from.
 * @param factor the factor to use to create the scale.
 * @param count the number of elements to calculate
 * @param roundPrecision the rounding precision (default 2)
 * @returns an array of scaled numbers.
 */
export declare const createScaleUp: (val: string | number, factor: number, count: number, roundPrecision?: number) => any;
/**
 * Scales up from a given value by supplied factor.
 *
 * @example
 * [ 2, 1.43, 1.02 ] = createScaleDown(2.8, 1.4, 3)
 *
 * @param val the value to start from.
 * @param factor the factor to use to create the scale.
 * @param count the number of elements to calculate
 * @param roundPrecision the rounding precision (default 2)
 * @returns an array of scaled numbers.
 */
export declare const createScaleDown: (val: string | number, factor: number, count: number, roundPrecision?: number) => any;
/**
 * Appends node after reference node as sibling.
 *
 * @param node the node to be appended after reference.
 * @param refNode the reference node for appending sibling.
 */
export declare const appendAfter: (node: any, refNode: any) => void;
