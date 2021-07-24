import { css } from './utils';
import { IToggleStyleProps, ISelectStyleProps } from './types';

export const THEME_TOGGLE_NAME = 'aerify-theme-toggle';

export const THEME_SELECT_NAME = 'aerify-theme-select';

export const createToggleStyles =
  ({ offColor, onColor, dotColor, color }: IToggleStyleProps) => css`
  
  ${'.' + THEME_TOGGLE_NAME} {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 72px;
    height: 28px;
    display: inline-block;
    position: relative;
    border-radius: 50px;
    overflow: hidden;
    outline: none;
    cursor: pointer;
    background-color: ${offColor};
    transition: background-color ease 0.3s;
  }

  
  ${'.' + THEME_TOGGLE_NAME}:before {
    content: "dark light";
    display: block;
    position: absolute;
    z-index: 2;
    width: 28px;
    height: 28px;
    left: 0px;
    top: 0px;
    border-radius: 50%;
    font: 10px/28px Helvetica;
    text-transform: uppercase;
    font-weight: bold;
    text-indent: -32px;
    word-spacing: 32px;
    color: ${color};
    background: ${dotColor};
    text-shadow: -1px -1px rgba(0,0,0,0.15);
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
    }
  
    ${'.' + THEME_TOGGLE_NAME}:checked {
      background-color: ${onColor};
    }
  
    ${'.' + THEME_TOGGLE_NAME}:checked:before {
      left: 42px;
    }
  
  `;

export const createSelectStyles = ({ color, backgroundColor, caretColor }: ISelectStyleProps) => css`
     ${'.' + THEME_SELECT_NAME} {
      background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='${caretColor}' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>") no-repeat;
      background-position: calc(100% - 0.75rem) center !important;
      -moz-appearance:none !important;
      -webkit-appearance: none !important; 
      appearance: none !important;
      padding-right: 2rem !important;
      background-color: ${backgroundColor};
      color: ${color};
      padding: 8px 14px;
      border-radius: 18px;
      text-transform: uppercase;
      outline: none;
      border: none;
      font: 10px Helvetica;
      font-weight: bold;
    }
  `;
