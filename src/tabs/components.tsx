import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  useEffect,
} from 'react';
import { useTabs } from './controller';
import { DivProps, IPane, IPanel, ITab, ITabs } from './types';

export const Tab = (props: ITab) => {
  const { element, id, tabs, activeClass } = props as Required<typeof props>;

  const tabId = `tab-${id}`;
  const tabHash = '#' + tabId;

  // Prevent default to prevent hash jump.
  let component = (
    <a
      href={tabHash}
      onClick={(e) => {
        e.preventDefault();
        tabs.setActive(id);
      }}
    >
      {props.label as any}
    </a>
  );

  if (typeof props.label !== 'string') {
    if (typeof props.label === 'function') {
      const Comp = props.label as (props: any) => JSX.Element;
      component = <Comp {...props} />;
    } else {
      component = props.label as any;
    }
  }

  const className = activeClass && id === tabs.active ? activeClass : '';

  if (element === 'li')
    return (
      <li id={tabId} className={className}>
        {component}
      </li>
    );

  return (
    <div id={tabId} className={className}>
      {component}
    </div>
  );
};

const Panel = (props: PropsWithChildren<IPanel>) => {
  const {
    children,
    tabs,
    activeClass,
    id,
    containerProps,
    active,
    tab,
  } = props as Required<typeof props>;

  useEffect(() => {
    if (tabs) {
      if (!tabs.ids.includes(id)) {
        tabs.addTab(id, tab);
      }
      if (active && !tabs.active) tabs.setActive(id);
    }
  }, [id, tabs]);

  if (tabs?.active && id !== tabs.active) return null;

  let className = activeClass && id === tabs?.active ? activeClass : '';

  if (containerProps.className && className)
    className = containerProps.className + ' ' + className;

  return (
    <div {...containerProps} className={className}>
      {children}
    </div>
  );
};

export const Pane = (props: PropsWithChildren<IPane>) => {
  const { children } = props;
  return <>{children}</>;
};

export const Tabs = (props?: PropsWithChildren<ITabs>) => {
  props = {
    element: 'ul',
    activeClass: 'is-active',
    ...props,
  } as Required<ITabs>;

  const {
    children,
    element,
    activeClass,
    tabs: tabsInit,
    className,
    onChange,
  } = props;

  const initTabs = [] as JSX.Element[];

  // Allow passing in tabs instance
  let tabs = useTabs();

  if (tabsInit) tabs = tabsInit;

  const containerProps = { ...props.containerProps } as DivProps;
  containerProps.className = containerProps.className || className;

  const panels = Children.toArray(children).map((c, i) => {
    const child = c as ReactElement;
    const label = child.props?.label;

    if (!label) throw new Error(`Invalid label configuration at index ${i}.`);

    const id = child.props?.id || i + '';
    const active = child.props?.active;
    const panelClassName = child.props?.className;
    const panelContainerProps = child.props?.containerProps || {};

    const tab = (
      <Tab
        key={i + 1}
        id={id}
        element={element === 'ul' ? 'li' : 'div'}
        label={label}
        tabs={tabs}
        activeClass={activeClass}
      />
    );

    initTabs.push(tab);

    panelContainerProps.className =
      panelContainerProps.className || panelClassName;

    return (
      <Panel
        key={i + 1}
        id={id}
        tabs={tabs}
        tab={tab}
        active={active}
        activeClass={activeClass}
        containerProps={panelContainerProps}
      >
        {child.props?.children}
      </Panel>
    );
  });

  // Limit on change events so it only fires
  // once we have all our tabs loaded.
  // after that fire on every tab change.
  const hasInit =
    tabs && tabs.state && initTabs.length === tabs.state.ids.length;

  useEffect(() => {
    if (onChange && hasInit) onChange(tabs.state);
  }, [tabs.active, onChange, tabs.state, hasInit]);

  if (element === 'ul') {
    return (
      <div {...containerProps}>
        <ul>{initTabs}</ul>
        {panels}
      </div>
    );
  }

  return (
    <div {...containerProps}>
      <div>{initTabs}</div>
      {panels}
    </div>
  );

};
