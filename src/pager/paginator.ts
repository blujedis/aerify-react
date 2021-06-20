
import { IPaginator, IPaginatorOptions } from './types';

function createPaginator<T = any>(options: IPaginatorOptions<T>): IPaginator<T>;
function createPaginator<T = any>(
  items?: string | number | T[],
  page?: string | number,
  size?: string | number,
  pages?: string | number
): IPaginator<T>;
function createPaginator<T = any>(
  itemsOrOptions: string | number | T[] | IPaginatorOptions<T> = 0,
  page: string | number = 1,
  size: string | number = 10,
  pages: string | number = 3
) {

  let items = itemsOrOptions as string | number | T[];

  if (!Array.isArray(itemsOrOptions) && typeof itemsOrOptions === 'object') {
    const { items: initItems, page: initPage, size: initDisplayed, pages: initButtons } = itemsOrOptions;
    items = initItems as string | number | T[];
    page = initPage as string | number;
    size = initDisplayed as string | number;
    pages = initButtons as string | number;
  }

  // Ensure ints as user may pass a string.
  if (Array.isArray(items))
    items = items.length;

  items = parseInt(items as string);
  page = parseInt(page as string);
  size = parseInt(size as string);
  pages = parseInt(pages as string);

  items = items || 0;

  // Total number of pages based on the
  // size or number of items to display.
  const totalPages = Math.ceil(items / size);

  // ensure current page isn't out of range
  if (page < 1)
    page = 1;

  else if (page > totalPages)
    page = totalPages;


  let startPage: number;
  let endPage: number;

  // Total is less than shown so show all pages.
  if (totalPages <= pages) {
    startPage = 1;
    endPage = totalPages;
  }

  else {

    // Caclulate before/after current page.
    const pagesBeforeCurrent = Math.floor(pages / 2);
    const pagesAfterCurrent = Math.ceil(pages / 2) - 1;

    // Calculate start
    if (page <= pagesBeforeCurrent) {
      startPage = 1;
      endPage = pages;
    }

    // Calcutate end
    else if (page + pagesAfterCurrent >= totalPages) {
      startPage = totalPages - pages + 1;
      endPage = totalPages;
    }

    // Calcluate middle of range.
    else {
      startPage = page - pagesBeforeCurrent;
      endPage = page + pagesAfterCurrent;
    }

  }


  // Get start page for range.
  const rangeStart = (page - 1) * size;

  // Get end page for range.
  const rangeEnd = Math.min(rangeStart + size - 1, items - 1);

  // Array of pages.
  const activePages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

  const getRange = <C = T>(collection: C[]) => collection.slice(rangeStart, rangeEnd + 1);

  const api: IPaginator = {

    items,                    // collection length of items
    page,                     // the current page.
    size,                     // the items size/count shown per page.
    pages,                    // the number of page buttons to display.

    totalPages,               // total pages based on size/count of items displayed.
    startPage,                // the start page in the pages array.
    endPage,                  // the end page in the pages array.
    rangeStart,               // the starting index in the range.
    rangeEnd,                 // the ending index in the range.
    activePages,              // the array of pages number for current config.
    getRange                  // accepts array of collection items returns range. 

  };

  return api;

}

export { createPaginator };