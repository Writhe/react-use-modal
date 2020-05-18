import { createContext, FunctionComponent } from 'react';

export interface IGenericModal<T> {
  onResolve: (result: T) => void;
}

export type ClearModalCallback = (modal: Modal<any, any>) => void;

export class Modal<T, P extends IGenericModal<T>> {
  component: FunctionComponent<P>;
  props: Omit<P, 'onResolve'>;
  resolve: (result: T) => void;
  clearModal: ClearModalCallback;

  constructor(component: FunctionComponent<P>, props: Omit<P, 'onResolve'>, clearModal: ClearModalCallback) {
    this.component = component;
    this.props = props;
    this.clearModal = clearModal;
    this.resolve = () => {};
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

  getComponent = () => this.component({ ...this.props, onResolve: this.handleResolve } as P);
}

export type ModalFunction = <T extends any, P extends IGenericModal<T>>(
  component: FunctionComponent<P>,
  props: Omit<P, 'onResolve'>,
) => Promise<T>

export interface IModalContext {
  currentModal: Modal<any, any> | null;
  modal: ModalFunction;
  clearModal: (modal: Modal<any, any>) => void;
}

const initialModalContext: IModalContext = {
  currentModal: null,
  // @ts-ignore
  modal: () => null,
  clearModal: () => {},
};

export const ModalContext = createContext<IModalContext>(initialModalContext);
