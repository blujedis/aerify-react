/**
 * Couple of helpful links for managing css converting to inline etc.
 *
 * @see https://github.com/reworkcss/css (css parsing)
 * @see https://www.npmjs.com/package/style-to-js (convert style to js object for inline.)
 */
import React, { ReactNode } from 'react';
import type { IThemeContext, Themes, IThemeToggleProps, IThemeSelectProps, Rules, IThemeStyleComponentProps } from './types';
export interface IStyleMap {
    id: string;
    element?: HTMLStyleElement;
    wrap?: string | boolean;
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
export declare const initTheme: <T extends Themes>(themes: T, generateSassVars?: boolean) => {
    Context: React.Context<IThemeContext<T>>;
    Consumer: React.Consumer<IThemeContext<T>>;
    Provider: (props: {
        children: ReactNode;
        theme: keyof T;
    }) => JSX.Element;
    createStyle: {
        (id: string, rules?: Rules | undefined, wrap?: string | boolean | undefined): void;
        (conf: IStyleMap): void;
    };
    useTheme: () => T[keyof T];
    useThemeContext: () => IThemeContext<T>;
    useThemeSwitcher: (animate?: boolean) => {
        theme: keyof T;
        themes: Extract<keyof T, string>[];
        setTheme: (nextTheme: keyof T) => void;
    };
    ThemeGlobals: (props: Omit<IThemeStyleComponentProps, 'id'>) => JSX.Element;
    ThemeStyles: ({ id, children, rules }: IThemeStyleComponentProps) => null;
    ThemeSelector: (props: IThemeSelectProps) => JSX.Element;
    ThemeToggle: (props: IThemeToggleProps<T>) => JSX.Element | null;
};
