import React, { CSSProperties, FunctionComponent, useCallback, useRef, useState } from 'react';

import { noop } from '../helpers/noop';
import { IGenericModal, IModalContext, Modal, ModalContext, ModalProps } from '../context/ModalContext';
import { ModalOverlay } from './ModalOverlay';

export interface IModalProvider {
  inertClassName?: string;
  inertStyle?: CSSProperties;
  backgroundClassName?: string;
  backgroundStyle?: CSSProperties;
}

export const ModalProvider: FunctionComponent<IModalProvider> = ({
  children,
  inertClassName,
  inertStyle,
  backgroundStyle,
  backgroundClassName,
}) => {
  const [currentModal, setCurrentModal] = useState<Modal<any, any> | null>(null);
  const modalArrayRef = useRef<Modal<any, any>[]>([]);
  const overlayClickHandler = useRef<() => void>(noop);

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
    overlayClickHandler.current = handler;
  };

  const contextValue: IModalContext = {
    currentModal,
    modal,
    clearModal,
    setOverlayClickHandler,
  };

  const isInert = Boolean(currentModal);

  return (
    <ModalContext.Provider value={contextValue}>
      {Boolean(currentModal) && (
        <ModalOverlay
          modal={modalArrayRef.current[modalArrayRef.current.length - 1]}
          backgroundClassName={backgroundClassName}
          backgroundStyle={backgroundStyle}
          onOverlayClick={() => overlayClickHandler.current()}
        />
      )}
      <div
        className={isInert ? inertClassName : ''}
        style={isInert ? inertStyle : undefined}
      >
        {children}
      </div>
    </ModalContext.Provider>
  );
};
