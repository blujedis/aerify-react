import { CSSProperties, Dispatch, SetStateAction, SelectHTMLAttributes, DetailedHTMLProps, InputHTMLAttributes, } from 'react';

export type ThemeColor = CSSProperties['backgroundColor'] | CSSProperties['color'];

export type Rules = string | ((theme: ITheme) => string);

export interface IThemeFont {
  family: CSSProperties['fontFamily'];
  familyMono: CSSProperties['fontFamily'];
  color: string;
  size: string;
  weight: number;
}

export interface IThemeRadius {
  sm: string;
  md: string;
  lg: string;
}

export interface IThemeColor {
  primary: ThemeColor;
  secondary: ThemeColor;
  danger: ThemeColor;
  warning: ThemeColor;
  info: ThemeColor;
  success: ThemeColor;
  white: ThemeColor;
  black: ThemeColor;
  grayDarker: ThemeColor;
  grayDark: ThemeColor;
  gray: ThemeColor;
  grayLight: ThemeColor;
  grayLighter: ThemeColor;
  grayLightest: ThemeColor;
}

export interface IThemeMargin {
  sm: string;
  md: string;
  lg: string;
}

export interface IThemePadding {
  sm: string;
  md: string;
  lg: string;
}

export interface IThemeBody {
  background: string;
}

export interface ITheme {
  body: IThemeBody;
  color: IThemeColor;
  font: IThemeFont;
  radius: IThemeRadius;
  padding: IThemePadding;
  margin: IThemeMargin;
}

export type ThemeValue = string | number;

export type ThemeObject = Record<string, ThemeValue>;

export type ThemeFlatMap = {
  [key: string]: ThemeValue | ThemeObject | ThemeFlatMap;
}

export type ThemeMap = { [key: string]: ITheme };

export interface IThemeContext<T extends ThemeMap> {
  themes: T;
  theme: keyof T;
  setTheme: Dispatch<SetStateAction<keyof T>>;
}

export interface IThemeSelectProps<T> extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, Partial<ISelectStyleProps> {
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
