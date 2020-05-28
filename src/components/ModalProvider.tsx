import React, { CSSProperties, FunctionComponent } from 'react';

import { ModalOverlay } from './ModalOverlay';
import { useModalProviderLogic } from '../hooks/useModalProviderLogic';
import { ModalContext } from '../context/ModalContext';

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
  const {
    setOverlayClickHandler,
    handleOverlayClick,
    currentModal,
    clearModal,
    modal
  } = useModalProviderLogic();

  const isInert = Boolean(currentModal);

  return (
    <ModalContext.Provider value={{ currentModal, clearModal, modal, setOverlayClickHandler }}>
      {currentModal && (
        <ModalOverlay
          modal={currentModal}
          backgroundClassName={backgroundClassName}
          backgroundStyle={backgroundStyle}
          onOverlayClick={handleOverlayClick}
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
