import { CSSProperties, FocusEventHandler } from "react";
import {
  MODAL_ACTION_STATE,
  MODAL_LIFECYCLE_STATE,
  MODAL_POSITION,
  MODAL_TRANSACTION_STATE,
} from "../contants";
import {
  ModalManagerInterface,
  ComponentPropsOptions,
  ModalActionState,
  ModalCallback,
  ModalComponent,
  ModalComponentProps,
  ModalConfirmType,
  ModalLifecycleState,
  ModalMiddlewareProps,
  ModalOptions,
  ModalState,
  StateControllerOptions,
  ModalEditOptions,
} from "../types";
import { delay } from "../utils/delay";

interface ModalProps {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent;
  options: ModalOptions<any>;
}

export class Modal {
  private lifecycleState: ModalLifecycleState = MODAL_LIFECYCLE_STATE.open;
  private actionState: ModalActionState = MODAL_ACTION_STATE.initial;
  private actionCallback: ModalCallback = () => { };
  private afterCloseCallback: () => unknown = () => { };
  private listeners: ((state: ModalState) => void)[] = [];
  private breakPoint = 0;
  private isInitial = false;
  private stateResponsive: boolean = false;
  private initialComponent: ModalComponent;
  private currentComponent: ModalComponent;
  private componentProps!: ModalComponentProps;
  private escKeyActive: boolean = true;
  private role: string = "dialog";
  private label: string = "dialog";
  private isOpened: boolean = false;

  private _id: number;
  private _modalKey: string | null;
  private _name: string;
  private _options: ModalOptions<any>;
  private _isCurrent: boolean = false;
  private _isAwaitingConfirm = false;
  private _isCloseDelay = false;
  private _closeDelayDuration = -1;
  private _confirm: ModalConfirmType | undefined = undefined;
  private _onOpenAutoFocus: FocusEventHandler<HTMLDivElement> | undefined = undefined;
  private _state: ModalState;

  public componentRef: HTMLDivElement | null = null;

  constructor(
    { id, modalKey, name, component, options }: ModalProps,
    private manager: ModalManagerInterface
  ) {
    this._id = id;
    this._name = name;
    this._modalKey = modalKey;
    this.initialComponent = component;
    this.currentComponent = component;
    this._options = options;

    this.bind();
    this.setOption();
    this.setComponentProps();

    this._state = this.getState();
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
    this.active = this.active.bind(this);
    this.close = this.close.bind(this);
  }

  private setOption() {
    const {
      closeDelay,
      action,
      stateResponsiveComponent,
      escKeyActive,
      role,
      title,
      label,
      onOpenAutoFocus
    } = this.options;

    this.setCloseDelay(closeDelay)

    if (action) {
      this.actionCallback = action;
    }

    if (stateResponsiveComponent) {
      this.stateResponsive = stateResponsiveComponent;
    }

    if (escKeyActive === false) {
      this.escKeyActive = false;
    }

    if (typeof role === "string") {
      this.role = role;
    }

    if (label) {
      this.label = label;
    } else {
      this.label = typeof title === "string"
        ? title
        : this._name === "unknown"
          ? "dialog"
          : this._name;
    }

    if (onOpenAutoFocus) {
      this._onOpenAutoFocus = onOpenAutoFocus;
    }
  }

  private initComponent() {
    this.currentComponent = this.initialComponent;

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
    return this.currentComponent;
  }

  get confirm() {
    return this._confirm;
  }

  get isCurrent() {
    return this._isCurrent;
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

  get callback() {
    return this.actionCallback;
  }

  get onOpenAutoFocus() {
    return this._onOpenAutoFocus;
  }

  get state() {
    return this._state;
  }

  /* 컴포넌트 및 상태 관리 */

  private setComponentProps(
    options: Omit<
      Partial<ModalComponentProps>,
      "action" | "actionState" | "payload"
    > = {}
  ) {
    const {
      title,
      subTitle,
      content,
      subContent,
      confirmContent,
      cancelContent,
      customActionContent,
      payload,
    } = this.options;

    const componentProps = {
      title,
      subTitle,
      content,
      subContent,
      confirmContent,
      cancelContent,
      customActionContent,
      isEscKeyActive: this.escKeyActive,
      payload,
      action: this.action,
      actionState: this.actionState
    };

    this.componentProps = { ...componentProps, ...options };
  }

  /**
   * TO-DO
   * modal에서는 그냥 바꾸는 로직만 있고 modalManager에서 처리할 것.
  */
  private changeComponent(
    component: string | ModalComponent,
    options: ComponentPropsOptions = {}
  ) {
    if (typeof component === "function") {
      this.currentComponent = component;
    } else {
      const modalSeed = this.manager.getModalComponentSeed(component);

      if (!modalSeed) {
        this.initComponent();
        return;
      }

      this.currentComponent = modalSeed.component;
    }

    this.setComponentProps(options);
  }

  private changeStateResponsiveComponent({
    component,
    options,
  }: {
    component?: string | ModalComponent;
    options?: ComponentPropsOptions;
  } = {}) {
    if (this.actionState === "initial") {
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

    this.changeComponent(this.actionState, options);
    this.notify();

    return;
  }

  private changeState(
    stateControllerOptions?:
      | string
      | StateControllerOptions
      | ((confirm?: ModalConfirmType) => void)
  ) {
    if (!stateControllerOptions) {
      this.changeStateResponsiveComponent();

      return;
    }

    if (typeof stateControllerOptions === "function") {
      this.afterCloseCallback = stateControllerOptions;

      this.changeStateResponsiveComponent();

      return;
    }

    if (typeof stateControllerOptions === "string") {
      this.changeStateResponsiveComponent({
        options: { content: stateControllerOptions },
      });

      return;
    }

    const { isAwaitingConfirm, component, afterCloseCallback, options } =
      stateControllerOptions;

    if (isAwaitingConfirm) {
      this._isAwaitingConfirm = isAwaitingConfirm;
    }

    if (afterCloseCallback) {
      this.afterCloseCallback = afterCloseCallback;
    }

    this.changeStateResponsiveComponent({ component, options });
  }

  edit({ component, ...contents }: ModalEditOptions) {
    if (component) {
      this.initialComponent = component;

      if (!this._options.stateResponsiveComponent || this.actionState === "initial") {
        this.currentComponent = component;
      }

    }

    this._options = { ...this._options, ...contents };
    this.setOption();
    this.notify();
  }

  /* 상태 조회 */

  getActionState() {
    return this.actionState;
  }

  getLifecycleState() {
    return this.lifecycleState;
  }

  /* 생명주기 */

  async init() {
    if (this.isInitial) {
      return;
    }

    this.isInitial = true;

    // 애니메이션을 위한 로직
    // init 스타일로 렌더하고 난 뒤에 active로 변경함.
    setTimeout(() => {
      this.active();
    }, 0);

    await this.manager.executeAsync(delay, this.options.duration ?? 0);

    // initial - active 애니메이션이 종료됨을 확인하기 위함.
    this.isOpened = true;
    this.notify();
  }

  active() {
    this.lifecycleState = "active";

    this.notify();
  }

  close() {
    this.lifecycleState = "close";

    this.notify();

    return this.options.closeModal(this.afterCloseCallback, this.confirm);
  }

  blockCloseDelay() {
    this._isCloseDelay = false;

    return this;
  }

  setCloseDelay(duration: number = -1) {
    if (duration < 1) {
      this._isCloseDelay = false;

      return this;
    }

    this._isCloseDelay = true;
    this._closeDelayDuration = duration;

    return this;
  }

  updateIsCurrent(isCurrent: boolean) {
    if (this._isCurrent === isCurrent) {
      return this;
    }

    this._isCurrent = isCurrent;

    this.notify();

    return this;
  }

  /* 상태 업데이트 및 리스너 관리 */

  getState(): ModalState {
    const { className, style } = this.getModalStyle();

    return {
      isActive: this.lifecycleState === MODAL_LIFECYCLE_STATE.active,
      isOpened: this.isOpened,
      actionState: this.actionState,
      component: this.currentComponent,
      componentProps: this.componentProps,
      modalClassName: className,
      modalStyle: style,
      backCoverStyle: this.getBackCoverStyle(),
      isEscKeyActive: this.escKeyActive,
      label: this.label,
      role: this.role,
    };
  }

  subscribe(listener: (state: ModalState) => void) {
    this.listeners.push(listener);

    return this;
  }

  unsubscribe(listener: (state: ModalState) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);

    return this;
  }

  notify() {
    const state = this.getState();

    this._state = state;

    this.listeners.forEach((listener) => listener(state));

    return this;
  }

  /* 액션 및 이벤트 처리 */

  getMiddlewareProps(): ModalMiddlewareProps {
    return {
      modalState: this,
    };
  }

  async action(confirm?: ModalConfirmType, callback?: ModalCallback) {
    return this.manager.executeWithTransaction(() => {
      if (confirm !== undefined) {
        this._confirm = confirm;
      }

      if (callback) {
        this.actionCallback = callback;
      }

      return this.options.middleware(this.getMiddlewareProps());
    }, undefined);
  }

  initial() {
    this.actionState = MODAL_ACTION_STATE.initial;
    this.changeState();

    return this;
  }

  pending(
    message?:
      | string
      | Omit<StateControllerOptions, "afterCloseCallback" | "isAwaitingConfirm">
  ) {
    this.actionState = MODAL_ACTION_STATE.pending;

    this.changeState(message);

    return this;
  }

  success(
    message?:
      | string
      | StateControllerOptions
      | ((confirm?: ModalConfirmType) => void)
  ) {
    this.actionState = MODAL_ACTION_STATE.success;

    this.changeState(message);

    return this;
  }

  error(
    message?:
      | string
      | StateControllerOptions
      | ((confirm?: ModalConfirmType) => void)
  ) {
    this.actionState = MODAL_ACTION_STATE.error;

    this.changeState(message);

    return this;
  }

  end(
    message?:
      | string
      | Omit<StateControllerOptions, "component">
      | ((confirm?: ModalConfirmType) => void)
  ) {
    this.actionState = MODAL_ACTION_STATE.initial;

    this.changeState(message);

    return this;
  }

  /* 스타일 및 렌더링 */

  getModalStyle(): { className?: string; style: CSSProperties } {
    const { position, duration, transitionOptions } = this.options;

    const mergedPosition =
      typeof position === "function" ? position(this.breakPoint) : position;
    const isAciveState = this.lifecycleState === MODAL_LIFECYCLE_STATE.active;
    const { className, ...modalPosition } = this.manager.getCurrentModalPosition(
      this.lifecycleState,
      mergedPosition
    );
    const transition = this.manager.getModalTransition(
      duration,
      transitionOptions
    );

    return {
      className,
      style: {
        pointerEvents: isAciveState ? "auto" : "none",
        ...transition,
        ...modalPosition,
      }
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

    const cursor = (() => {
      if (
        this.manager.getTransactionState() !== MODAL_TRANSACTION_STATE.idle ||
        !isAciveState ||
        backCoverConfirm === null
      ) {
        return "default";
      }

      return "pointer";
    })();

    return {
      cursor,
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
}
