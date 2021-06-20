import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Portal } from './component';
import { IPortalHook } from './types';


function useStateRef<T>(initialValue: T) {
  const [state, setStateBase] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);
  const setState = (value: T) => {
    ref.current = value;
    setStateBase(value);
  };
  return [state, setState, ref] as [T, (value: T) => void, MutableRefObject<T>];
}

const usePortal = (props?: IPortalHook) => {
  props = {
    closeOnClick: true,
    closeOnEsc: true,
    allowScroll: false,
    ...props,
  };

  const { closeOnClick, closeOnEsc, onClose, allowScroll } = props as Required<
    typeof props
  >;

  const [visible, setVisible, visibleRef] = useStateRef(false);

  const html = useRef<HTMLHtmlElement>();
  const overflow = useRef<string>();
  const container = useRef<Element>();

  const open = useCallback(
    (e?) => {
      if (visibleRef.current) return;

      if (e && e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

      if (!allowScroll && html.current) {
        // Just in case for some reason it changes.
        // ensure we can set back to previous value.
        overflow.current = html.current.style.overflow as string;
        html.current.style.overflow = 'hidden';
      }

      setVisible(true);
    },
    [allowScroll, setVisible, visibleRef]
  );

  const close = useCallback(
    (e?) => {
      if (!visibleRef.current) return;

      if (!allowScroll && html.current && overflow.current)
        html.current.style.overflow = overflow.current as string;

      setVisible(false);
      container.current = undefined;

      if (onClose) onClose(e);
    },
    [allowScroll, onClose, setVisible, visibleRef]
  );

  const containerRef = (el) => {
    container.current = el;
  };

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      html.current = htmlElement;
      overflow.current = html.current.style.overflow;
    }
    return () => {
      html.current = undefined;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 27 && visibleRef.current) close(e);
    }

    function handleClick(e) {
      if (visibleRef.current && !container.current)
        console.warn(
          `Cannot use click handler with containerRef of undefined. Try <div ref={containerRef}></div> on primary container element.`
        );
      if (
        !visibleRef.current ||
        !container.current ||
        container.current.contains(e.target) ||
        (e.button && e.button !== 0)
      )
        return;
      close(e);
    }

    if (closeOnEsc)
      document.addEventListener('keydown', handleKeyDown);

    if (closeOnClick)
      document.addEventListener('click', handleClick);

    return () => {
      if (closeOnEsc)
        document.removeEventListener('keydown', handleKeyDown);
      if (closeOnClick)
        document.removeEventListener('click', handleClick);
    };
  }, [closeOnClick, closeOnEsc, close, visibleRef]);

  return {
    Portal,
    containerRef,
    visible,
    open,
    close,
  };

};

export { usePortal };
