import tinycolor, { ColorInput } from 'tinycolor2';
import type { ThemeMap, IShades, IShadesInit } from './types';

export type Theme = typeof light;

export const SHADES_BASE = {
  red: 'hsl(357, 91%, 55%)',
  orange: 'hsl(17, 100%, 64%)',
  yellow: 'hsl(54, 100%, 62%)',
  green: 'hsl(98, 62%, 53%)',
  blue: 'hsl(207, 100%, 63%)',
  purple: 'hsl(267, 68%, 60%)',
  magenta: 'hsl(329, 91%, 66%)',
  gray: 'hsl(205, 8%, 49%)'
};

export const THEME_BASE = {

  _config: {
  },

  html: {
    font: {
      size: '62.5%'
    }
  },

  body: {
    background: '#fff',
  },

  color: {
    primary: 'hsl(210, 95%, 45%)',
    success: 'hsl(158, 78%, 43%)',
    warning: 'hsl(26, 89%, 64%)',
    danger: 'hsl(349, 75%, 57%)',
    secondary: 'hsl(0, 0%, 60%)',
    white: 'hsl(0, 100%, 100%)',
    black: 'hsl(0, 0%, 0%)'
  },

  font: {
    family: {
      normal: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, Helvetica Neue, Segoe UI, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
      mono: 'SF Mono, Segoe UI Mono, Roboto Mono, Menlo, Courier, monospace'
    },
    color: '#333',
    size: '1.6rem',
    weight: 300
  },

  position: {
    spacer: '.5rem',
    margin: '1.25rem',
    padding: '1.25rem'
  },

  breakpoint: {
    tablet: '40rem',  // 640 min
    desktop: '80rem', // 1280 min
    wide: '120rem', // 1920 min
    ultrawide: '160rem'
  },

  radius: {
    small: '.2rem',
    normal: '.4rem',
    large: '.6rem'
  },

  close: {
    small: '1.4rem',
    normal: '2rem',
    large: '2.8rem'
  },

  button: {
    font: {
      normal: '.8em',
      small: '.65em',
      large: '1.2em',
    },
    height: {
      small: '3rem',
      normal: '3.8rem',
      large: '5.5rem',
    },
    loading: {
      height: {
        small: '1.6em',
        large: '1.6em',
        normal: '1.6em',
      }
    },
    // darken: {
    //   normal: '8%',
    //   outlined: '15%'
    // }
  },

  toggle: {

    switch: {
      speed: '.15s',
      timing: 'ease-in'
    },

    width: {
      small: '2.5rem',
      normal: '4rem',
      large: '5.6em'
    },

    height: {
      small: '1.5rem',
      normal: '2rem',
      large: '3em'
    },

    gutter: {
      small: '.2rem',
      normal: '.2rem',
      large: '.3rem'
    },

    radius: {
      small: '50%',
      normal: '50%',
      large: '50%'
    },

  },

  slider: {
    width: '100%',
    handle: {
      small: '1rem',
      normal: '1.5rem',
      large: '2rem'
    },
    height: {
      small: '.25rem',
      normal: '.35rem',
      large: '.4rem'
    }
  },

  step: {
    marker: {
      xsmall: '1.4rem',
      small: '2rem',
      normal: '3rem',
      large: '4.5rem'
    },
    bar: {
      xsmall: '.24rem',
      small: '.3rem',
      normal: '.4rem',
      large: '.4rem'
    },
    border: {
      xsmall: '.2rem',
      small: '.2rem',
      normal: '.275rem',
      large: '.375rem'
    }
  },

  pager: {
    height: {
      small: '3rem',
      normal: '4rem',
      large: '6rem'
    }
  }

};

/**
 * Generate light versions of semantic colors.
 * 
 * @param theme the current theme.
 * @param semanticColors an array of semantic color keys.
 * @returns the current theme.
 */
export const createSemanticLight = <C extends Record<string, string>, S extends keyof C>(colors: C, semanticColors = ['primary', 'danger', 'warning', 'success'] as S[]) => {
  return semanticColors.reduce((a, c) => {
    if (colors[c + 'Light'] !== '')
      return a;
    a[c + 'Light'] = tinycolor(colors[c as string]).lighten(0.8).toHslString();
    return a;
  }, colors as any) as Record<keyof C, string>;
};


/**
 * Creates object of color shades based on base color.
 * 
 * @param color the base color to create shades from.
 * @returns an object containing shades from 100-900
 */
export const createShades = (color: ColorInput) => {

  const colors = {
    100: '',
    200: '',
    300: '',
    400: '',
    500: '',
    600: '',
    700: '',
    800: '',
    900: ''
  };

  const keys = Object.keys(colors).reverse();
  const hsl = tinycolor(color).toHsl();

  for (var i = keys.length - 1; i >= 0; i -= 1) {
    hsl.l = (i + 0.5) / keys.length;
    colors[keys[i]] = tinycolor(hsl).toHslString();
  }

  return colors;

};

/**
 * Breaks out each color into Hue, Saturation and Lightness variables.
 * 
 * @param colors the colors to be processed.
 * @returns the theme colors object.
 */
export const breakoutColors = <C extends Record<string, string>>(colors: C) => {
  for (const k in colors) {
    const val = colors[k];
    // semantic colors
    if (typeof val === 'string') {
      const { h, s, l, a } = tinycolor(val).toHsl();
      const hKey = k + 'H' as unknown as keyof C;
      const sKey = k + 'S' as unknown as keyof C;
      const lKey = k + 'L' as unknown as keyof C;
      const aKey = k + 'A' as unknown as keyof C;
      colors[hKey] = h.toFixed(0) + '' as any;
      colors[sKey] = (s * 100).toFixed(0) + '%' as any;
      colors[lKey] = (l * 100).toFixed(0) + '%' as any;
      colors[aKey] = (a * 100).toFixed(0) as any;
    }
    // shades
    else if (typeof val === 'object' && !Array.isArray(val)) {
      colors[k] = breakoutColors(colors[k] as any);
    }

  }
  return colors;
};


/**
 * A simple merge to merge two objects preserving the target 
 * if the source value is undefined. This largely ensures our typings also.
 * 
 * @example
 * const themeNode = 
 *   mergeThemeNode({ font: { size: '1rem'}}, { font: { size: '.9rem', weight: 400  } });
 * themeNode = { font: { size: '1rem', size: 400 }};
 * 
 * @param target the target node to be merged.
 * @param source the source node to merge with.
 * @returns the resulting merged theme node.
 */
export const mergeThemeNode = <T, S>(target: T, source: S = {} as S) => {
  const _target = { ...target } as T & S;
  for (const k in source) {
    if (!Array.isArray(source[k]) && typeof source[k] === 'object' && source[k] !== null) {
      _target[k as any] = mergeThemeNode(target[k as any] || {}, source[k]);
    }
    else if (typeof source[k] !== 'undefined') {
      _target[k as any] = source[k];
    }
  }
  return _target;
};

/**
 * Merges theme prerving default values when source value is undefined. 
 * Creates clone when overrides not present.
 * 
 * @param overrides properties to override the base theme with.
 * @returns a new overridden theme.
 */
export const createTheme = <O extends ThemeMap, S extends Record<keyof IShadesInit, string>, B extends typeof THEME_BASE>(overrides?: O, shades = SHADES_BASE as S, base = THEME_BASE as B) => {
  const theme = mergeThemeNode({ ...base }, overrides || {});
  const colorShades = Object.keys(shades).reduce((a, c) => {
    a[c as keyof S] = createShades(shades[c]);
    return a;
  }, {} as Record<keyof S, IShades>);
  theme.color = mergeThemeNode(theme.color, colorShades);
  // theme.color = createSemanticLight(theme.color);
  theme.color = breakoutColors(theme.color);
  return theme as typeof theme & { color: typeof shades };
};

const light = createTheme();

const dark = createTheme({
  body: {
    background: '#12162b'
  },
  font: {
    color: '#fefefe'
  }
});

export const THEMES = {
  light,
  dark
};

// primaryLight: 'hsl(210, 100%, 36%)',
// successLight: 'hsl(158, 78%, 43%)',
// warningLight: 'hsl(26, 89%, 64%)',
// dangerLight: 'hsl(349, 75%, 57%)',
// grayDarker: '#2e2e2e',
// grayDark: '#3e3e3e',
// gray: '#737e86',
// grayLight: '#d1d1d1',
// grayLighter: '#e1e1e1',
// grayLightest: '#f4f5f6',
