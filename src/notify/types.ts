import { CSSProperties, ReactNode } from 'react';
import { useNotify  } from './controller';

export interface INotifyOptions {
  content?: ReactNode;
  timeout?: number;
  closeable?: boolean;
}

export type NotifyModel<T extends INotifyOptions = INotifyOptions> = T & {
  readonly uid: string;
  readonly created: number;
  readonly id: string | number;
};

export interface INotifyReducerAction {
  type: 'ADD' | 'REMOVE' | 'REMOVE_ALL';
  payload?: any;
}

export type UseController = typeof useNotify;

export type NotifyControllerProps = { controller: ReturnType<UseController> };

export type NotifyContainerPosition =
  | 'top-right'
  | 'bottom-right'
  | 'top-left'
  | 'bottom-left'
  | 'top'
  | 'bottom';

export type NotifyComponentProps = NotifyModel & {
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
};

export type NotifyComponent = (props: NotifyComponentProps) => JSX.Element;

export interface INotifyControllerOptions {
  uid?: string;
  timeout?: number;
  max?: number;
  position?: NotifyContainerPosition;
  itemStyle?: CSSProperties;
  closeStyle?: CSSProperties;
  filter?: <T extends INotifyOptions>(item: NotifyModel<T>) => boolean;
}
