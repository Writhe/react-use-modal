react-use-modal
===============

Simple solution for displaying and resolving modals in React

To do
-----

- [ ] Support for click-outside
- [ ] Overlay styling
- [ ] Example
- [ ] Better documentation (usage)
- [ ] Better documentation (code)
- [ ] Tests

Installation
------------

```
npm -i react-use-modal
```
or
```
yarn add react-use-modal
```

Usage (short version)
---------------------

Let's say you need a yes/no modal (one that resolves to a boolean)...

- Wrap your app in `<ModalProvider inertClass="inert" />`. `inertClass` is a CSS class that will get applied to your app when it's under the modal(s). You can also use `inertStyle`, as in "`inertStyle={ filter: 'blur(2px)', opacity: 0.5 }`".
- Create a component with interface that extends `IGenericModal<boolean>` - that will be your dialog window. Name it `ConfirmationModal` and make it accept a `title: string` prop, for reusability's sake.
- In the component, plop down two buttons with onClick handlers. Let one call `onResolve(false)` and the other - `onResolve(true)`.
- Somewhere in the UI, where the modal-requiring action gets initiated, `import { useModal } from 'react-use-modal'`.
- Call it to get a handy, higher-order function: `const modal = useModal()`.
- Using the newly acquired function, create a confirmation-dialog-displaying-promise-returning function, like so: `const getConfirmation = (title: string) => modal(ConfirmationModal, { title })`.
- Use the function to get user's answer to your yes/no question: `const isUserSure = await getConfirmation('Are you sure?')`.

Somewhere in your app's root:
```typescript jsx
ReactDOM.render(
  <React.StrictMode>
    <ModalProvider inertStyle={{ opacity: 0.5, filter: 'blur(2px)' }}>
      <App />
    </ModalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```


Dialog window:
```typescript jsx
import React, { FunctionComponent } from 'react';

import { useModal, IGenericModal } from 'react-use-modal';

interface IConfirmationModal extends IGenericModal<boolean> {
  title: string;
}

export const ConfirmationModal: FunctionComponent<IConfirmationModal> = ({
  title,
  onResolve,
}) => (
  <div>
    <h2>{title}</h2>
    <button onClick={() => onResolve(false)}>nope</button>
    <button onClick={() => onResolve(true)}>yes</button>
  </div>
);
```

Component that will initiate the modal-requiring action:
```typescript jsx
import React from 'react';
import { useModal } from 'react-use-modal';

import { ConfirmationModal } from './ConfirmationModal';

function App() {
  const modal = useModal();
  const getConfirmation = (title: string) => modal(ConfirmationModal, { title });

  const doDangerousThing = async () => {
    const isUserSure = await getConfirmation('Are you sure?');
    console.log(isUserSure ? 'User is sure.' : 'User is not sure.');
  };

  return (
    <div className="App">
      <button onClick={doDangerousThing}>Do the thing</button>
    </div>
  );
}

export default App;
```

> NOTE: Normally you would keep your heavy-lifting logic away from the components, of course.
One way to separate concerns in this scenario would be to pass the `getConfirmation` function as a parameter. 

Usage - long version
--------------------

Not implemented, yet.
