import { FunctionComponent, useCallback, useRef, useState } from 'react';

import { IGenericModal, Modal, ModalProps } from '../context/ModalContext';
import { noop } from '../helpers/noop';

export function useModalProviderLogic() {
  const [currentModal, setCurrentModal] = useState<Modal<any, any> | null>(null);
  const modalArrayRef = useRef<Modal<any, any>[]>([]);
  const overlayClickHandlerRef = useRef<() => void>(noop);

  const clearModal = useCallback(
    (modal: Modal<any, any>) => {
      const index = modalArrayRef.current.indexOf(modal);
      if (index !== -1) {
        modalArrayRef.current.splice(index, 1);
        setCurrentModal(modalArrayRef.current.length ? modalArrayRef.current[modalArrayRef.current.length - 1] : null);
      }
    },
    [],
  );

  const modal = useCallback(
    <T extends any, P extends IGenericModal<T>>(
      component: FunctionComponent<P>,
      props: ModalProps<P>,
    ) => {
      const newModal = new Modal<T, P>(
        component,
        props,
        clearModal,
        setOverlayClickHandler,
      );

      modalArrayRef.current.push(newModal);
      setCurrentModal(newModal);

      return newModal.run() as Promise<T>;
    },
    [clearModal],
  );

  const setOverlayClickHandler = (handler: () => void) => {
    overlayClickHandlerRef.current = handler;
  };

  const handleOverlayClick = () => overlayClickHandlerRef.current();

  return {
    currentModal,
    modal,
    clearModal,
    setOverlayClickHandler,
    handleOverlayClick,
  };
}
