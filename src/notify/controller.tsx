import React, {
  CSSProperties,
  useEffect,
  useState,
  useCallback,
  PropsWithChildren,
  useRef,
  ReactNode,
  isValidElement,
} from 'react';
import { useTimeout, useUpdate } from '../hooks';
import { Portal } from '../portal/component';
import { useContext } from './provider';
import { NotifyModel, INotifyOptions, NotifyComponentProps, NotifyComponent, INotifyControllerOptions, NotifyContainerPosition } from './types';

const DEFAULT_POSITION = 'bottom-right';
const DEFAULT_TIMEOUT = 4000;

export const CONTAINER_STYLES: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  position: 'fixed',
  top: undefined,
  left: undefined,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '10em',
  transition: 'max-height 1s ease',
};

export const ITEM_STYLE: CSSProperties = {
  position: 'relative',
  width: '250px',
  flex: '0 0 80px',
  margin: '10px',
  borderRadius: '2px',
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
  boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
  border: '1px solid #111',
  listStyle: 'none',
  minHeight: '80px',
  padding: '10px',
  color: '#fff',
};

export const CLOSE_STYLE: CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  cursor: 'pointer',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotifyComponentCreate = (
  props: Omit<NotifyComponentProps, 'onEnter' | 'onLeave'> & {
    NotifyComponent: NotifyComponent;
    itemStyle: CSSProperties;
    closeStyle: CSSProperties;
  }
) => {
  const { onClose, timeout, id } = props as Required<typeof props>;
  const { NotifyComponent, ...componentProps } = props;

  const [duration, setDuration] = useState(null);
  const paused = useRef(false);

  function onEnter() {
    paused.current = true;
    setDuration(null);
  }
  function onLeave() {
    paused.current = false;
    setDuration(timeout as any);
  }

  useUpdate(() => {
    if (!paused.current) setDuration(timeout as any);
  }, [timeout]);

  useTimeout(onClose, duration);

  const element = (
    <NotifyComponent
      key={id}
      {...componentProps}
      onEnter={onEnter}
      onLeave={onLeave}
    />
  );

  return element;
};

const NotifyComponentDefault = (
  props: NotifyComponentProps & {
    itemStyle: CSSProperties;
    closeStyle: CSSProperties;
  }
) => {
  props.itemStyle = { ...ITEM_STYLE, ...props.itemStyle };
  props.closeStyle = { ...CLOSE_STYLE, ...props.closeStyle };

  const {
    id,
    onEnter,
    onLeave,
    onClose,
    content,
    itemStyle,
    closeStyle,
  } = props;

  return (
    <li
      key={id}
      style={itemStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span style={closeStyle} onClick={onClose}>
        &#x2715;
      </span>
      {content}
    </li>
  );
};

export const NotifyController = (
  props: PropsWithChildren<
    INotifyControllerOptions & {
      NotifyComponent?: (props: NotifyComponentProps) => JSX.Element;
    }
  >
) => {
  props = {
    uid: '*',
    timeout: DEFAULT_TIMEOUT,
    position: DEFAULT_POSITION,
    max: 5,
    filter: () => true,
    ...props,
  };

  // Allow custom component to be passed to render function.
  const { children, NotifyComponent, ...rest } = props as Required<
    typeof props
  >;

  const controller = useNotify(rest);

  // Allow override of container.
  const containerStyle = getContainerStyle(rest.position);

  // If children provided use it otherwise render from default.
  return (
    <Portal>
      <ul id={`notify-controller-${controller.uid}`} style={containerStyle}>
        {children || controller.render(NotifyComponent)}
      </ul>
    </Portal>
  );
};

export const getContainerStyle = (position: NotifyContainerPosition) => {
  const styles = { ...CONTAINER_STYLES };

  if (position === 'bottom-right') return styles;

  // reset the styels.
  styles.bottom = undefined;
  styles.right = undefined;

  if (position === 'top') {
    styles.top = 0;
    styles.left = '50%';
    styles.transform = 'translateX(-50%)';
    return styles;
  }

  if (position === 'bottom') {
    styles.bottom = 0;
    styles.left = '50%';
    styles.transform = 'translateX(-50%)';
    return styles;
  }

  if (position === 'top-right') {
    styles.top = 0;
    styles.right = 0;
    return styles;
  }

  if (position === 'bottom-left') {
    styles.bottom = 0;
    styles.left = 0;
    return styles;
  }

  styles.top = 0;
  styles.left = 0;

  return styles;
};

export function useNotify(props?: string | INotifyControllerOptions) {
  
  if (typeof props === 'string') {
    props = {
      uid: props,
    };
  }

  props = {
    uid: '*',
    timeout: DEFAULT_TIMEOUT,
    position: DEFAULT_POSITION,
    max: 5,
    filter: () => true,
    ...props,
  };

  const { uid, timeout, max, position, filter } = props as Required<
    typeof props
  >;
  const itemStyle = props.itemStyle || { ...ITEM_STYLE };
  const closeStyle = props.closeStyle || { ...CLOSE_STYLE };

  const notify = useContext();
  const [removeQueue, setRemoveQueue] = useState<number[]>([]);

  function add(options: INotifyOptions): void;
  function add(element: ReactNode): void;
  function add(message: string): void;
  function add(itemOrContent: string | INotifyOptions | ReactNode) {
    if (
      typeof itemOrContent === 'string' ||
      typeof itemOrContent === 'function' ||
      isValidElement(itemOrContent)
    )
      itemOrContent = {
        content: itemOrContent,
      };
    (itemOrContent as any).uid = uid;
    notify.add(itemOrContent);
  }

  function remove(itemOrId: string | NotifyModel) {
    notify.remove(itemOrId as any);
  }

  const removeAll = () => {
    notify.removeAll(uid);
  };

  /**
   * Filters and limits collection.
   *
   * @param items list of items to be filtered and limited.
   */
  const load = useCallback(() => {
    // Get filtered items.
    let items = (notify.items || []).filter(
      (item) => item.uid === uid && filter(item)
    );

    // If on bottom we want to display with newest
    // on bottom rather than top.
    if (position?.includes('top')) items = items.reverse();

    // limit the total number of notifications.
    return items.slice(0, max);
  }, [filter, max, notify.items, position, uid]);

  /**
   * Builds notification item list and renders/maps out item components.
   */
  const render = (
    NotifyComponent: (props: NotifyComponentProps) => JSX.Element
  ) => {
    return load().map((item) => {
      item = { timeout, ...item };

      const onClose = () => {
        if (!item.closeable) return;
        setRemoveQueue([...removeQueue, item.id as number]);
      };

      const componentProps = {
        ...item,
        onClose,
        NotifyComponent: NotifyComponent || NotifyComponentDefault,
        itemStyle,
        closeStyle,
      };

      if (typeof componentProps.content === 'function')
        componentProps.content = componentProps.content(item);

      return (
        <NotifyComponentCreate
          key={'notify-create-' + item.id}
          {...componentProps}
        />
      );
    });
  };

  useEffect(() => {
    removeQueue.forEach((id) => {
      notify.remove(id as any);
    });
  }, [removeQueue]);

  const controller = {
    // return normalized props for
    // extending to NotifyController
    options: props,
    add,
    remove,
    removeAll,
    uid,
    load,
    render,
  };

  return controller;
}
