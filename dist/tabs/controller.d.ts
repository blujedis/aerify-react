import { ITabsState } from './types';
declare const useTabs: () => {
    readonly state: ITabsState;
    readonly active: string;
    readonly tabs: JSX.Element[];
    readonly ids: string[];
    addTab: (id: string, tab: JSX.Element) => void;
    setState: import("react").Dispatch<import("react").SetStateAction<ITabsState>>;
    setActive: (active: string) => void;
};
export { useTabs };
