import React, { CSSProperties, ReactNode } from "react";
import { MODAL_POSITION, MODAL_TRANSACTION_STATE } from "../contants/constants";
import { ModalOptions, ModalTransactionState } from "../types";
import { delay } from "../utils/delay";
import ModalManager from "./modalManager";

export type ModalLifecycleState = "open" | "active" | "close";

export type ModalActionState =
  | "initial"
  | "pending"
  | "success"
  | "error"
  | "final";

export interface StateController {
  initial: () => void;
  pending: (message?: ReactNode) => void;
  success: (
    message?: ReactNode,
    callback?: (confirm?: ModalConfirmType) => void,
    isAwaitingConfirm?: boolean
  ) => void;
  error: (
    message?: ReactNode,
    callback?: (confirm?: ModalConfirmType) => void,
    isAwaitingConfirm?: boolean
  ) => void;
  end: (
    callback?: (confirm?: ModalConfirmType) => void,
    isAwaitingConfirm?: boolean
  ) => void;
  getLifecycleState: () => ModalLifecycleState;
  getActionState: () => ModalActionState;
}

export type ModalConfirmType = string | boolean;

export type ModalCallback = (
  confirm: ModalConfirmType | undefined,
  stateController: StateController
) => any | Promise<any>;

export const MODAL_ACTION_STATE: {
  [key in ModalActionState]: key;
} = {
  initial: "initial",
  pending: "pending",
  success: "success",
  error: "error",
  final: "final",
};

export const MODAL_LIFECYCLE_STATE: {
  [key in ModalLifecycleState]: key;
} = {
  open: "open",
  active: "active",
  close: "close",
};

export const MODAL_LIFECYCLE_STATE_LIST: string[] = Object.values(
  MODAL_LIFECYCLE_STATE
);

export interface ModalMiddlewareProps {
  transactionController: {
    transactionState: ModalTransactionState;
    standbyTransaction: () => void;
    startTransaction: () => void;
    endTransaction: () => void;
  };
  modalState: Modal;
}

export interface ModalComponentProps<T = any> {
  title?: ReactNode;
  subTitle?: ReactNode;
  content?: ReactNode;
  subContent?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customContent?: ReactNode;
  action: (confirm?: string | boolean) => void;
  actionState: ModalActionState;
  payload?: T;
}

export type ModalComponent<T = any> = React.FC<ModalComponentProps<T>>;

export interface ModalState {
  Component: ModalComponent;
  modalStyle: CSSProperties;
  backCoverStyle: CSSProperties;
  componentProps: ModalComponentProps;
}

export interface ModalProps {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent;
  options: ModalOptions<any>;
}

// TO-DO: 파일명 바꾸기
export class Modal {
  private _id: number;
  private _modalKey: string | null;
  private _name: string;
  private _component: ModalComponent;
  private _options: ModalOptions<any>;
  private lifecycleState: ModalLifecycleState = MODAL_LIFECYCLE_STATE.open;
  private _actionState: ModalActionState = MODAL_ACTION_STATE.initial;
  private _isAwaitingConfirm = false;
  private _isCloseDelay = true;
  private _closeDelayDuration = -1;
  private _confirm: ModalConfirmType | undefined = undefined;
  private _message: ReactNode = undefined;
  // eslint-disable-next-line
  private _callback: ModalCallback = () => { };
  // eslint-disable-next-line
  private endCallback: () => void = () => { };
  private listeners: ((state: ModalState) => void)[] = [];
  private breakPoint = 0;
  private isInitial = false;

  constructor(
    { id, modalKey, name, component, options }: ModalProps,
    private eventManager: ModalManager
  ) {
    this._id = id;
    this._name = name;
    this._modalKey = modalKey;
    this._component = component;
    this._options = options;

    this.bind();
    this.setOption();
  }

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

  get messate() {
    return this._message;
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

  bind() {
    this.action.bind(this);
    this.getActionState.bind(this);
    this.getLifecycleState.bind(this);
    this.initial.bind(this);
    this.pending.bind(this);
    this.success.bind(this);
    this.error.bind(this);
    this.end.bind(this);
    this.open.bind(this);
    this.active.bind(this);
    this.close.bind(this);
  }

  setOption() {
    const { closeDelay } = this.options;

    if (closeDelay) {
      this._closeDelayDuration = closeDelay;
    }
  }

  initial() {
    this._actionState = "initial";
    this.notify();

    return this;
  }

  pending(message?: ReactNode) {
    this._actionState = "pending";

    if (message) {
      this._message = message;
    }

    this.notify();

    return this;
  }

  success(
    message?: ReactNode,
    callback?: (confirm?: ModalConfirmType) => void,
    isAwaitingConfirm?: boolean
  ) {
    this._actionState = MODAL_ACTION_STATE.success;
    this._isCloseDelay = true;

    if (message) {
      this._message = message;
    }

    if (callback) {
      this.endCallback = callback;
    }

    if (isAwaitingConfirm !== undefined) {
      this._isAwaitingConfirm = isAwaitingConfirm;
    }

    this.notify();

    return this;
  }

  error(
    message?: ReactNode,
    callback?: (confirm?: ModalConfirmType) => void,
    isAwaitingConfirm?: boolean
  ) {
    this._actionState = MODAL_ACTION_STATE.error;
    this._isCloseDelay = true;

    if (message) {
      this._message = message;
    }

    if (callback) {
      this.endCallback = callback;
    }

    if (isAwaitingConfirm !== undefined) {
      this._isAwaitingConfirm = isAwaitingConfirm;
    }

    this.notify();

    return this;
  }

  end(
    callback?: (confirm?: ModalConfirmType) => void,
    isAwaitingConfirm?: boolean
  ) {
    this._actionState = MODAL_ACTION_STATE.initial;

    if (callback) {
      this.endCallback = callback;
    }

    if (isAwaitingConfirm !== undefined) {
      this._isAwaitingConfirm = isAwaitingConfirm;
    }

    this.notify();

    return this;
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

  getActionState() {
    return this._actionState;
  }

  getLifecycleState() {
    return this.lifecycleState;
  }

  getStateController(): StateController {
    return {
      initial: this.initial,
      pending: this.pending,
      success: this.success,
      error: this.error,
      end: this.end,
      getActionState: this.getActionState,
      getLifecycleState: this.getLifecycleState,
    };
  }

  getMiddlewareProps(): ModalMiddlewareProps {
    return {
      transactionController: {
        transactionState: this.eventManager.getTransactionState(),
        standbyTransaction: this.eventManager.standbyTransaction,
        startTransaction: this.eventManager.startTransaction,
        endTransaction: this.eventManager.endTransaction,
      },
      modalState: this,
    };
  }

  action(confirm?: ModalConfirmType, callback?: ModalCallback) {
    if (
      this.eventManager.getTransactionState() !== MODAL_TRANSACTION_STATE.idle
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

  getModalStyle(): CSSProperties {
    const { position, duration, transitionOptions } = this.options;

    const appliedPosition =
      typeof position === "function" ? position(this.breakPoint) : position;

    const isAciveState = this.lifecycleState === MODAL_LIFECYCLE_STATE.active;
    const modalPosition = this.eventManager.getCurrentModalPosition(
      this.lifecycleState,
      appliedPosition
    );
    const transition = this.eventManager.getModalTrainsition(
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
      this.eventManager.getCurrentModalPosition(
        this.lifecycleState,
        MODAL_POSITION.backCover
      );
    const transition = this.eventManager.getModalTrainsition(
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

  get isActive() {
    return this.lifecycleState === "active";
  }

  open() {
    this.lifecycleState = "open";
    this.eventManager.call(delay, this.options.duration ?? 0);

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

  getComponentProps(): ModalComponentProps {
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

    return {
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
    };
  }

  getState(): ModalState {
    return {
      Component: this.component,
      modalStyle: this.getModalStyle(),
      backCoverStyle: this.getBackCoverStyle(),
      componentProps: this.getComponentProps(),
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

  init() {
    if (this.isInitial) {
      return;
    }

    this.isInitial = true;
    setTimeout(() => {
      this.active();
    }, 10);
  }

  notify() {
    const modalState = this.getState();

    this.listeners.forEach((listener) => listener(modalState));

    return this;
  }

  setBreakPoint(breakPoint: number) {
    if (this.breakPoint === breakPoint) {
      return;
    }

    this.breakPoint = breakPoint;
    this.notify();
  }
}
