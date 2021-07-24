/**
 * Couple of helpful links for managing css converting to inline etc.
 * 
 * @see https://github.com/reworkcss/css (css parsing)
 * @see https://www.npmjs.com/package/style-to-js (convert style to js object for inline.)
 */
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { createSelectStyles, createToggleStyles, THEME_SELECT_NAME, THEME_TOGGLE_NAME } from './css';
import type { IThemeContext, Themes, IThemeToggleProps, IThemeSelectProps, Rules, IThemeStyleComponentProps } from './types';
import { flattenTheme, genUID, initLocalStorage, noop, useIsomorphicLayoutEffect, THEME_NAME, THEME_GLOBALS_NAME, appendAfter, genSassVars } from './utils';

const DEFAULT_CONTEXT: IThemeContext<any> = {
  themes: {} as any,
  theme: '',
  setTheme: () => { }
};

export interface IStyleMap {
  id: string;
  element?: HTMLStyleElement;
  wrap?: string | boolean; // wraps style with id as selector.
  rules?: Rules;
  extracted?: boolean;
  dynamic?: boolean;
}

/**
 * Initializes the theme context returns context, provider and helper hooks.
 * 
 * @example
 * const themes = { your themes here };
 * const { Provider, ThemeToggle, useTheme } = initTheme(themes);
 * export {
 *  Provider,
 *  ThemeToggle,
 *  useTheme
 * };
 * 
 * @param themes an object containing your themes.
 * @returns a theme context, provider and hooks for managing app themes.
 */
export const initTheme = <T extends Themes>(themes: T, generateSassVars = false) => {

  if (!themes)
    throw new Error(`A themes map of ThemeMap is required.`);

  const Context = createContext({
    ...DEFAULT_CONTEXT,
    themes
  } as IThemeContext<T>);

  const Consumer = Context.Consumer;
  Context.displayName = 'ThemeContext';

  const styles = new Map<string, IStyleMap>();
  const storage = initLocalStorage();
  let themesSass = {} as Record<keyof T, string>;

  // iterate themes and flatten into css vars
  const themesFlat = Object.keys(themes).reduce((a, c) => {
    a[c as keyof T] = flattenTheme(themes[c], '--');
    return a;
  }, {} as Record<keyof T, string>);

  if (generateSassVars)
    themesSass = Object.keys(themes).reduce((a, c) => {
      a[c as keyof T] = genSassVars(themes[c]);
      return a;
    }, {} as Record<keyof T, string>);

  /**
   * Creates and mounts style in collection.
   * 
   * @param id the id of the style.
   * @param rules the css interpolation or function for creating the style.
   * @param wrap when true wraps using id as selector name.
   */
  function createStyle(id: string, rules?: Rules, wrap?: string | boolean): void;

  /**
   * Creates a style and adds to collection.
   * 
   * @param conf the style configuration object.
   */
  function createStyle(conf: IStyleMap): void;
  function createStyle(idOrConf: string | IStyleMap, rules?: Rules, wrap: string | boolean = false) {
    let conf = idOrConf as IStyleMap;
    if (typeof idOrConf !== 'object') {
      conf = {
        id: idOrConf,
        rules,
        wrap
      };
    }
    if (styles.get(conf.id))
      throw new Error(`Attempted to overwrite style \`${conf.id}\`.`);
    styles.set(conf.id, conf);
  }

  const normalizeStyle = (theme: keyof T, id: string, rules: Rules, wrap: string | boolean, compact = false) => {
    const _theme = themes[theme];
    let cssStr = typeof rules === 'function'
      ? rules(_theme)
      : rules;
    if (wrap) {
      const prefix = typeof wrap === 'string' ? wrap : '.';
      cssStr = `${prefix}${id}{\n${cssStr}\n}`;
    }
    if (compact)
      cssStr = cssStr.replace(/\n/g, '');
    return cssStr;
  };

  /**
   * Creates a provider giving access to the theme context.
   * 
   * @example
   * <Provider defaultTheme="dark" >
   *  {children}
   * </Provider>
   * 
   * @param props the child node and optional default theme.
   * @returns the theme context provider.
   */
  const Provider = (props: { children: ReactNode, theme: keyof T }) => {

    const [theme, setTheme] =
      useState(storage.init(props.theme as Extract<keyof T, string>) as keyof T);

    const themeSetter: Dispatch<SetStateAction<keyof T>> = (nextTheme) => {
      storage.set(nextTheme as Extract<keyof T, string>);
      setTheme(nextTheme);
    };

    const ensureVars = useCallback(() => {

      if (typeof document === 'undefined')
        return;

      let style = document.getElementById(THEME_NAME);

      if (!style) {
        style = document.createElement('style');
        style.setAttribute('id', THEME_NAME);
        document.head.appendChild(style);
      }

      const activeTheme = style?.dataset.theme;

      if (activeTheme !== theme) {
        style.setAttribute('data-theme', theme as string);
        style.innerHTML = `:root {${themesFlat[theme].trim().replace(/\n/g, '')}}`;
      }

    }, [theme]);

    const mountStyles = useCallback(() => {
      styles.forEach(style => {
        const { id, rules, wrap, dynamic, extracted, element } = style;
        // shouldn't have dynamic here but...
        if (typeof document !== 'undefined' && (!dynamic && !extracted && !element)) {
          const elem = document.createElement('style');
          elem.setAttribute('id', style.id);
          elem.innerHTML = normalizeStyle(theme, id, rules as Rules, wrap as string, true)
          document.head.appendChild(elem);
          style.element = elem;
        }
      });
    }, []);

    const value = useMemo(() => {

      ensureVars();
      mountStyles();

      return {
        themes,
        theme,
        setTheme: themeSetter
      };

    }, [theme, ensureVars]);

    return (
      <Context.Provider value={value}>
        {props.children}
      </Context.Provider>
    );

  };

  /**
   * Default hook used to create the context.
   * 
   * @returns the IThemeContext
   */
  const useThemeContext = (): IThemeContext<T> => {
    const ctx = useContext(Context);
    if (!ctx.theme)
      console.error(`Theme Context invalid: hook or Component used before mounting Provider.`);
    return ctx;
  }

  /**
   * A hook that appends styles to the header by id.
   * 
   * @example
   * appendStyle('my-style', css`.some-class { }`, 'my-style');
   * 
   * @example
   * appendStyle('my-style', (theme) => css`.some-class { color: ${theme.font.color}}`,  true);
   * 
   * @param rules the style's rules that should be applied.
   * @param id the id to use for saving the style element.
   * @param wrap when true wraps the element as .id_name { rules }
   * @returns the current theme context.
   */
  function appendStyle(id: string, rules: Rules, wrap?: string | boolean) {

    const ctx = useThemeContext();

    useIsomorphicLayoutEffect(() => {

      if (!ctx || !rules || !ctx.theme || styles.get(id as string))
        return;

      const style = document.createElement('style');
      style.innerHTML = normalizeStyle(ctx.theme, id, rules, wrap as string, true);
      style.setAttribute('id', id as string);
      if (id === THEME_GLOBALS_NAME) {
        const parent = document.head.querySelector('#' + THEME_NAME);
        appendAfter(style, parent);
      }
      else {
        document.head.appendChild(style);
      }
      createStyle({ id, element: style, dynamic: true });

    }, [id, rules, ctx.theme]);

  };

  /**
   * Theme switcher hooker provides setter, list of themes and active.
   * 
   * @param animate when true background is animated on theme switch.
   * @returns a hook for switching the theme.
   */
  const useThemeSwitcher = (animate = false) => {

    const ctx = useThemeContext();

    const setTheme = (nextTheme: keyof T) => {

      if (!animate) {
        ctx.setTheme(nextTheme);
        return;
      }

      const body = document.body;
      body.classList.add('fadeIn');
      ctx.setTheme(nextTheme);

      setTimeout(() => {
        body.classList.remove('fadeIn');
      }, 300);

    };

    return {
      theme: ctx.theme,
      themes: Object.keys(ctx.themes) as Extract<keyof T, string>[],
      setTheme
    };

  };

  /**
   * Theme hook provides access to the theme context.
   */
  const useTheme = () => {

    const ctx = useThemeContext();

    // const _addStyle = (id: string, rules: Rules) => {

    // };

    return ctx.themes[ctx.theme];

  };

  /**
   * A null component that allows you to add styles inline as a component.
   * 
   * @param props theme style component options.
   * @returns a nullable component.
   */
  const ThemeStyles = ({ id, children, rules }: IThemeStyleComponentProps) => {
    id = id || genUID();
    rules = (children || rules) as Rules;
    appendStyle(id, rules);
    return null;
  };

  /**
   * A wrapper to which returns a null component but creates a style.
   * 
   * @param props options for global theme.
   * @returns a ThemeStyles nullable component.
   */
  const ThemeGlobals = (props: Omit<IThemeStyleComponentProps, 'id'>) => {
    const id = THEME_GLOBALS_NAME;
    return (
      <ThemeStyles {...props} id={id} />
    );
  };

  /**
  * Provides a drop down selector to change to the desired theme.
  * 
  * @example 
  * <ThemeSwitcher animate  />
  * 
  * @param props theme switcher options and select attributes.
  * @returns a select element for selecting a theme.
  */
  const ThemeSelector = (props: IThemeSelectProps) => {

    props = {
      color: '#fff',
      backgroundColor: '#323438',
      caretColor: '#bbbbff',
      ...(props as Partial<IThemeSelectProps>)
    } as IThemeSelectProps;

    props.caretColor = (props.caretColor || '').replace('#', '%23');

    const { animate, color, backgroundColor, caretColor, ...rest } = props as Required<IThemeSelectProps>;

    const { themes, setTheme, theme } = useThemeSwitcher(animate);
    const [activeTheme, setActiveTheme] = useState('' as keyof T);

    appendStyle(THEME_SELECT_NAME, createSelectStyles({ color, backgroundColor, caretColor }));

    useEffect(() => {
      setActiveTheme(theme)
    }, [theme, setTheme]);

    const getOptions = () => {
      return themes.map(item => {
        return (
          <option key={item} value={item} defaultChecked={item === theme}>{item}</option>
        );
      });
    };

    return (
      <select
        {...rest}
        className={THEME_SELECT_NAME}
        value={activeTheme as string}
        onChange={(e) => setTheme(e.currentTarget.value)} >
        {getOptions()}
      </select>
    );

  };

  /**
   * Creates toggle switch for switching between two themes.
   * NOTE: onChange noop is not in error this is required for
   * bound checkboxes however onChange cannot be used as it will
   * not fire on first mount. This is but one way of handling this.
   * 
   * @example
   * <ThemeToggle animate darkColor="#333" on="dark" off="light" />
   * 
   * @param props theme toggle options and input attributes.
   * @returns an input toggle to switch between two themes.
   */
  const ThemeToggle = (props: IThemeToggleProps<T>) => {

    props = {
      onColor: '#323438',
      offColor: '#9a9ca3',
      dotColor: '#cacaca',
      color: '#ffffff',
      ...(props as Partial<IThemeToggleProps<T>>)
    } as IThemeToggleProps<T>;

    const { animate, on, off, offColor, onColor, dotColor, color, ...rest } = props as Required<IThemeToggleProps<T>>;

    const allowedThemes = [off, on];
    const { theme, setTheme } = useThemeSwitcher(animate);
    const [activeTheme, setActiveTheme] = useState('' as keyof T);

    appendStyle(THEME_TOGGLE_NAME, createToggleStyles({ offColor: offColor, onColor: onColor, dotColor, color: color }));

    useEffect(() => {
      setActiveTheme(theme)
    }, [theme, setTheme]);

    if (!allowedThemes.includes(theme)) {
      console.warn(`Toggle themes [${allowedThemes.join(', ')}] does not contain active theme: ${theme}`);
      return null;
    }

    return (
      <input type="checkbox"
        className={THEME_TOGGLE_NAME}
        onClick={() => setTheme(theme === on ? off : on)}
        checked={activeTheme === on || theme === on}
        onChange={noop}
        {...rest as Partial<IThemeToggleProps<T>>}
      />
    );

  };

  if (module.hot) {
    module.hot.dispose(() => {
      styles.forEach(style => {
        if (document && style.element && document.head.contains(style.element))
          document.head.removeChild(style.element);
      });
      styles.clear();
    });
  }

  return {
    Context,
    Consumer,
    Provider,
    createStyle,
    useTheme,
    useThemeContext,
    useThemeSwitcher,
    ThemeGlobals,
    ThemeStyles,
    ThemeSelector,
    ThemeToggle
  };

};