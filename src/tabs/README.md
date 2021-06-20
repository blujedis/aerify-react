# Tabs

The Tabs controller manages active tab state and allows for two variations of DOM structure. Either using UL and LI tags or using all Divs. You can specify this in your controller options.

Reminder as with all Aerify components, no styles beyond some basics are provided. The idea is to use a css library or your own styles. This makes the library more flexible so it can be used with just about any css ui library available.

## Using without Controller

You can use Tabs with or without a hook controller. The hook controller is used underneath and is useful when you want to interact with your tabs or you have a complex element for the tab trigger itself.

By default an LI element is created with an anchor inside. If you have simple string labels there is no need to use a complex setup. Just setup the Tabs component, add some panes and viola!

```tsx
import React from 'react';
import { Tags, Pane } from 'aerify';

const Home = () => {
  return (
    <div>
      <h2>Hello Tabs</h2>
      <Tags>
        <Pane label="one">Panel One</Pane>
        <Pane label="two">Panel Two</Pane>
        <Pane label="three">Panel Three</Pane>
      </Tags>
    </div>
  );
};
```

## Tabs with a Controller

Let's say you want some outside control with your Tabs component. Let's also assume you are using Bulma's great css library for your tabs. Here's how you'd accomplish that.

```tsx
import React from 'react';
import { Tags, Pane, useTabs } from 'aerify';

const Home = () => {
  const tabs = useTabs();

  const onTabsChange = (state) => {
    console.log(state);
  };

  // Not below we set the tabs class names for Bulma our the outer Tags component.

  return (
    <div>
      <h2>Hello Tabs</h2>
      <Tags tabs={tabs} className="tabs is-boxed" onChange={onTabsChange}>
        <Pane label="one">Panel One</Pane>
        <Pane label="two">Panel Two</Pane>
        <Pane label="three">Panel Three</Pane>
      </Tags>
    </div>
  );
};
```
