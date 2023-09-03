import { CSSProperties, ReactNode } from "react";
import { ModalComponent, ModalOptions, ModalTransactionState } from "../types";
import ModalManager from "./modalManager";
import { MODAL_POSITION, MODAL_TRANSACTION_STATE } from "../contants/constants";
import { delay } from "../utils/delay";

export type ModalLifecycleState = "open" | "active" | "close";

export type ModalActionState = "initial" | "pending" | "success" | "error" | "final";

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

export type ModalConfirmType = boolean | string | null;

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

interface ModalComponentProps {
  title?: ReactNode;
  content?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customContent?: ReactNode;
  action: (confirm?: string | boolean) => void;
  actionState: ModalActionState;
}

export interface ModalState {
  Component: ModalComponent<any>;
  modalStyle: CSSProperties;
  backCoverStyle: CSSProperties;
  componentProps: ModalComponentProps;
}

interface ModalProps {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent<any>;
  options: ModalOptions<any>;
}

export class Modal {
  private _id: number;
  private _modalKey: string | null;
  private _name: string;
  private _component: ModalComponent<any>;
  private _options: ModalOptions<any>;
  private lifecycleState: ModalLifecycleState = MODAL_LIFECYCLE_STATE.open;
  private _actionState: ModalActionState = MODAL_ACTION_STATE.initial;
  private _isAwaitingConfirm = false;
  private _isCloseDelay = true;
  private _closeDelayDuration = -1;
  private _confirm: ModalConfirmType | undefined = undefined;
  private _message: ReactNode = undefined;
  private _callback: ModalCallback = () => { };
  private endCallback: (() => void) = () => { };
  private listeners: ((state: ModalState) => void)[] = [];
  private breakPoint: number = 0;

  constructor({ id, modalKey, name, component, options }: ModalProps, private eventManager: ModalManager) {
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
    const {
      closeDelay,
    } = this.options;

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
    }
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
    }
  }

  action(confirm?: ModalConfirmType, callback?: ModalCallback) {
    if (this.eventManager.getTransactionState() !== MODAL_TRANSACTION_STATE.idle) {
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
    const {
      position,
      duration,
      transitionOptions,
    } = this.options;

    const appliedPosition = typeof position === "function" ? position(this.breakPoint) : position;

    const isAciveState = this.lifecycleState === MODAL_LIFECYCLE_STATE.active;
    const modalPosition = this.eventManager.getCurrentModalPosition(this.lifecycleState, appliedPosition);
    const transition = this.eventManager.getModalTrainsition(duration, transitionOptions);

    return {
      pointerEvents: isAciveState ? "auto" : "none",
      ...transition,
      ...modalPosition
    }
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
    const {
      background,
      opacity,
      ...backCoverPosition
    } = this.eventManager.getCurrentModalPosition(
      this.lifecycleState,
      MODAL_POSITION.backCover
    );
    const transition = this.eventManager.getModalTrainsition(duration, transitionOptions);

    return {
      cursor:
        isAciveState && backCoverConfirm !== null
          ? "pointer"
          : "default",
      ...transition,
      ...backCoverPosition,
      background:
        (isAciveState && backCoverColor) || background,
      opacity:
        (isAciveState && backCoverOpacity) || opacity
    }
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
    this.options.closeModal(this.endCallback, this._confirm);

    this.notify();
  }

  getComponentProps(): ModalComponentProps {
    const {
      title,
      content,
      confirmContent,
      cancelContent,
      subBtnContent
    } = this.options;


    return {
      title,
      content,
      confirmContent,
      cancelContent,
      customContent: subBtnContent,
      action: this.action,
      actionState: this.actionState,
    }
  }

  getState(): ModalState {
    return {
      Component: this.component,
      modalStyle: this.getModalStyle(),
      backCoverStyle: this.getBackCoverStyle(),
      componentProps: this.getComponentProps(),
    }
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

  setBreakPoint(breakPoint: number) {
    this.breakPoint = breakPoint;
    this.notify();
  }

}