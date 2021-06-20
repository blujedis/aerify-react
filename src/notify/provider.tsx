import React, {
  FC,
  createContext,
  useContext as useReactContext,
  useReducer,
  ReactNode,
  isValidElement,
} from 'react';
import { generateUID } from '../utils/strings';
import { reducer } from './reducer';
import { INotifyOptions, NotifyModel } from './types';

export interface INotifyContext {
  items: NotifyModel[];
  add(options: INotifyOptions): void;
  add(message: string): void;
  add(element: ReactNode): void;
  remove(item: NotifyModel): void;
  remove(id: string): void;
  removeAll(uid?: string): void;
}

export type NotifyContext = (uid?: string) => INotifyContext;

const Context = createContext<NotifyContext>(null as any);
const Consumer = Context.Consumer;

const useContext = (uid?: string) => {
  return useReactContext(Context)(uid);
};

const Provider: FC = ({ children }) => {

  const initialState: NotifyModel<INotifyOptions>[] = [];
  const [state, dispatch] = useReducer(reducer, initialState);

  const context = (uid = '*') => {
    return {
      get items() {
        return state;
      },

      add: (options: string | ReactNode | INotifyOptions) => {
        if (typeof options === 'undefined' || options == null) return;

        if (
          typeof options === 'string' ||
          isValidElement(options) ||
          typeof options === 'function'
        )
          options = { content: options };

        // Closeable and uid may be
        // overriden by controller.
        const item = {
          closeable: true,
          uid,
          ...(options as INotifyOptions),
          id: generateUID(),
          created: Date.now(),
        } as NotifyModel;

        dispatch({ type: 'ADD', payload: item });
      },

      remove: (itemOrId: string | NotifyModel<INotifyOptions> | undefined) => {
        let id = itemOrId as string;
        if (typeof itemOrId !== 'string') {
          itemOrId = state.find((v) => v === itemOrId);
          id = itemOrId?.id as string;
        }
        dispatch({ type: 'REMOVE', payload: id });
      },

      removeAll: (uid: any) => dispatch({ type: 'REMOVE_ALL', payload: uid }),
    };
    
  };

  const element = (
    <Context.Provider value={context}>{children}</Context.Provider>
  );

  return element;
};

Provider.displayName = 'NotifyProvider';

export { Context, Consumer, Provider, useContext };
