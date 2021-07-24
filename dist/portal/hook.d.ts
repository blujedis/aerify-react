import { IPortalHook } from './types';
declare const usePortal: (props?: IPortalHook | undefined) => {
    Portal: (props: import("react").PropsWithChildren<import("./types").IPortal>) => import("react").ReactPortal | null;
    containerRef: (el: any) => void;
    visible: boolean;
    open: (e?: any) => void;
    close: (e?: any) => void;
};
export { usePortal };
