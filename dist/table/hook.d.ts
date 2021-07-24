import React from 'react';
import { IOrderByOptions } from './orderby';
import { ITableControllerApi, ITableControllerState, ITableControllerOptions, TableCreate, ITableControllerAction, TableItem, TableControllerCreateHeaderRow, TableComponent, TableControllerCreateDataRow } from './types';
declare function useTable<T extends TableItem = TableItem>(props?: ITableControllerOptions<T> & {
    Table?: TableCreate;
}): {
    Table: TableCreate;
    initialized?: boolean | undefined;
    options: ITableControllerOptions<T>;
    state: ITableControllerState<T>;
    dispatch: React.Dispatch<ITableControllerAction>;
    createHeader(onCreateRow?: TableControllerCreateHeaderRow | undefined): JSX.Element;
    createRows(onCreateRow?: TableControllerCreateDataRow | undefined): JSX.Element[];
    createComponent(tagOrElement: string | TableComponent): any;
    filter(fn: (row: T) => boolean): ITableControllerApi<T>;
    filter(query: string): ITableControllerApi<T>;
    filter(): ITableControllerApi<T>;
    filter(row: T): ITableControllerApi<T>;
    remove(row: T): ITableControllerApi<T>;
    select(row: T): ITableControllerApi<T>;
    orderby(order?: IOrderByOptions | undefined): ITableControllerApi<T>;
    reset(restoreRemoved?: boolean | undefined): ITableControllerApi<T>;
    reorder(rows: T[]): ITableControllerApi<T>;
    pager: import("../pager").IPagerControllerApi<T>;
};
export default useTable;
