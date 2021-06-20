# Notify

Notify is comprised of a provider, reducer and controller hook. It adds filterable notifications or toast messages to your site by simply adding a provider and calling <code>notify.add({})</code>.

These tools can be leveraged to create toast messages by type. For example you may wish to add messages for success events, errors, info messages and more.

## Setting up Provider

Since Notify uses context we need to wire up our provider. This will be where your App bootstraps. See instructions for [Create React App](https://react-redux.js.org/api/provider) or [NextJS](https://github.com/vercel/next.js/blob/master/examples/with-styletron/pages/_app.js) for additional help but it will look similar to the following:

**Again just to give you the idea, your config will likely be different or more involved.**

```tsx
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { Provider as NotifyProvider } from 'aerify/notify';

ReactDOM.render(
  <NotifyProvider>
    <App />
  </NotifyProvider>,
  document.getElementById('root');
);
```

## Using Controller Component

The Notify controller component can be scoped or it can include all notifications. You may wish to include an unscoped controller in a common component say a layout component. This will allow you to call or add a notification from anywhere in your application.

If you want specific types of messages scoped say based on user type or some other parameter you can certainly do that.

Yep that's it!!

```tsx
<NotifyController />
```

Or to scope it

```tsx
<NotifyController uid="some-key" />
```

## Combining with Hook

You can also pass in a defined set of options and control notifications via a hook.

```tsx
import React from 'react';
import { useNotify } from 'aerify/notify';

const Home = () => {

  const notify = useNotify('some-key'); // or useNotify({ uid: 'some-key', ....options })

  return (
    <button onClick={() => notify.add('some scoped notification')}>Show Notification</button>
    <NotifyController {...notify.options} />
  );

};
```

## Using with Animation (Framer-Motion)

You can also customize the controller so you can then use your favorite animation or advanced styling. Here's an example using [framer-motion](https://www.framer.com/motion/)'s animation library.

What's nice about this, is Notify handles the heavy lifting. Create your "li" component in this case pass it in to Notify's render function and viola nice smooth animations for your notifications.

You can then easily build on this extending Notify to create variants if you wish.

**NOTE: ITEM_STYLE and CLOSE_STYLE are default styles that are exported, feel free to use your own or extend!**

```tsx
import React from 'react';
import { useNotify, ITEM_STYLE, CLOSE_STYLE } from 'aerify/notify';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {

  const notify = useNotify('some-key'); // or useNotify({ uid: 'some-key', ....options })

  const NotifyComponent = ({ onClose, content, onEnter, onLeave, id }) => {
    return (
      <motion.li
        key={id}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        onHoverStart={onEnter}
        onHoverEnd={onLeave}
        style={ITEM_STYLE}
      >
        <span style={CLOSE_STYLE} onClick={onClose}>&#x2715;</span>
        {content}
      </motion.li>
    );
  };

  return (
    <button onClick={() => notify.add('some animated notification')}>Show Notification</button>
    <NotifyController {...ctrl.options}>
      <AnimatePresence initial={false}>
        {ctrl.render(NotifyComponent)}
      </AnimatePresence>
    </NotifyController>
  );

};
```
