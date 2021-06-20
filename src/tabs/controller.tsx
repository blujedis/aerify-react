import { useState } from 'react';
import { ITabsState } from './types';

const useTabs = () => {
  const [state, setState] = useState<ITabsState>({
    active: '',
    ids: [],
    tabs: [],
  });

  const setActive = (active: string) => {
    setState({ ...state, active });
  };

  const addTab = (id: string, tab: JSX.Element) => {
    if (!state.ids.includes(id))
      setState({
        ...state,
        ids: [...state.ids, id],
        tabs: [...state.tabs, tab],
      });
  };

  return {
    get state() {
      return state;
    },
    get active() {
      return state.active;
    },
    get tabs() {
      return state.tabs;
    },
    get ids() {
      return state.ids;
    },
    addTab,
    setState,
    setActive,
  };
};

export { useTabs };
