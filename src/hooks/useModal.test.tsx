import React, { FunctionComponent } from 'react';
import { render, act } from '@testing-library/react';

import { ModalProvider } from '../components/ModalProvider';
import { IGenericModal } from '../context/ModalContext';
import { useModal } from '../hooks/useModal';

interface IConfirmationModal extends IGenericModal<boolean> {
  title: string;
}

const ConfirmationModal: FunctionComponent<IConfirmationModal> = ({
  title,
  onResolve,
  setOverlayClickHandler,
}) => {
  setOverlayClickHandler(() => onResolve(false));

  return (
    <div className="confirmationModal" data-testid="confirmation-modal">
      <h2 data-testid="modal-title">{title}</h2>
      <button
        data-testid="button-no"
        onClick={() => onResolve(false)}
      >
        no
      </button>
      <button
        data-testid="button-yes"
        onClick={() => onResolve(true)}
      >
        yes
      </button>
    </div>
  );
};

const TestApp = ({ testCallback }: { testCallback: (result: string) => void }) => {
  const modal = useModal();
  const getConfirmation = (title: string) => modal(ConfirmationModal, { title });

  const doDangerousThing = async () => {
    const isUserSure = await getConfirmation('Are you sure?');
    testCallback(isUserSure ? 'User was sure' : 'User was not sure');
  };

  return (
    <div className="App">
      <button onClick={doDangerousThing} data-testid="button">Do the thing</button>
    </div>
  );
};


describe('useModal', () => {
  const testCallback = jest.fn();
  const renderTestApp = () => render(
    <ModalProvider>
      <TestApp testCallback={testCallback}/>
    </ModalProvider>
  );

  describe('returned function', () => {
    it('triggers modal display', () => {
      const { getByTestId, queryByTestId } = renderTestApp();

      const button = getByTestId('button');

      act(() => {
        button.click();
      });

      const modal = queryByTestId('confirmation-modal');

      expect(modal).toBeTruthy();
    });

    it('passes correct props to modal component', () => {
      const { getByTestId } = renderTestApp();

      const button = getByTestId('button');

      act(() => {
        button.click();
      });

      const title = getByTestId('modal-title');

      expect(title.textContent).toEqual('Are you sure?');
    });

    it('resolves to correct value when modal calls its onResolve', () => {
      const { getByTestId } = renderTestApp();

      const button = getByTestId('button');

      act(() => {
        button.click();
      });

      const yesButton = getByTestId('button-yes');

      act(() => {
        yesButton.click();
      });

      setImmediate(() => expect(testCallback).toHaveBeenCalledWith('User was sure'));
    });

    it('hides modal once it calls its onResolve', () => {
      const { getByTestId, queryByTestId } = renderTestApp();

      const button = getByTestId('button');

      act(() => {
        button.click();
      });

      const yesButton = getByTestId('button-yes');

      act(() => {
        yesButton.click();
      });

      expect(queryByTestId('confirmation-modal')).toBeFalsy();
    });
  });
});
