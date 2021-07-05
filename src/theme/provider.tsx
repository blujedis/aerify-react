/**
 * Couple of helpful links for managing css converting to inline etc.
 * 
 * @see https://github.com/reworkcss/css (css parsing)
 * @see https://www.npmjs.com/package/style-to-js (convert style to js object for inline.)
 */
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { createSelectStyles, createToggleStyles } from './css';
import { IThemeContext, ThemeMap, IThemeToggleProps, IThemeSelectProps, Rules, IThemeStyleComponentProps, ITheme, ThemeFlatMap } from './types';
import { flattenVars, genUID, initLocalStorage, noop, useIsomorphicLayoutEffect } from './utils';

const DEFAULT_CONTEXT: IThemeContext<any> = {
  themes: {} as any,
  theme: '',
  setTheme: (theme: any) => { }
};

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
const initTheme = <T extends ThemeMap>(themes: T) => {

  if (!themes)
    throw new Error(`A themes map of ThemeMap is required.`);

  const Context = createContext({
    ...DEFAULT_CONTEXT,
    themes
  } as IThemeContext<T>);

  const Consumer = Context.Consumer;
  const styles = new Map<string, HTMLStyleElement>();
  const storage = initLocalStorage();

  Context.displayName = 'ThemeContext';

  const themesFlat = Object.keys(themes).reduce((a, c) => {
    a[c as keyof T] = flattenVars(themes[c] as unknown as ThemeFlatMap, '--');
    return a;
  }, {} as Record<keyof T, Record<string, string> & { toString: () => string; }>);

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

      let style = document.getElementById('__theme__');

      if (!style) {
        style = document.createElement('style');
        style.setAttribute('id', '__theme__');
        document.head.appendChild(style);
      }

      const activeTheme = style?.dataset.theme;

      if (activeTheme !== theme) {
        style.setAttribute('data-theme', theme as string);
        style.innerHTML = `:root {${themesFlat[theme].toString().trim().replace(/\n/g, '')}}`;
      }

    }, [theme]);

    const value = useMemo(() => {

      ensureVars();

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
   * Theme hook provides access to the theme context.
   */
  const useTheme = (): ITheme => {
    const ctx = useThemeContext();
    return ctx.themes[ctx.theme];
  };

  /**
   * A void hook that appends styles to the header by id.
   * 
   * @example
   * const ctx = useStyle('my-style', css`.some-class { }`);
   * 
   * @example
   * const ctx = 
   *    useState('my-style', (theme) => css`.some-class { color: ${theme.font.color}}`);
   * 
   * @param id the id to use for saving the style element.
   * @param rules the style's rules that should be applied.
   * @returns the current theme context.
   */
  const useStyle = (id: string, rules: Rules) => {

    const ctx = useThemeContext();

    useIsomorphicLayoutEffect(() => {

      if (!ctx || !rules || !ctx.theme)
        return;

      const currentStyle = styles.get(id);
      const style = currentStyle || document.createElement('style');

      // TODO: Create method to trim whitespace
      // for now just trim and replace line returns.
      style.innerHTML = (typeof rules === 'function' ? rules(ctx.themes[ctx.theme]) : rules).trim().replace(/\n/g, '');

      if (!currentStyle) {
        style.setAttribute('id', id);
        document.head.appendChild(style);
        styles.set(id, style);
      }

    }, [id, rules, ctx.theme]);

    return ctx;

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
   * A null component that allows you to add styles inline as a component.
   * 
   * @param props theme style component options.
   * @returns a nullable component.
   */
  const ThemeStyles = ({ id, children, rules }: IThemeStyleComponentProps) => {
    id = id || genUID();
    rules = (children || rules) as Rules;
    useStyle(id, rules);
    return null;
  };

  /**
   * A wrapper to which returns a null component but creates a style.
   * 
   * @param props options for global theme.
   * @returns a ThemeStyles nullable component.
   */
  const ThemeGlobals = (props: Omit<IThemeStyleComponentProps, 'id'>) => {
    const id = '__global__';
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
  const ThemeSelector = (props: IThemeSelectProps<T>) => {

    props = {
      color: '#fff',
      backgroundColor: '#323438',
      caretColor: '#bbbbff',
      ...(props as Partial<IThemeSelectProps<T>>)
    } as IThemeSelectProps<T>;

    props.caretColor = (props.caretColor || '').replace('#', '%23');

    const { animate, color, backgroundColor, caretColor, ...rest } = props as Required<IThemeSelectProps<T>>;

    const { themes, setTheme, theme } = useThemeSwitcher(animate);
    const [activeTheme, setActiveTheme] = useState('' as keyof T);

    useStyle('toggle-select', createSelectStyles({ color, backgroundColor, caretColor }));

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
        className="toggle-select"
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

    useStyle('toggle-switch', createToggleStyles({ offColor: offColor, onColor: onColor, dotColor, color: color }));

    useEffect(() => {
      setActiveTheme(theme)
    }, [theme, setTheme]);

    if (!allowedThemes.includes(theme)) {
      console.warn(`Toggle themes [${allowedThemes.join(', ')}] does not contain active theme: ${theme}`);
      return null;
    }

    return (
      <input type="checkbox"
        className="toggle-switch"
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
        if (document && document.head.contains(style)) {
          document.head.removeChild(style);
        }
      });

      styles.clear();

    });

  }

  return {
    Context,
    Consumer,
    Provider,
    useTheme,
    useThemeContext,
    useThemeSwitcher,
    ThemeGlobals,
    ThemeStyles,
    ThemeSelector,
    ThemeToggle
  };

}

export { initTheme };

