import React, { CSSProperties, FunctionComponent, useCallback, useRef, useState } from 'react';

import { IGenericModal, IModalContext, Modal, ModalContext } from '../context/ModalContext';
import { ModalOverlay } from './ModalOverlay';

export interface IModalProvider {
  inertClassName?: string;
  inertStyle?: CSSProperties;
}

export const ModalProvider: FunctionComponent<IModalProvider> = ({
  children,
  inertClassName,
  inertStyle,
}) => {
  const [currentModal, setCurrentModal] = useState<Modal<any, any> | null>(null);
  const modalArrayRef = useRef<Modal<any, any>[]>([]);

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
      props: Omit<P, 'onResolve'>,
    ) => {
      const newModal = new Modal<T, P>(component, props, clearModal);

      modalArrayRef.current.push(newModal);
      setCurrentModal(newModal);

      return newModal.run() as Promise<T>;
    },
    [clearModal],
  );

  const contextValue: IModalContext = {
    currentModal,
    modal,
    clearModal,
  };

  const isInert = Boolean(currentModal);

  return (
    <ModalContext.Provider value={contextValue}>
      {Boolean(currentModal) && (
        <ModalOverlay modal={modalArrayRef.current[modalArrayRef.current.length - 1]}/>
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
