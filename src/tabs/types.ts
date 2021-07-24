import { ReactNode } from 'react';
import { DivProps } from '../types';
import { useTabs } from './controller';

export interface ITabsState {
  active: string;
  tabs: JSX.Element[];
  ids: string[];
}

export type UseTabs = typeof useTabs;

export type UseTabsInterface = ReturnType<UseTabs>;

export interface ITabs {
  activeClass?: 'is-active';
  element?: 'ul' | 'div'; // default "ul"
  tabs?: UseTabsInterface;
  className?: string;
  containerProps?: DivProps; // outer container div properties.
  onChange?: (state: any) => void;
}

export interface IPane {
  id?: string;
  active?: boolean;
  label: ReactNode;
  className?: string;
  containerProps?: DivProps;
}

export interface IPanel {
  id: string;
  activeClass?: string;
  active?: boolean;
  tab: JSX.Element;
  containerProps?: DivProps;
  tabs: UseTabsInterface;
}

export interface ITab {
  id: string;
  element: 'li' | 'div';
  label: ReactNode;
  activeClass?: string;
  tabs: UseTabsInterface;
}
