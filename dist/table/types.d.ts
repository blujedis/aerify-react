import { Dispatch, HTMLAttributes, PropsWithChildren } from 'react';
import { IOrderByOptions } from './orderby';
import { TableProps, DivProps } from '../types';
import Fuse from 'fuse.js';
import { IPagerControllerApi, IPaginatorOptions } from '../pager';
export declare type TableCreate = (props: TableOptions<ITableControllerApi>) => JSX.Element;
export declare type TableItem = {
    id?: string | number;
    [key: string]: any;
};
export interface ITableOptions<C extends ITableControllerApi> {
    controller?: C;
    container?: 'table' | 'div' | TableComponent;
    header?: null | false | undefined | JSX.Element;
    footer?: null | false | undefined | JSX.Element;
}
export declare type TableContainerProps = TableProps | DivProps;
export declare type TableOptions<C extends ITableControllerApi> = ITableOptions<C> & TableContainerProps;
export declare type TableControllerChangeHandler<T extends TableItem = TableItem> = (event: TableControllerAction, lastChange: T | T[], state: ITableControllerState<T>) => void;
export declare type TableControllerCreateHeaderRow = (onCreateCell?: TableControllerCreateHeaderCell) => JSX.Element;
export declare type TableControllerCreateHeaderCell = <T extends TableItem>(column: ITableColumn<T>, controller?: ITableControllerApi<T>) => JSX.Element;
export declare type ITableColumnDataRow<T> = ITableColumn<T> & {
    data: T;
    rowIndex: number;
};
export declare type TableControllerCreateDataRow = <T extends TableItem>(data: T, rowIndex?: number, onCreateCell?: TableControllerCreateDataCell) => JSX.Element;
export declare type TableControllerCreateDataCell = <T extends TableItem>(column: ITableColumnDataRow<T>, controller?: ITableControllerApi<T>) => JSX.Element;
export declare type TableControllerAction = 'REMOVE' | 'SELECT' | 'FILTER' | 'SORT' | 'RESET' | 'PAGE' | 'REORDER';
export interface ITableControllerAction {
    type: TableControllerAction;
    payload?: any;
}
export interface ITableControllerState<T> {
    columns: ITableColumn<T>[];
    source: T[];
    filtered: T[];
    active: T[];
    selected: T[];
    removed: T[];
    lastChange: any;
    order: IOrderByOptions;
}
export interface ITableColumn<T extends TableItem = TableItem> {
    index?: number;
    key?: NestedPath<T | {
        id?: string | number;
    }>;
    label?: string | JSX.Element | TableControllerCreateHeaderCell;
    content?: string | JSX.Element | TableControllerCreateDataCell;
}
export interface ITableControllerApi<T = any> {
    initialized?: boolean;
    options: ITableControllerOptions<T>;
    state: ITableControllerState<T>;
    dispatch: Dispatch<ITableControllerAction>;
    createHeader(onCreateRow?: TableControllerCreateHeaderRow): JSX.Element;
    createRows(onCreateRow?: TableControllerCreateDataRow): JSX.Element[];
    createComponent(tagOrElement: string | keyof JSX.IntrinsicElements | TableComponent): any;
    filter(fn: (row: T) => boolean): this;
    filter(query: string): this;
    filter(): this;
    filter(row: T): this;
    remove(row: T): this;
    select(row: T): this;
    orderby(order?: IOrderByOptions): this;
    reset(restoreRemoved?: boolean): this;
    reorder(rows: T[]): this;
    pager: IPagerControllerApi<T>;
}
export declare type TableComponent = <P extends HTMLAttributes<any>>(props: PropsWithChildren<P>) => JSX.Element;
export interface ITableControllerOptions<T extends TableItem> {
    source?: T[];
    selected?: T[];
    columns?: string[] | ITableColumn<T>[];
    rowKey?: NestedPath<T | {
        id?: string | number;
    }>;
    sortable?: boolean;
    pageable?: boolean | Omit<IPaginatorOptions<T>, 'items'>;
    filterable?: boolean | Fuse.IFuseOptions<T>;
    orderable?: boolean | IOrderByOptions;
    changeEvents?: TableControllerAction[];
    headerCellTag?: keyof JSX.IntrinsicElements | TableComponent;
    headerRowTag?: keyof JSX.IntrinsicElements | TableComponent;
    cellTag?: keyof JSX.IntrinsicElements | TableComponent;
    rowTag?: keyof JSX.IntrinsicElements | TableComponent;
    defaultFilter?: string | RegExp;
    onFilterRow?(row: T): boolean;
    onChange?: TableControllerChangeHandler<T>;
}
export interface IControllerOptionsInternal<T> extends ITableControllerOptions<T> {
    columns: ITableColumn<T>[];
    sortable: any;
    pageable: Omit<IPaginatorOptions<T>, 'items'>;
    filterable: Fuse.IFuseOptions<T>;
    orderable: IOrderByOptions;
    headerCellTag: TableComponent;
    headerRowTag: TableComponent;
    cellTag: TableComponent;
    rowTag: TableComponent;
}
export declare type PathToNestedProps<T> = T extends string ? [] : {
    [K in Extract<keyof T, string>]: [K, ...PathToNestedProps<T[K]>];
}[Extract<keyof T, string>];
export declare type Join<T extends string[], D extends string> = T extends [] ? never : T extends [infer F] ? F : T extends [infer F, ...infer R] ? F extends string ? `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string;
export declare type NestedPath<T extends Record<string, any>> = Join<PathToNestedProps<T>, '.'>;
