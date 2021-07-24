import { IToggleStyleProps, ISelectStyleProps } from './types';
export declare const THEME_TOGGLE_NAME = "aerify-theme-toggle";
export declare const THEME_SELECT_NAME = "aerify-theme-select";
export declare const createToggleStyles: ({ offColor, onColor, dotColor, color }: IToggleStyleProps) => string;
export declare const createSelectStyles: ({ color, backgroundColor, caretColor }: ISelectStyleProps) => string;
