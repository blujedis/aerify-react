import React from 'react';
import { ITableControllerApi, TableOptions } from './types';
// import { ITableControllerApi, ReactSortableStore, TableItem, TableOptions } from './types';
// import { ReactSortable, ItemInterface, SortableEvent } from 'react-sortablejs';

const TABLE_DEFAULTS: TableOptions<ITableControllerApi> = {
  className: 'table',
  container: 'table'
};

export default function TableBase(props: TableOptions<ITableControllerApi>) {
  // export default function TableBase<T extends TableItem = TableItem>(props: TableOptions<ITableControllerApi>) {

  props = {
    ...TABLE_DEFAULTS,
    ...props
  };

  const { controller, header, footer, container, ...rest } = props as Required<TableOptions<ITableControllerApi>>;

  // const { initialized, state } = controller;
  // const { active } = state;

  // const onDragStart = (_event: SortableEvent, _sortable: any, store: ReactSortableStore<T>) => {
  //   store.reordered = undefined;
  // };

  // const onDragEnd = (_event: SortableEvent, _sortable, store: ReactSortableStore<T>) => {
  //   if (!store.reordered) return;
  //   controller.reorder(store.reordered);
  //   store.reordered = undefined;
  // };

  // const setOrder = (newState: (T & ItemInterface)[], Sortable, store: ReactSortableStore<T>) => {
  //   if (!initialized || !Sortable || !store.dragging)
  //     return;
  //   store.reordered = newState;
  // };

  const getFooter = () => {
    if (!footer)
      return null;
    return (
      <tfoot>
        {footer}
      </tfoot>
    );
  };

  const getHeader = () => {
    // if header undefined we want to generate it.
    if (!header && typeof header !== 'undefined')
      return null;
    return (
      <thead>
        {header || controller.createHeader()}
      </thead>
    );
  };

  const getBody = () => {

    const rows = controller.createRows();

    //  if (!controller.options.sortable)
    return (
      <tbody>
        {rows}
      </tbody>
    );

    // Need to set the correct tag for the 
    // react sortable container component.
    // const tag = container === 'table' ? 'tbody' : 'div';

    // return (
    //   <ReactSortable
    //     tag={tag}
    //     list={active as any}
    //     setList={setOrder}
    //     onStart={onDragStart}
    //     onEnd={onDragEnd}
    //   >
    //     {rows}
    //   </ReactSortable>
    // );


  };

  const Container = controller.createComponent(container);

  return (
    <Container {...rest} >
      {getHeader()}
      {getBody()}
      {getFooter()}
    </Container>
  );

}