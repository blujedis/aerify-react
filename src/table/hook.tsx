import React, { useEffect, useLayoutEffect, useReducer, useRef, HTMLAttributes, PropsWithChildren } from 'react';
import TableBase from './component';
import Fuze from 'fuse.js';
import orderBy, { IOrderByOptions, toComparator } from './orderby';
import { get } from 'dot-prop';
import {
  ITableColumn, ITableControllerApi, ITableControllerState, TableControllerAction, TableControllerChangeHandler, ITableControllerOptions, TableCreate, ITableControllerAction, TableItem, TableControllerCreateHeaderCell,
  TableControllerCreateHeaderRow, TableControllerCreateDataCell, TableComponent, ITableColumnDataRow, TableControllerCreateDataRow
} from './types';

import { usePager, IPaginatorOptions, IPager } from '../pager';

const CONTROLLER_DEFAULTS: ITableControllerOptions<any> = {
  source: [],
  selected: [],
  onChange: () => undefined,
  changeEvents: ['FILTER', 'SELECT', 'REMOVE'],
  headerCellTag: 'th',
  headerRowTag: 'tr',
  cellTag: 'td',
  rowTag: 'tr'
};

const COLUMN_DEFAULTS = {};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function generateUID(radix = 16) {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(radix);
}

function createReducer<T>(changeEvents: TableControllerAction[], changeHandler: TableControllerChangeHandler<T>) {

  return (state: ITableControllerState<T>, action: ITableControllerAction) => {

    const { type, payload } = action;
    const nextState = { ...state };
    const lastChange = payload && payload.lastChange;

    switch (type) {

      case 'FILTER': {
        state = { ...nextState, ...payload };
        break;
      }

      case 'SORT': {
        state = { ...nextState, ...payload };
        break;
      }

      case 'SELECT': {
        state = { ...nextState, ...payload };
        break;
      }

      case 'REMOVE': {
        state = { ...nextState, ...payload };
        break;
      }

      // Resets back to initial source state.
      case 'RESET': {
        state = { ...nextState, ...payload };
        break;
      }

      case 'PAGE': {
        state = { ...nextState, ...payload };
        break;
      }

      default: {
        state = nextState;
      }

    }

    // Check if should fire change event handler.
    if (changeEvents && changeEvents.length && changeEvents.includes(type))
      changeHandler(type, lastChange, state);

    return state;

  };

}

function useCreateController<T extends TableItem>(props?: ITableControllerOptions<T>) {

  props = {
    rowKey: 'id' as any,   // id may not exist if not sorting is disabled.
    ...CONTROLLER_DEFAULTS,
    ...props
  };

  // Normalizes props with options which may 
  // contain booleans to enable with defaults.
  // This prevents the need for two properties.
  props.columns = normalizeColumns(props.columns) as ITableColumn<T>[];
  props.filterable = normalizeOptions(props.filterable);
  props.pageable = normalizeOptions(props.pageable);
  props.orderable = normalizeOptions(props.orderable);
  props.sortable = normalizeOptions(props.sortable);

  // Get default keys for filtering records.
  const defaultFilterKeys = props.columns.reduce((a, c) => {
    if (!c.key) return a;
    a = [...a, c.key];
    return a;
  }, [] as string[]);

  const defaultFilterOptions = {
    keys: defaultFilterKeys
  };

  const {
    source,
    selected,
    columns,
    // rowKey,
    // sortable,
    pageable,
    filterable,
    orderable,
    defaultFilter,
    onFilterRow,
    onChange,
    changeEvents,
    headerRowTag,
    headerCellTag,
    rowTag,
    cellTag
  } = props as Required<ITableControllerOptions<T>>;

  const initialState: ITableControllerState<T> = {
    source: source || [],
    selected: selected || [],
    filtered: source || [],
    active: source || [],
    removed: [],
    lastChange: null,
    order: undefined as any,
    columns: columns as ITableColumn<T>[]
  };

  const fuze = new Fuze(source as T[], { ...defaultFilterOptions, ...(filterable as Fuze.IFuseOptions<T>) });

  const pagerOpts = pageable ? { ...(pageable as IPaginatorOptions<T>), items: source } : { disabled: true };

  const pager = usePager<T>(pagerOpts) as IPager<T>;

  const HeaderCellComponent = createComponent(headerCellTag);
  const HeaderRowComponent = createComponent(headerRowTag);
  const DataRowCellComponent = createComponent(cellTag);
  const DataRowComponent = createComponent(rowTag);

  const hasInit = useRef(false);
  const [state, dispatch] =
    useReducer(createReducer<T>(changeEvents, onChange), normalizeInitialState(initialState));

  useEffect(() => {
    hasInit.current = true;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (hasInit)
      setActive(state.filtered);
  }, [pager.page, state.filtered]);

  const api: ITableControllerApi<T> = {
    initialized: hasInit.current,
    options: { ...props },
    state,
    dispatch,
    createHeader,
    createRows,
    createComponent,
    reorder,
    filter,
    remove,
    select,
    orderby: sort,
    reset,
    pager
  };

  ///////////////////////////////
  // PRIVATE METHODS 
  ///////////////////////////////

  function normalizeOptions(obj: any, def: any = {}) {
    if (obj) {
      if (obj === true)
        return def;
      return obj;
    }
    return undefined;
  }

  // Ensure all rows have an id.
  function normalizeRows(data: T[]) {
    return data.map(row => {
      row.id = row.id || generateUID();
      return row;
    });
  }

  function normalizeColumns(cols = [] as (string | ITableColumn<T>)[]) {
    return cols.map((c, i) => {
      let col = c as ITableColumn<T>;
      if (typeof c === 'string')
        col = { label: c };
      col = { ...COLUMN_DEFAULTS, ...col } as ITableColumn<T>;
      col.label = col.label || col.key;
      // don't auto gen index as 0 as  user name
      // specify zero based index.
      col.index = typeof col.index === 'undefined' ? i + 1 : col.index;
      return col;
    }).sort(toComparator(['index'])) as ITableColumn<T>[];
  }

  function getFiltered(collection: T[], queryOrHandler?: string | Fuze.Expression | ((row: T) => boolean)) {

    let _filtered = [...collection];

    if (typeof queryOrHandler === 'function' || typeof onFilterRow === 'function') {
      const handler = (queryOrHandler || onFilterRow) as (row: T) => boolean;
      _filtered = state.filtered.filter(handler);
    }
    else {
      fuze.setCollection(state.filtered);
      _filtered = fuze.search(queryOrHandler as string | Fuze.Expression).map(s => s.item);
    }

    return _filtered;

  }

  // Used to prevent unnecessary initial renders.
  function normalizeInitialState(initState: ITableControllerState<T>) {
    initState.source = normalizeRows(initState.source);
    let _filtered = [...initState.source];
    if (defaultFilter)
      _filtered = getFiltered(initState.source);
    if (orderable)
      _filtered = orderBy(_filtered, orderable as IOrderByOptions);
    if (pager)
      initState.active = pager.getRange(_filtered);
    initState.filtered = _filtered;
    return initState;
  }

  // Preflight wrapper that ensures paging.
  function dispatcher<S extends Partial<ITableControllerState<T>>>(type: TableControllerAction, currentState: S) {
    pager.update({ ...pager.config, items: currentState.filtered });
    dispatch({ type, payload: currentState });
    return api;
  }

  // Sets active collection
  // Runs AFTER effect.
  function setActive(collection: T[]) {
    const active = pager.getRange(collection);
    const payload = { filtered: collection, active, lastChange: active };
    dispatch({ type: 'PAGE', payload });
    return api;
  }

  function createComponent(tagOrElement: string | keyof JSX.IntrinsicElements | TableComponent) {
    let GeneratedComponent = tagOrElement as TableComponent;
    if (typeof tagOrElement === 'string') {
      const Tag = tagOrElement as keyof JSX.IntrinsicElements;
      GeneratedComponent = <P extends HTMLAttributes<any>>(props: PropsWithChildren<P>) => <Tag {...props} />;
    }
    return GeneratedComponent;
  }

  ///////////////////////////////
  // PUBLIC METHODS 
  ///////////////////////////////

  function createHeaderCell(col: ITableColumn<T>) {

    let label = col.label as string | JSX.Element;

    const { index } = col;

    if (typeof col.label === 'function')
      label = col.label(col, api);

    else if (typeof col.label === 'undefined')
      label = `Column ${index}`;

    // Get the column data prop key or use index of column.
    const key = col.key || 'col-' + index;

    return (
      <HeaderCellComponent key={key}>
        {label}
      </HeaderCellComponent>
    );

  }

  function createHeaderRow(onCreateCell?: TableControllerCreateHeaderCell) {

    const cols = state.columns;
    const createElement = (onCreateCell || createHeaderCell) as TableControllerCreateHeaderCell;

    const columnComponents = cols.map((col, i) => {
      const _col = { ...col, index: i }
      return createElement(_col, api);
    });

    return (
      <HeaderRowComponent>
        {columnComponents}
      </HeaderRowComponent>
    );

  }

  function createHeader(onCreateRow?: TableControllerCreateHeaderRow) {
    onCreateRow = onCreateRow || createHeaderRow;
    return onCreateRow();
  }

  function createRowCell(col: ITableColumnDataRow<T>) {

    let content = (col.content || null) as JSX.Element;

    const { rowIndex, data, index } = col;

    if (typeof col.content === 'function')
      content = col.content(col, api);

    else if (typeof col.content === 'undefined' && col.key)
      content = get(data, col.key) as JSX.Element;

    const key = `row-${rowIndex}-col-${col.key || index}`;

    return (
      <DataRowCellComponent key={key}>
        {content}
      </DataRowCellComponent>
    );

  }

  function createRow(
    data: T,
    rowIndex?: number,
    onCreateCell?: TableControllerCreateDataCell) {

    const cols = state.columns;
    const createElement = (onCreateCell || createRowCell) as TableControllerCreateDataCell;

    const columnComponents = cols.map((col, i) => {
      const _col = { ...col, data, rowIndex: rowIndex as number, index: i }
      return createElement(_col, api);
    });

    return (
      <DataRowComponent key={data.id}>
        {columnComponents}
      </DataRowComponent>
    );

  }

  function createRows(onCreateRow?: TableControllerCreateDataRow) {

    if (!state.active || !state.active.length)
      return [];

    const createElement = (onCreateRow || createRow) as TableControllerCreateDataRow;

    return state.active.map((data, i) => {
      return createElement(data, i, createRowCell as TableControllerCreateDataCell);
    });

  }

  function filter(fn: (row: T) => boolean): ITableControllerApi<T>;
  function filter(query: string): ITableControllerApi<T>;
  function filter(exp: Fuze.Expression): ITableControllerApi<T>;
  function filter(): ITableControllerApi<T>;
  function filter(queryOrHandler?: string | Fuze.Expression | ((row: T) => boolean)) {
    const _filtered = getFiltered(state.source, queryOrHandler);
    const payload = { filtered: _filtered, active: _filtered, lastChange: _filtered };
    return dispatcher('FILTER', payload);
  }

  function remove(row: T) {
    const source = state.source.filter(v => v !== row);
    const filtered = state.filtered.filter(v => v !== row);
    const active = state.active.filter(v => v !== row);
    const removed = [...state.removed, row];
    const payload = { source, filtered, active, removed, lastChange: row };
    return dispatcher('REMOVE', payload)
  }

  function select(row: T) {
    dispatch({ type: 'SELECT', payload: { selected: [...state.selected, row], lastChange: row } });
    return api;
  }

  function sort(order?: IOrderByOptions) {
    const filtered = orderBy(state.filtered, order);
    const payload = { filtered, active: filtered, order, lastChange: order };
    return dispatcher('SORT', payload);
  }

  function reset(restoreRemoved = false) {

    let newSource = [...state.source];

    let payload: any;

    if (!restoreRemoved) {
      payload = { source: newSource, filtered: newSource, active: newSource, removed: [], selected: [], lastChange: newSource }
    }

    else {
      newSource = [...newSource, ...state.removed];
      const filtered = orderBy(newSource, orderable as IOrderByOptions);
      payload = { source: newSource, filtered, active: filtered, removed: [], selected: [], lastChange: newSource };
    }

    return dispatcher('RESET', payload);

  }

  function reorder(rows: T[]) {
    const payload = { active: rows, lastChange: rows };
    dispatch({ type: 'SORT', payload });
    return api;
  }

  return api;

}

function useTable<T extends TableItem = TableItem>(props?: ITableControllerOptions<T> & { Table?: TableCreate }) {

  const { Table: TableInit, ...rest } = props as ITableControllerOptions<T> & { Table?: TableCreate };

  const controller = useCreateController<T>(rest);

  const Base = TableInit || TableBase;

  const Table: TableCreate = (tprops) => {
    tprops = {
      controller,
      ...tprops
    };
    return <Base {...tprops} />;
  };

  return {
    ...controller,
    Table
  };

}

export default useTable;

