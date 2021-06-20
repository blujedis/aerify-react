import clsx from 'clsx';
import React, { FC, useState, } from 'react';
import { createPaginator } from './paginator';
import PagerBase from './component';
import { ButtonTemplate, IPagerButtonOptions, IPagerControllerOptions, PagerCreate, IPagerControllerApi, IPager, IPaginatorOptions } from './types';

const DefaultButton = <P extends IPagerButtonOptions = IPagerButtonOptions>(props: P) => {
  return <button {...props as any} />;
};

const DEFAULTS: IPagerControllerOptions = {
  items: 0,
  page: 1,
  size: 10,
  pages: 3,
  ButtonTemplate: DefaultButton,
  disabled: false
};

export function useCreateController<T>(props?: IPagerControllerOptions<T>) {

  props = {
    ...DEFAULTS,
    ...props
  };

  const { ButtonTemplate, activeClass, activeStyle, ...rest } = props;

  const [paginator, setPaginator] = useState(createPaginator(rest));

  const api: IPagerControllerApi<T> = {
    ...paginator,
    get config() {
      const { page, size, pages, items } = paginator;
      return {
        page,
        size,
        pages,
        items
      };
    },
    update,
    hasPrev,
    hasNext,
    hasPages,
    hasFirst,
    hasLast,
    isPrevDisabled,
    isNextDisabled,
    isPageActive,
    createButton,
    createPageButtons,
    canPage,
    to,
    previous,
    next,
    first,
    last
  };

  function update(options?: IPaginatorOptions<T>) {
    const { page, pages, items, size } = paginator;
    const newPaginator = createPaginator({ page, pages, items, size, ...options });
    setPaginator(newPaginator);
  }

  /**
   * Checks if previous button should be disabled.
   */
  function isPrevDisabled() {
    return !hasPrev() || paginator.page <= 1;
  }

  /**
   * Checks if next button should be disabled.
   */
  function isNextDisabled() {
    return !hasNext() || paginator.page >= paginator.activePages.slice(-1)[0];
  }

  function isPageActive(page: number) {
    return page === paginator.page;
  }

  /**
   * Checks if items exist to have previous button.
   */
  function hasPrev() {
    return !!paginator.items;
  }

  /**
   *  Checks if items exist to have next button.
   */
  function hasNext() {
    return !!paginator.items;
  }

  /**
   *  Checks if items exist to have pages buttons.
   */
  function hasPages() {
    return paginator.activePages && paginator.activePages.length;
  }

  /**
   * Checks if active pages contains first page.
   */
  function hasFirst() {
    return paginator.activePages.includes(1);
  }

  /**
   * Checks if active pages contains last page.
   */
  function hasLast() {
    return paginator.activePages.includes(paginator.totalPages);
  }

  /**
   * Checks if a page can be navigated to.
   * 
   * @param to the page number to check if can navigate to.
   */
  function canPage(to: number) {
    return to >= 1 && to <= paginator.activePages.slice(-1)[0];
  }

  /**
   * Changes page to specified page number if "canPage" is valid.
   * 
   * @param page the page to change to.
   */
  function to(page: number) {
    if (!canPage(page))
      return;
    update({ page });
  }

  function previous() {
    const prev = paginator.page - 1;
    if (!canPage(prev))
      return;
    update({ page: prev });
  }

  function next() {
    const nxt = paginator.page + 1;
    if (!canPage(nxt))
      return;
    update({ page: nxt });
  }

  function first() {
    if (!canPage(1))
      return;
    update({ page: 1 });
  }

  function last() {
    const lst = paginator.totalPages;
    if (!canPage(lst))
      return;
    update({ page: lst });
  }

  /**
   * Creates a Button component.
   * 
   * @param button 
   */
  function createButton<P extends IPagerButtonOptions = IPagerButtonOptions>(type: 'Previous' | 'Next' | number, defaults?: P | ButtonTemplate, ButtonComponent?: ButtonTemplate) {

    if (typeof defaults === 'function') {
      ButtonComponent = defaults as ButtonTemplate;
      defaults = undefined;
    }

    const Button = (ButtonComponent || ButtonTemplate) as unknown as FC;

    const PagerButton = <P extends IPagerButtonOptions = IPagerButtonOptions>(props: P) => {

      props = {
        ...(defaults || {}),
        ...props
      };

      props.children = type + '';

      // Add styling for active page buttons.
      if (typeof type === 'number' && isPageActive(type) && (activeClass || activeStyle)) {
        if (activeClass)
          props.className = clsx(props.className, activeClass);

        if (activeStyle)
          props.style = { ...(props.style || {}), ...activeStyle };
      }

      return <Button {...props} />;

    };

    return PagerButton;

  }

  /**
   * Helper to build pager buttons set between previous and next.
   */
  function createPageButtons(pages = paginator.activePages, ButtonComponent: ButtonTemplate) {

    // Build primary pages.
    const buttons = pages.map(pg => {

      const defaults = {
        key: `btn-${pg}`,
        'aria-label': `Page ${pg}`,
        'aria-current': isPageActive(pg) ? 'page' : 'false',
        onClick: () => to(pg)
      }

      return createButton(pg, defaults, ButtonComponent);

    });

    // Check if should build first and last pages.

    return buttons;

  }

  return api;



}

export function usePager<T>(props?: IPagerControllerOptions<T> & { Pager?: PagerCreate }) {

  const { Pager: PagerInit, disabled, ...rest } = props as IPagerControllerOptions<T> & { Pager: PagerCreate };

  const controller = useCreateController<T>(rest);

  const Base = PagerInit || PagerBase;

  const Pager: PagerCreate = (pprops) => {
    pprops = {
      ...pprops
    };
    pprops.controller = pprops.controller || controller;
    return <Base {...pprops} />;
  };

  if (disabled)
    return null;

  return {
    ...controller,
    Pager
  } as IPager<T>;

}