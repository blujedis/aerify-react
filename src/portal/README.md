# Portal

Simple implementation of React Portal for modals, notification and the like.

## Portal Component

By default the Portal will init using <code>**ROOT_PORTAl**</code> as it's ID. You can also pass in your own selector or even a known ref if you wish. This could be useful when using SSR such as [NextJS](https://nextjs.org/) where you may already have a portal element defined in your [\_document.tsx](https://nextjs.org/docs/advanced-features/custom-document). That said this is not required and if not defined your Portal will still bind as it should.

Import the Portal component and use accordingly.

```tsx
import React, { useState } from 'react';
import { Portal } from 'aerify';

const Home = (props) => {

  const [visible, setVisible] = useState(false);

  const divStyle = {
    width: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    padding: '12px',
    top: '24px',
    left: '50%',
    transform: `translateX(-50%)`,
    border: '1px solid #b3ccff',
    backgroundColor: '#ccddff',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
  };

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={() => setVisible(true); }>Show Portal Component</button>
      <Portal>
        { !visible ? null :
          <div style={divStyle}>
            <span>Hello Portal Message...</span>
            <a href="#" onClick={setVisible(false)}>Close</a>
          </div>
        }
      </Portal>
    </div>
  );

};
```

## Portal Hook

The Portal hook is excellent for handling Modals. While the hook does not provide any Modal element itself, it provides the common controls such as opening, closing, checking if visible, handling backdrop click events, locking scrolling when enabled and closing on escape keypress.

If you notice this is not much different than the above example simply using state. The main difference with the hook are the events it wires up for you.

```tsx
import React from 'react';
import { usePortal } from 'aerify';

const Home = (props) => {
  const { Portal, containerRef, visible, open, close } = usePortal({
    closeOnEsc: true,
    // closes on any element outside modal
    // container and why a ref must be provided.
    closeOnClick: true,
    allowScroll: false,
    onClose: (e: Event) => {
      // do something on close.
    },
  });

  const divStyle = {
    width: '640px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    padding: '12px',
    border: '1px solid #b3ccff',
    backgroundColor: '#ccddff',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    minHeight: '100px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
  };

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={open}>Show Modal</button>
      <Portal>
        {!visible ? null : (
          <div style={divStyle} ref={containerRef}>
            <span>Hello Portalized Modal...</span>
            <a href="#" onClick={close}>
              Close
            </a>
          </div>
        )}
      </Portal>
    </div>
  );
};
```

## Extend Hook for Modals

If you haven't already realized this, extending this hook to provide features for you modals is rather trivial given the power of React hooks.

The beauty of React hooks is that you can sort of chain them together one calling another. This makes for breaking up your code in to smaller chunks making it more manageable. They really are great!!

Here's an example of what you might do to provide a couple different modal states for ease of use.

```tsx
import React, { PropsWithChildren } from 'react';
import { usePortal } from 'aerify';

// Let's import some styles a great lib for this is Bulma!
// IMPORTANT your import may be different than below, just an example.
// or you may wish to import scss files.
// @see https://bulma.io/
import './node_modules/bulma/css/bulma.css';

// Create a new hook which leverages Portal hook
// pass in any options we want and now we have
// a reusable Modal Component.
const useModal = (options = {}) => {
  const { Portal, containerRef, visible, open, close } = usePortal(options);

  // Note: the below shows Typescript however you can ignore everything
  // after the colon and the > if not using types. You'd end up with just (props).
  const Modal = (
    props: PropsWithChildren<{
      variant?: 'danger' | 'success';
      onClose?: () => void;
    }>
  ) => {
    props = {
      variant: 'success',
      ...props,
    };

    const { variant, onClose, children } = props;

    const closeHandler = () => {
      // Call the root close handler from
      // our portal hook.
      close();

      // If user passed in an "onClose" handler
      // then we call it. You might also decide
      // to pass in which button was clicked
      // here if you have multiple.
      if (onClose) onClose();
    };

    if (!visible) return null;

    return (
      <Portal>
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-content" ref={containerRef}>
            <div className="modal-card">
              <header
                className={`modal-card-title has-text-white has-background-${variant}`}
              >
                <p
                  className="modal-card-title"
                  style={{ textTransform: 'capitalize' }}
                >
                  {variant}
                </p>
                <button
                  className="delete"
                  aria-label="close"
                  onClick={closeHandler}
                ></button>
              </header>
              <section className="modal=-card-body">{children}</section>
              <footer className="modal-card-foot">
                <button className="button" onClick={closeHandler}>
                  Ok
                </button>
              </footer>
            </div>
          </div>
        </div>
      </Portal>
    );
  };

  return {
    visible,
    open,
    close,
    Modal,
  };
};

export default useModal;
```

## Use our Custom Modal Hook

Now that we've created our custom Modal hook let's see how easy it is to use!

```tsx
import React from 'react';
import useModal from './path/to/modal.tsx';

// Again the below "Role" and "IUser" are
// just Typescript types. If NOT using typescript
// you can safely ignore.

// That said I strongly suggest you do, your code
// will be better and you'll have a better chance
// at working with larger entities/companies as it's
// a MUST have in the enterprise world.

type Role = 'user' | 'manager' | 'admin';

interface IUser {
  username: string;
  role: Role[];
}

const Home = (props: { user: IUser }) => {
  const { user } = props;
  const { Modal, open } = useModal();

  const changeUserPermission = () => {
    // We've made out modal static here
    // but you could even make your "open"
    // method here accept a string or even
    // an element and have that piped into your
    // modal. Sky is the limit!

    if (!user.role.includes('admin')) {
      return modal.open();
    } else {
      // do some process saving to database.
    }
  };

  // In the below the button would probably be a checkbox
  // in a form or something but you get the idea...

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={changeUserPermission}>Make User an Admin</button>
      <Modal variant="danger">
        Whoops you do NOT have permission for that action!
      </Modal>
    </div>
  );
};
```
