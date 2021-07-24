import React, { PropsWithChildren } from 'react';
import { IPane, ITab, ITabs } from './types';
export declare const Tab: (props: ITab) => JSX.Element;
export declare const Pane: (props: PropsWithChildren<IPane>) => JSX.Element;
export declare const Tabs: (props?: React.PropsWithChildren<ITabs> | undefined) => JSX.Element;
