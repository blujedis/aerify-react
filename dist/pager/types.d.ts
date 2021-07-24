import { CSSProperties, AriaAttributes, SyntheticEvent, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
declare type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export interface IPagerOptions<C extends IPagerControllerApi = IPagerControllerApi> extends DivProps {
    controller: C;
}
export declare type PagerCreate = <C extends IPagerControllerApi>(props: IPagerOptions<C>) => JSX.Element;
export declare type ButtonTemplate = <P extends IPagerButtonOptions = IPagerButtonOptions>(props: P) => JSX.Element;
export interface IPaginatorOptions<T = any> {
    items?: string | number | T[];
    page?: string | number;
    size?: string | number;
    pages?: string | number;
}
export interface IPaginator<T = any> extends IPaginatorOptions<T> {
    items: number;
    page: number;
    size: number;
    pages: number;
    totalPages: number;
    startPage: number;
    endPage: number;
    rangeStart: number;
    rangeEnd: number;
    activePages: number[];
    getRange: <C = T>(collection: C[]) => C[];
}
export interface IPagerButtonOptions {
    key?: string | number | null;
    role?: string;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    children?: ReactNode;
    'aria-label'?: string | AriaAttributes['aria-label'];
    'aria-current'?: string | AriaAttributes['aria-current'];
    onClick?: <E extends SyntheticEvent>(event: E) => void;
}
export interface IPagerControllerOptions<T = any> extends IPaginatorOptions<T> {
    disabled?: boolean;
    ButtonTemplate?: ButtonTemplate;
    activeClass?: string | string[];
    activeStyle?: CSSProperties;
}
export interface IPagerHookOptions<T = any> extends Omit<IPagerControllerOptions<T>, 'items'> {
    items?: T[];
}
export declare type PagerControllerConfig<T> = IPaginatorOptions<T>;
export interface IPagerControllerApi<T = any> extends IPaginator<T> {
    config: PagerControllerConfig<T>;
    update: (options?: IPaginatorOptions<T>) => void;
    hasPrev: () => boolean;
    hasNext: () => boolean;
    hasPages: () => number;
    hasFirst: () => boolean;
    hasLast: () => boolean;
    isPrevDisabled: () => boolean;
    isNextDisabled: () => boolean;
    isPageActive: (page: number) => boolean;
    canPage: (to: number) => boolean;
    to: (page: number) => void;
    previous: () => void;
    next: () => void;
    first: () => void;
    last: () => void;
    createButton<P extends IPagerButtonOptions = IPagerButtonOptions>(type: 'Previous' | 'Next' | number, defaults?: ButtonTemplate | P, ButtonComponent?: ButtonTemplate): <P extends IPagerButtonOptions = IPagerButtonOptions>(props: P) => JSX.Element;
    createPageButtons(pages?: number[], ButtonComponent?: ButtonTemplate): (<P>(props: P) => JSX.Element)[];
}
export interface IPager<T> extends IPagerControllerApi<T> {
    Pager: PagerCreate;
}
export {};
