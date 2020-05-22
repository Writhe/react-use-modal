import React, { CSSProperties, FunctionComponent, useMemo } from 'react';

import { DEV_MODE } from '../helpers/isDevMode';
import { Modal } from '../context/ModalContext';

export interface IModalOverlay {
  modal: Modal<any, any>;
  backgroundClassName?: string;
  backgroundStyle?: CSSProperties;
  onOverlayClick(): void;
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

const modalOverlayBackgroundStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
};

const modalOverlayContent: CSSProperties = {
  zIndex: 1,
};

export const ModalOverlay: FunctionComponent<IModalOverlay> = ({
  modal,
  backgroundStyle,
  backgroundClassName,
  onOverlayClick,
}) => {
  const mergedBackgroundStyle = useMemo(
    () => {
      if (DEV_MODE && backgroundStyle && backgroundClassName) {
        console.log(
          '%creact-use-modal:%cYou are using backgroundStyle and backgroundClassName props at the same time. Inline styles (including backgroundStyle) will be ignored.',
          'color: yellow; font-weight: bold;',
          'color: yellow; font-weight: regular;',
        );
      }

      if (backgroundClassName) return {};

      return {
        ...modalOverlayBackgroundStyle,
        ...(backgroundStyle || {}),
      };
    },
    [backgroundStyle, backgroundClassName],
  );

  return (
    <div style={modalOverlayWrapperStyle}>
      <div
        style={mergedBackgroundStyle}
        className={backgroundClassName}
        onClick={onOverlayClick}
      />
      <div style={modalOverlayContent}>
        {modal.getComponent()}
      </div>
    </div>
  );
};
