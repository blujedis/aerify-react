import { useLayoutEffect, useEffect } from 'react';
import { ThemeMap, Themes } from './types';

export const THEME_NAME = '__aerify_theme__';

export const THEME_GLOBALS_NAME = '__aerify_global__';

/**
 * Creates isomorphic hook for useLayoutEffect
 * 
 * @returns isomorphic use effect.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * A non-operation function.
 * 
 * @param _args rest param of args
 * @returns void
 */
export const noop = (..._args: any[]) => { };

/**
 * Lightweight unique identifier generator.
 * 
 * @param radix the base mathmatical numeral system.
 * @returns a unique identifier.
 */
export const genUID = (radix = 16) => '$' + (Math.random() * 0xFFFFFF << 0).toString(radix);

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
export const css = (strings: TemplateStringsArray, ...args: any[]) =>
  strings.reduce(
    (acc, string, index) => acc + string + (index < args.length ? args[index] : ''),
    ''
  );

/**
 * Accepts a css variable and converts to camelcase.
 * 
 * @example
 * backgroundColor = fromVar('--background-color');
 * 
 * @param str the string to be converted.
 * @returns a css var string converted to camelcase.
 */
export const fromCSSVar = (str = '') =>
  ((str.match(/[a-z0-9]{1,}-[a-z0-9]{1,}/gi) || [])[0] || '')
    .split('-')
    .map((v: string, i: number) => {
      if (i === 0) return v;
      return v.charAt(0).toUpperCase() + v.slice(1);
    })
    .join('');

/**
* Converts a camelcase string to a css variable.
* 
* @example
* --background-color = fromVar('backgroundColor');
* 
* @param str the string to convert to css variable.
* @returns a string css variable.
*/
export const toCSSVar = (str = '') => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split('-')
    .map(v => v.toLowerCase()).join('-');
}

/**
 * Flattens a theme object into css key variables and its value.
 * 
 * @param obj an object containing theme vars.
 * @param prefix a prefix to be added to every variable.
 * @param parents optional array when recursing.
 * @returns a flattened object of css variable key/values.
 */
export const flattenTheme = (obj: ThemeMap, prefix = '', parents = [] as string[]) => {

  let str = '';

  for (const k in obj) {

    const val = obj[k];

    if (Array.isArray(val) || val === null || !['string', 'number', 'object'].includes(typeof val)) {
      console.warn(`key ${k} has unsupported type, string, number or plain object supported.`);
      continue;
    }

    else if (typeof val === 'object') {
      const nested = flattenTheme(val, prefix, [...parents, k]);
      str += nested;
    }

    else {
      let key = parents.length ? parents.join('-') + '-' + toCSSVar(k) : toCSSVar(k);
      if (prefix)
        key = prefix + key;
      str += ('  ' + key + ':' + val + ';\n');
    }

  }

  return str;

};

/**
 * Generates SASS variables for the specified theme.
 * 
 * @param obj the theme object to parse as SASS variables or variables in map.
 * @param mapName an optional name for sass map name commonly $vars.
 * @param includeDefault include !default after variable or after map when using mapName.
 * @param parents internally uses when recursing the variables from the theme.
 * @returns a string representation of the theme.
 */
export function genSassVars(obj: ThemeMap, mapName: string | null = '$vars', includeDefault = true, parents: string[] = []) {

  let str = '';

  for (const k in obj) {

    const val = obj[k];

    if (Array.isArray(val) || val === null || !['string', 'number', 'object'].includes(typeof val)) {
      console.warn(`key ${k} has unsupported type, string, number or plain object supported.`);
      continue;
    }

    else if (typeof val === 'object') {
      const nested = genSassVars(val, mapName, includeDefault, [...parents, k]);
      str += nested;
    }

    else {
      const key = parents.length ? parents.join('-') + '-' + toCSSVar(k) : toCSSVar(k);
      const suffix = includeDefault && !mapName ? ' !default;\n' : !includeDefault && !mapName ? ';\n' : ',\n';
      let line = !mapName ? `$${key}: ${val}${suffix}` : `  ${key}: ${val}${suffix}`;
      str += line;
    }

  }

  if (mapName && !parents.length)
    return (includeDefault ? `${mapName}: (\n${str}) !default;` : `${mapName}: (\n${str});`);

  return str;


};

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
export const initLocalStorage = <T extends Themes>() => {

  const key = '__theme__';

  const api = {

    /**
     * Sets the default theme used ensures theme in localStorage.
     * 
     * @param theme the theme to return as default.
     * @returns the default theme.
     */
    init: (defaultTheme: keyof T) => {
      const currentTheme = api.get();
      if (!currentTheme)
        api.set(defaultTheme);
      return currentTheme || defaultTheme;
    },

    /**
     * Check if localStorage is is available.
     * 
     * @returns boolean indicating if localStorage is present.
     */
    hasStorage: () => {
      return typeof localStorage !== 'undefined';
    },

    /**
     * Gets the currently stored theme in localStorage.
     * 
     * @returns the theme stored in localStorage.
     */
    get: () => {
      if (!api.hasStorage()) return;
      return localStorage.getItem(key) as keyof T;
    },

    /**
     * Sets the active theme in localStorage.
     * 
     * @param theme the currently set theme.
     * @returns void
     */
    set: (theme: keyof T) => {
      if (!api.hasStorage()) return;
      localStorage.setItem(key, theme as Extract<keyof T, string>);
    }

  };

  return api;

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
export function toRem(val: string | number) {
  const parsed = parseInt(val + '', 10);
  const result = parsed / 10;
  return result + 'rem';

};

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
export function toPixels(val: string | number) {
  const parsed = parseFloat(val + '');
  const result = parsed * 10;
  return result + 'px';
};

/**
 * Rounds a number with precision in decimals.
 * 
 * @param val the value to be rounded.
 * @param precision the precision in decimal places to round
 * @returns a rounded number.
 */
export function round(val: string | number, precision = 2) {
  val = parseFloat(val + '');
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(val * multiplier) / multiplier;
}

/**
 * Gets the scale between two values. 
 * 
 * @param newVal the large or new value in the scale.
 * @param oldVal the original or smaller value in the scale.
 * @returns a scale between two values.
 */
export const getScale = (newVal: string | number, oldVal: string | number) => {
  return parseFloat(newVal + '') / parseFloat(oldVal + '');
};

/**
 * Scales a value up by a given factor.
 * 
 * @param val the value to be scaled up.
 * @param factor the factor by which to scale.
 * @param roundPrecision the rounding precision.
 * @returns a scaled value by provided factor.
 */
export const scaleUp = (val: string | number, factor: number, roundPrecision = 0) => {
  val = parseFloat(val + '');
  let result = val * factor;
  if (roundPrecision)
    return round(result, roundPrecision);
  return result;
};

/**
 * Scales a value down by a given factor.
 * 
 * @param val the value to be scaled down.
 * @param factor the factor by which to scale.
 * @param roundPrecision the rounding precision.
 * @returns a scaled value by provided factor.
 */
export const scaleDown = (val: string | number, factor: number, roundPrecision = 0) => {
  val = parseFloat(val + '');
  let result = val / factor;
  if (roundPrecision)
    return round(result, roundPrecision);
  return result;
};

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
export const createScaleUp = (val: string | number, factor: number, count: number, roundPrecision = 2) => {
  const arr = new Array(count).fill(0);
  return arr.reduce(a => {
    const nextVal = round(scaleUp(a.previous, factor), roundPrecision);
    a.previous = nextVal;
    a.result.push(nextVal);
    return a;
  }, { result: [], previous: val }).result;
};

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
export const createScaleDown = (val: string | number, factor: number, count: number, roundPrecision = 2) => {
  const arr = new Array(count).fill(0);
  return arr.reduce(a => {
    const nextVal = round(scaleDown(a.previous, factor), roundPrecision);
    a.previous = nextVal;
    a.result.push(nextVal);
    return a;
  }, { result: [], previous: val }).result;
};

/**
 * Appends node after reference node as sibling.
 * 
 * @param node the node to be appended after reference.
 * @param refNode the reference node for appending sibling.
 */
export const appendAfter = (node, refNode) => {
  refNode.parentNode.insertBefore(node, refNode.nextSibling);
};

