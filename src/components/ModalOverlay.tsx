import React, { CSSProperties, FunctionComponent } from 'react';

import { Modal } from '../context/ModalContext';

export interface IModalOverlay {
  modal: Modal<any, any>;
}

const modalOverlayWrapperStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99,
};

const modalOverlayBackground: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
};

const modalOverlayContent: CSSProperties = {
  zIndex: 1,
};

export const ModalOverlay: FunctionComponent<IModalOverlay> = ({ modal }) => {
  return (
    <div style={modalOverlayWrapperStyle}>
      <div style={modalOverlayBackground} />
      <div style={modalOverlayContent}>
        {modal.getComponent()}
      </div>
    </div>
  );
};
