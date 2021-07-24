import React, { FC, ReactNode } from 'react';
import { INotifyOptions, NotifyModel } from './types';
export interface INotifyContext {
    items: NotifyModel[];
    add(options: INotifyOptions): void;
    add(message: string): void;
    add(element: ReactNode): void;
    remove(item: NotifyModel): void;
    remove(id: string): void;
    removeAll(uid?: string): void;
}
export declare type NotifyContext = (uid?: string) => INotifyContext;
declare const Context: React.Context<NotifyContext>;
declare const Consumer: React.Consumer<NotifyContext>;
declare const useContext: (uid?: string | undefined) => INotifyContext;
declare const Provider: FC;
export { Context, Consumer, Provider, useContext };
