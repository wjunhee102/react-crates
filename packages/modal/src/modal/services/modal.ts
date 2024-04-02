import { CSSProperties } from "react";
import { MODAL_ACTION_STATE, MODAL_LIFECYCLE_STATE, MODAL_POSITION, MODAL_TRANSACTION_STATE } from "../contants";
import { ModalManagerInterface, ComponentPropsOptions, ModalActionState, ModalCallback, ModalComponent, ModalComponentProps, ModalConfirmType, ModalDispatchOptions, ModalLifecycleState, ModalMiddlewareProps, ModalOptions, ModalState, StateControllerOptions } from "../types";
import { delay } from "../utils/delay";

interface ModalProps {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent;
  options: ModalOptions<any>;
}

export class Modal {
  private originComponent: ModalComponent;
  private lifecycleState: ModalLifecycleState = MODAL_LIFECYCLE_STATE.open;
  private endCallback: () => unknown = () => { };
  private listeners: ((state: ModalState) => void)[] = [];
  private breakPoint = 0;
  private isInitial = false;
  private stateResponsive: boolean = false;

  private _id: number;
  private _modalKey: string | null;
  private _name: string;
  private _component: ModalComponent;
  private _componentProps!: ModalComponentProps;
  private _options: ModalOptions<any>;
  private _actionState: ModalActionState = MODAL_ACTION_STATE.initial;
  private _isAwaitingConfirm = false;
  private _isCloseDelay = true;
  private _closeDelayDuration = -1;
  private _confirm: ModalConfirmType | undefined = undefined;
  private _callback: ModalCallback = () => { };

  constructor(
    { id, modalKey, name, component, options }: ModalProps,
    private manager: ModalManagerInterface
  ) {
    this._id = id;
    this._name = name;
    this._modalKey = modalKey;
    this.originComponent = component;
    this._component = component;
    this._options = options;

    this.bind();
    this.setOption();
    this.initComponent();
  }

  /* 초기화 및 설정 */

  private bind() {
    this.action = this.action.bind(this);
    this.getActionState = this.getActionState.bind(this);
    this.getLifecycleState = this.getLifecycleState.bind(this);
    this.initial = this.initial.bind(this);
    this.pending = this.pending.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.end = this.end.bind(this);
    this.open = this.open.bind(this);
    this.active = this.active.bind(this);
    this.close = this.close.bind(this);
  }

  private setOption() {
    const { closeDelay, callback, stateResponsiveComponent } = this.options;

    if (closeDelay) {
      this._closeDelayDuration = closeDelay;
    }

    if (callback) {
      this._callback = callback;
    }

    if (stateResponsiveComponent) {
      this.stateResponsive = stateResponsiveComponent;
    }
  }

  private initComponent() {
    this._component = this.originComponent;

    this.setComponentProps();
  }

  /* Getter */

  get id() {
    return this._id;
  }

  get options() {
    return this._options;
  }

  get modalKey() {
    return this._modalKey;
  }

  get name() {
    return this._name;
  }

  get component() {
    return this._component;
  }

  get callback() {
    return this._callback;
  }

  get confirm() {
    return this._confirm;
  }

  get actionState() {
    return this._actionState;
  }

  get isAwaitingConfirm() {
    return this._isAwaitingConfirm;
  }

  get isCloseDelay() {
    return this._isCloseDelay;
  }

  get closeDelayDuration() {
    return this._closeDelayDuration;
  }

  /* 컴포넌트 및 상태 관리 */

  private setComponentProps(options: ModalDispatchOptions = {}) {
    const {
      title,
      subTitle,
      content,
      subContent,
      confirmContent,
      cancelContent,
      customContent,
      payload,
    } = this.options;

    const componentProps = {
      title,
      subTitle,
      content,
      subContent,
      confirmContent,
      cancelContent,
      customContent,
      action: this.action,
      actionState: this.actionState,
      payload,
    }

    this._componentProps = { ...componentProps, ...options };
  }

  private changeComponent(component: string | ModalComponent, options: ComponentPropsOptions = {}) {
    if (typeof component === "function") {
      this._component = component;
    } else {
      const modalSeed = this.manager.getModalComponentSeed(component);

      if (!modalSeed) {
        this.initComponent();
        return;
      }

      this._component = modalSeed.component;
    }

    this.setComponentProps(options);
  }

  private changeStateResponsiveComponent({ component, options }: { component?: string | ModalComponent; options?: ComponentPropsOptions; } = {}) {
    if (this._actionState === "initial") {
      this.initComponent();
      this.notify();

      return;
    }

    if (component) {
      this.changeComponent(component, options);
      this.notify();

      return;
    }

    if (!this.stateResponsive) {
      return;
    }

    this.changeComponent(this._actionState, options);
    this.notify();

    return;
  }

  private changeState(stateControllerOptions?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => void)) {
    if (!stateControllerOptions) {
      this.changeStateResponsiveComponent();

      return;
    }

    if (typeof stateControllerOptions === "function") {
      this.endCallback = stateControllerOptions;

      this.changeStateResponsiveComponent();

      return;
    }

    if (typeof stateControllerOptions === "string") {
      this.changeStateResponsiveComponent({ options: { content: stateControllerOptions } })

      return;
    }

    const { isAwaitingConfirm, component, endCallback, options } = stateControllerOptions;

    if (isAwaitingConfirm) {
      this._isAwaitingConfirm = isAwaitingConfirm;
    }

    if (endCallback) {
      this.endCallback = endCallback;
    }

    this.changeStateResponsiveComponent({ component, options });
  }

  /* 상태 조회 */

  getActionState() {
    return this._actionState;
  }

  getLifecycleState() {
    return this.lifecycleState;
  }

  get isActive() {
    return this.lifecycleState === "active";
  }

  /* 생명주기 */

  open() {
    this.lifecycleState = "open";
    this.manager.call(delay, this.options.duration ?? 0);

    this.notify();
  }

  active() {
    this.lifecycleState = "active";

    this.notify();
  }

  close() {
    this.lifecycleState = "close";
    this.options.closeModal(this.endCallback, this.confirm);

    this.notify();
  }

  init() {
    if (this.isInitial) {
      return;
    }

    this.isInitial = true;

    setTimeout(() => {
      this.active();
    }, 10);
  }

  blockCloseDelay() {
    this._isCloseDelay = false;

    return this;
  }

  setCloseDelay(duration: number) {
    if (duration < 1) {
      this._isCloseDelay = false;

      return this;
    }

    this._isCloseDelay = true;
    this._closeDelayDuration = duration;

    return this;
  }

  /* 액션 및 이벤트 처리 */

  getMiddlewareProps(): ModalMiddlewareProps {
    return {
      transactionController: this.manager,
      modalState: this,
    };
  }

  action(confirm?: ModalConfirmType, callback?: ModalCallback) {
    if (
      this.manager.getTransactionState() !== MODAL_TRANSACTION_STATE.idle
    ) {
      return;
    }

    if (confirm) {
      this._confirm = confirm;
    }

    if (callback) {
      this._callback = callback;
    }

    this.options.middleware(this.getMiddlewareProps());
  }

  initial() {
    this._actionState = "initial";
    this.changeState();

    return this;
  }

  pending(message?: string | Omit<StateControllerOptions, "endCallback" | "isAwaitingConfirm">) {
    this._actionState = MODAL_ACTION_STATE.pending;

    this.changeState(message);

    return this;
  }

  success(
    message?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => void)
  ) {
    this._actionState = MODAL_ACTION_STATE.success;
    this._isCloseDelay = true;

    this.changeState(message);

    return this;
  }

  error(
    message?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => void)
  ) {
    this._actionState = MODAL_ACTION_STATE.error;
    this._isCloseDelay = true;

    this.changeState(message);

    return this;
  }

  end(
    message?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => void)
  ) {
    this._actionState = MODAL_ACTION_STATE.initial;

    this.changeState(message);

    return this;
  }

  /* 스타일 및 렌더링 */

  getModalStyle(): CSSProperties {
    const { position, duration, transitionOptions } = this.options;

    const appliedPosition =
      typeof position === "function" ? position(this.breakPoint) : position;
    const isAciveState = this.lifecycleState === MODAL_LIFECYCLE_STATE.active;
    const modalPosition = this.manager.getCurrentModalPosition(
      this.lifecycleState,
      appliedPosition
    );
    const transition = this.manager.getModalTransition(
      duration,
      transitionOptions
    );

    return {
      pointerEvents: isAciveState ? "auto" : "none",
      ...transition,
      ...modalPosition,
    };
  }

  getBackCoverStyle(): CSSProperties {
    const {
      backCoverColor,
      backCoverOpacity,
      backCoverConfirm,
      duration,
      transitionOptions,
    } = this.options;

    const isAciveState = this.lifecycleState === MODAL_LIFECYCLE_STATE.active;
    const { background, opacity, ...backCoverPosition } =
      this.manager.getCurrentModalPosition(
        this.lifecycleState,
        MODAL_POSITION.backCover
      );
    const transition = this.manager.getModalTransition(
      duration,
      transitionOptions
    );

    return {
      cursor: isAciveState && backCoverConfirm !== null ? "pointer" : "default",
      ...transition,
      ...backCoverPosition,
      background: (isAciveState && backCoverColor) || background,
      opacity: (isAciveState && backCoverOpacity) || opacity,
    };
  }

  setBreakPoint(breakPoint: number) {
    if (this.breakPoint === breakPoint) {
      return;
    }

    this.breakPoint = breakPoint;
    this.notify();
  }

  /* 상태 업데이트 및 리스너 관리 */

  getState(): ModalState {
    return {
      Component: this.component,
      componentProps: this._componentProps,
      modalStyle: this.getModalStyle(),
      backCoverStyle: this.getBackCoverStyle()
    };
  }

  subscribe(listener: (state: ModalState) => void) {
    this.listeners.push(listener);

    return this;
  }

  unSubscribe(listener: (state: ModalState) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);

    return this;
  }

  notify() {
    const modalState = this.getState();

    this.listeners.forEach((listener) => listener(modalState));

    return this;
  }

}
