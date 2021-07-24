import { MutableRefObject, SyntheticEvent } from 'react';
export interface IPortal {
    selector?: string;
    ref?: MutableRefObject<Element>;
}
export interface IPortalHook {
    closeOnEsc?: boolean;
    closeOnClick?: boolean;
    onClose?: (e?: SyntheticEvent) => void;
    allowScroll?: boolean;
}
