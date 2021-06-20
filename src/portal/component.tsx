import {
  PropsWithChildren,
  useEffect,
  useState,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { IPortal } from './types';


const Portal = (props: PropsWithChildren<IPortal>) => {
  props = {
    selector: '__ROOT_PORTAL__',
    ...props,
  };

  const { selector, children } = props as Required<typeof props>;

  const containerRef = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  const selectorPrefixed = '#' + selector?.replace(/^#/, '');

  useEffect(() => {
    
    containerRef.current = document.querySelector(selectorPrefixed);

    if (!containerRef.current) {
      const div = document.createElement('div');
      div.setAttribute('id', selector);
      document.body.appendChild(div);
      containerRef.current = div;
    }

    setMounted(true);

  }, [selector, selectorPrefixed]);

  return mounted
    ? createPortal(children, containerRef.current as Element)
    : null;

};

export { Portal };
