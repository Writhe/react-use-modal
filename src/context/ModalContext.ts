import { createContext, FunctionComponent } from 'react';
import { noop } from '../helpers/noop';

export interface IGenericModal<T> {
  /**
   * Callback to be used to resolve the promise and hide the modal.
   *
   * @param result
   */
  onResolve(result: T): void;

  /**
   * This function sets the click-outside-the-modal handler.
   * The handler gets called when the user clicks the modal overlay element rendered by the ModalProvider.
   *
   * @param handler
   */
  setOverlayClickHandler(handler: () => void): void;
}

export type ModalProps<T> = Omit<T, 'onResolve' | 'setOverlayClickHandler'>;

export type ClearModalCallback = (modal: Modal<any, any>) => void;

export class Modal<T, P extends IGenericModal<T>> {
  component: FunctionComponent<P>;
  props: ModalProps<P>;
  resolve: (result: T) => void;
  clearModal: ClearModalCallback;
  setOverlayClickHandler: (handler: () => void) => void;

  constructor(
    component: FunctionComponent<P>,
    props: ModalProps<P>,
    clearModal: ClearModalCallback,
    setOverlayClickHandler: (handler: () => void) => void,
  ) {
    this.component = component;
    this.props = props;
    this.clearModal = clearModal;
    this.resolve = noop;
    this.setOverlayClickHandler = setOverlayClickHandler;
  }

  async run() {
    return new Promise<T>(resolve => {
      this.resolve = resolve;
    });
  }

  handleResolve = (result: T) => {
    this.clearModal(this);
    this.resolve(result);
  };

  getComponent = () => this.component({
    ...this.props,
    onResolve: this.handleResolve,
    setOverlayClickHandler: this.setOverlayClickHandler,
  } as P);
}

export type ModalFunction = <T extends any, P extends IGenericModal<T>>(
  component: FunctionComponent<P>,
  props: ModalProps<P>,
) => Promise<T>

export interface IModalContext {
  currentModal: Modal<any, any> | null;
  modal: ModalFunction;
  clearModal(modal: Modal<any, any>): void;
  setOverlayClickHandler(handler: () => void): void;
}

export const ModalContext = createContext<IModalContext>(null as unknown as IModalContext);
