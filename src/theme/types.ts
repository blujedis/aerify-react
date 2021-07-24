import { CSSProperties, Dispatch, SetStateAction, SelectHTMLAttributes, DetailedHTMLProps, InputHTMLAttributes, } from 'react';

export type ThemeColor = CSSProperties['backgroundColor'] | CSSProperties['color'];

export type ThemeProp = string | number | Record<string, string | number>;

export type ThemeMap = {
  [key: string]: ThemeProp | ThemeMap;
}

export type Rules = string | ((theme: ThemeMap) => string);

export type ThemeFlatMap = {
  [key: string]: string | number;
}

export type Themes = { [key: string]: ThemeMap };

export interface IThemeContext<T extends Themes> {
  themes: T;
  theme: keyof T;
  setTheme: Dispatch<SetStateAction<keyof T>>;
}

export interface IThemeSelectProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, Partial<ISelectStyleProps> {
  animate?: boolean;
}

export interface IThemeToggleProps<T> extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, Partial<IToggleStyleProps> {
  off: keyof T;
  on: keyof T;
  offColor?: string;
  onColor?: string;
  dotColor?: string;
  color?: string;
  animate?: boolean;
}

export interface IToggleStyleProps {
  offColor: string;
  onColor: string;
  dotColor: string;
  color: string;
}

export interface ISelectStyleProps {
  color: string;
  backgroundColor: string;
  caretColor: string;
}

export interface IThemeStyleComponentProps {
  id?: string;
  children?: string;
  rules?: Rules
}

export interface IShades {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface IShadesInit {
  red: IShades;
  orange: IShades;
  yellow: IShades;
  green: IShades;
  blue: IShades;
  purple: IShades;
  magenta: IShades;
  gray: IShades;
}