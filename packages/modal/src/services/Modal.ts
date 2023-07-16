import { defaultOptions } from "../contants/defaultOptions";
import { ModalActionState, ModalConfirmType, ModalContentsType, ModalLifecycleState } from "../types/common";
import { ModalComponent, ModalComponentProps } from "../types/component";
import { ModalControllerOptions, ModalControllerProps } from "../types/controller";
import { ModalMeta } from "../types/meta";
import { ModalState } from "../types/middleware";
import { ModalOptions } from "../types/options";

type Middleware = (modalState: ModalState) => void | Promise<void>;

type Options<T = any> = Omit<ModalOptions<T>, "middleware">;

interface ModalProps<T = any> {
  id: number;
  component: ModalComponent;
  options: Options<T>;
  getModalMeta: (key: string) => ModalMeta | null;
  middleware: Middleware;
}

type ModalListener = <T = any>(component: ModalComponent, props: ModalComponentProps<T>) => void;

/**
 * getOptions
 * getState
 * style 가져오기
 */
class Modal<T = any> {
  private _id = -1;
  private _component: ModalComponent = () => null;
  private _lifecycleState: ModalLifecycleState = "open";
  private _options: Options = defaultOptions;
  private _actionState: ModalActionState = "initial";
  private _message: ModalContentsType = null;
  private _confirm: ModalConfirmType = null;
  private _isAwaitingConfirm = false;
  private _isCloseDelay = false;
  private _endCallback: () => void = () => { };
  private getModalMeta: (key: string) => ModalMeta | null = () => null;
  private middleware: Middleware = () => { };

  private listeners: ModalListener[] = [];

  get id() {
    return this._id;
  }

  get lifecycleState() {
    return this._lifecycleState;
  }

  get actionState() {
    return this._actionState;
  }

  get message() {
    return this._message;
  }

  get confirm() {
    return this._confirm;
  }

  get isAwaitingConfirm() {
    return this._isAwaitingConfirm;
  }

  get isCloseDelay() {
    return this._isCloseDelay;
  }

  get options() {
    return this._options;
  }

  get endCallback() {
    return this._endCallback;
  }

  private getController() {

  }

  private getModalState() {

  }

  constructor({
    id,
    component,
    options,
    getModalMeta,
    middleware,
  }: ModalProps<T>) {
    this._id = id;
    this._component = component;
    this._options = options;
    this.getModalMeta = getModalMeta;
    this.middleware = middleware;

    this.bind();

  }

  private bind() {
    this.setLifecycleState = this.setLifecycleState.bind(this);
    this.open = this.open.bind(this);
    this.active = this.active.bind(this);
    this.close = this.close.bind(this);
    this.setModal = this.setModal.bind(this);
    this.initial = this.initial.bind(this);
    this.pending = this.pending.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.final = this.final.bind(this);
    this.action = this.action.bind(this);
    this.changeModalMeta = this.changeModalMeta.bind(this);
  }

  getBackCoverStyle() {

    const pointerEvents = this._lifecycleState === "active" ? "auto" : "none";

    return {
      pointerEvents,

    };
  }

  getModalStyle() {
    return {

    };
  }

  getComponentProps(): ModalComponentProps {
    return {
      id: this._id,
      state: this._actionState,
      message: this._message,
      confirm: this._confirm,
      action: this.action,
      ...this._options,
    };
  }

  subscribe(listener: ModalListener) {
    this.listeners.push(listener);

    return this;
  }

  unSubscribe(listener: ModalListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);

    return this;
  }

  notify() {
    const component = this._component;
    const componentProps = this.getComponentProps();

    this.listeners.forEach((listener) => listener(component, componentProps));

    this;
  }

  changeModalMeta(
    componentKey: string,
    isChangeComponent: boolean,
    changeOptions?: ModalControllerOptions
  ) {

    if (!isChangeComponent && !changeOptions) {
      return null;
    }

    const componentMeta = this.getModalMeta(componentKey);

    if (!componentMeta) {
      return;
    }

    const { component, options } = componentMeta;

    if (isChangeComponent) {
      this._component = component;
    }

    if (options) {
      this._options = { ...this._options, ...options };
    }

    this.notify();
  }

  setLifecycleState(lifecycleState: ModalLifecycleState) {
    this._lifecycleState = lifecycleState;
    this.notify();

    this;
  }

  open() {
    this.setLifecycleState("open");
  }

  active() {
    this.setLifecycleState("active");
  }

  close() {
    this.setLifecycleState("close");
  }

  setModal(modalActionState: ModalActionState, props: ModalControllerProps): void {
    const {
      options,
      ...restProps
    } = props;

    this._actionState = modalActionState;

    for (const key in restProps) {
      this[`_${key}` as keyof typeof this] = restProps[key as keyof typeof restProps] as typeof this[keyof typeof this];
    }

    if (options !== undefined) {
      this._options = { ...this._options, ...options };
    }

    this.notify();

    this;
  }

  initial(props: string | ModalComponentProps) {
    if (typeof props === "string") {
      this._message = props;

      return;
    }

    this.setModal("initial", props);
  }

  pending(props: string | ModalComponentProps) {
    if (typeof props === "string") {
      this._message = props;

      return;
    }

    this.setModal("pending", props);
  }

  success(props: string | ModalComponentProps) {
    if (typeof props === "string") {
      this._message = props;

      return;
    }

    this.setModal("success", props);
  }

  error(props: string | ModalComponentProps) {
    if (typeof props === "string") {
      this._message = props;

      return;
    }

    this.setModal("error", props);
  }

  final(props: string | ModalComponentProps) {
    if (typeof props === "string") {
      this._message = props;

      return;
    }

    this.setModal("final", props);
  }

  action(confirm: ModalConfirmType = null) {

    this._confirm = confirm;

    const modalState: ModalState = {
      confirm: this._confirm,
      isAwaitingConfirm: this._isAwaitingConfirm,
      isCloseDelay: this._isCloseDelay,
      actionState: this.actionState,
      callback: this._options.callback,
      closeDelay: this._options.closeDelay,
      open: () => this.setLifecycleState("open"),
      active: () => this.setLifecycleState("active"),
      close: () => this.setLifecycleState("close"),
      controller: this
    }

    this.middleware(modalState);

    return;
  }
}

export default Modal;