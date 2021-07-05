import { useLayoutEffect, useEffect } from  'react';
import { ThemeFlatMap, ThemeMap } from './types';

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
 * @param args rest param of args
 * @returns void
 */
export const noop = (...args: any[]) => { };

/**
 * Lightweight unique identifier generator.
 * 
 * @param radix the base mathmatical numeral system.
 * 
 * @returns a unique identifier.
 */
export const genUID = (radix = 16) => '#' + (Math.random() * 0xFFFFFF << 0).toString(radix);

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
 strings.reduce((acc, string, index) => acc + string + (index < args.length ? args[index] : ''), '');

/**
 * Accepts a css variable and converts to camelcase.
 * 
 * @example
 * backgroundColor = fromVar('--background-color');
 * 
 * @param str the string to be converted.
 * @returns a css var string converted to camelcase.
 */
export const fromCSSVar = (str: string) =>
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
export const toCSSVar = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split('-')
    .map(v => v.toLowerCase()).join('-');

/**
 * Flattens a theme object into css key variables and its value.
 * 
 * @param obj an object containing theme vars.
 * @param prefix a prefix to be added to every variable.
 * @param parents optional array when recursing.
 * @returns a flattened object of css variable key and values.
 */
export const flattenVars = (obj: ThemeFlatMap, prefix = '', parents = [] as string[]): Record<string, string> & { toString: () => string; } => {

  let result = {} as Record<string, string>;
  let resultStr = '';

  for (const k in obj) {

    if (Array.isArray(obj[k]) || obj[k] === null || !['object', 'string', 'number'].includes(typeof obj[k])) {
      console.warn(`key ${k} has unsupported type, string, number or plain object supported.`);
      continue;
    }

    if (typeof obj[k] === 'string' || typeof obj[k] === 'number') {
      let key = parents.length ? parents.join('-') + '-' + toCSSVar(k) : toCSSVar(k);
      if (prefix)
        key = prefix + key;
      result[key] = obj[k] + '';
      resultStr += ('  ' + key + ':' + obj[k] + '\n');
    }

    else {
      const nested = flattenVars(obj[k] as ThemeFlatMap, prefix, [...parents, k]);
      resultStr += nested.toString();
      result = {
        ...result,
        ...nested
      };
    }

  }

  result.toString = () => resultStr;

  return result;

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
export const initLocalStorage = <T extends ThemeMap>() => {

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
