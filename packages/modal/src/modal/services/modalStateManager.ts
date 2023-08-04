import { ReactNode } from "react";

export type ModalLifecycleState = "initial" | "active" | "final";

export type ModalActionState = "initial" | "pending" | "success" | "error";

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
  final: () => void;
  stateManager: ModalStateManager;
}

export type ModalConfirmType = boolean | string | null;

export type ModalCallback = (
  confirm: ModalConfirmType | undefined,
  stateController: StateController
) => any | Promise<any>;

export interface ModalState {
  confirm: ModalConfirmType | undefined;
  lifecycleState: ModalLifecycleState;
  actionState: ModalActionState;
  isAwaitingConfirm: boolean;
  message: ReactNode;
  closeDelayDuration: number;
  isCloseDelay: boolean;
  callback: ModalCallback;
  endCallback: (confirm?: ModalConfirmType) => any;
}

export type ModalStartActionState = Pick<ModalState, "confirm" | "callback">;

export type ModalEndActionState = Pick<
  ModalState,
  "actionState" | "isAwaitingConfirm" | "isCloseDelay" | "closeDelayDuration"
>;

export type ModalStateProps = {
  [P in keyof ModalState]?: ModalState[P];
};

export const MODAL_ACTION_STATE: {
  [key in ModalActionState]: key;
} = {
  initial: "initial",
  pending: "pending",
  success: "success",
  error: "error",
};

export const MODAL_LIFECYCLE_STATE: {
  [key in ModalLifecycleState]: key;
} = {
  initial: "initial",
  active: "active",
  final: "final",
};

export const MODAL_LIFECYCLE_STATE_LIST: string[] = Object.values(
  MODAL_LIFECYCLE_STATE
);

export class ModalStateManager {
  private _id = 0;
  private _lifecycleState: ModalLifecycleState = MODAL_LIFECYCLE_STATE.initial;
  private _actionState: ModalActionState = MODAL_ACTION_STATE.initial;
  private _isAwaitingConfirm = false;
  private _isCloseDelay = false;
  private _closeDelayDuration = -1;
  private _confirm: ModalConfirmType | undefined = undefined;
  private _message: ReactNode = undefined;
  private _callback: (
    confirm: ModalConfirmType | undefined,
    stateController: StateController
    // eslint-disable-next-line
  ) => void = () => { };
  // eslint-disable-next-line
  private _endCallback: (() => void) = () => { };

  private listeners: ((modalState: ModalState) => void)[] = [];

  constructor(initialState: ModalStateProps = {}) {
    this.setState(initialState);

    this.initial = this.initial.bind(this);
    this.pending = this.pending.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.end = this.end.bind(this);
    this.final = this.final.bind(this);
  }

  get id() {
    return this._id;
  }

  get lifecycleState() {
    return this._lifecycleState;
  }

  set lifecycleState(value: ModalLifecycleState) {
    this._lifecycleState = value;

    this.notify();
  }

  get actionState() {
    return this._actionState;
  }

  set actionState(value: ModalActionState) {
    this._actionState = value;

    this.notify();
  }

  get message() {
    return this._message;
  }

  set message(value: ReactNode) {
    this._message = value;

    this.notify();
  }

  get confirm(): ModalConfirmType | undefined {
    return this._confirm;
  }

  get callback(): ModalCallback | undefined {
    return this._callback;
  }

  get endCallback() {
    return this._endCallback;
  }

  set endCallback(value: (confirm?: ModalConfirmType) => any) {
    this._endCallback = value;
  }

  get isAwaitingConfirm() {
    return this._isAwaitingConfirm;
  }

  set isAwaitingConfirm(value: boolean) {
    this._isAwaitingConfirm = value;
  }

  get isCloseDelay() {
    return this._isCloseDelay;
  }

  set isCloseDelay(value: boolean) {
    this._isCloseDelay = value;
  }

  getState(): ModalState {
    return {
      confirm: this._confirm,
      lifecycleState: this._lifecycleState,
      actionState: this._actionState,
      isAwaitingConfirm: this._isAwaitingConfirm,
      message: this._message,
      closeDelayDuration: this._closeDelayDuration,
      isCloseDelay: this._isCloseDelay,
      endCallback: this._endCallback,
      callback: this._callback,
    };
  }

  getStartActionState(): ModalStartActionState {
    return {
      confirm: this._confirm,
      callback: this._callback,
    };
  }

  getEndActionState(): ModalEndActionState {
    return {
      actionState: this._actionState,
      isAwaitingConfirm: this._isAwaitingConfirm,
      isCloseDelay: this._isCloseDelay,
      closeDelayDuration: this._closeDelayDuration,
    };
  }

  getController(): StateController {
    return {
      initial: this.initial,
      pending: this.pending,
      success: this.success,
      error: this.error,
      end: this.end,
      final: this.final,
      stateManager: this,
    };
  }

  setState(modalStateProps: ModalStateProps) {
    const {
      lifecycleState,
      actionState,
      isAwaitingConfirm,
      message,
      closeDelayDuration,
      callback,
      endCallback,
    } = modalStateProps;

    if (lifecycleState) {
      this._lifecycleState = lifecycleState;
    }

    if (actionState) {
      this._actionState = actionState;
    }

    if (isAwaitingConfirm !== undefined) {
      this._isAwaitingConfirm = isAwaitingConfirm;
    }

    if (message !== undefined) {
      this.message = message;
    }

    if (closeDelayDuration !== undefined) {
      this._closeDelayDuration = closeDelayDuration;
    }

    if (callback !== undefined) {
      this._callback = callback;
    }

    if (endCallback !== undefined) {
      this.endCallback = endCallback;
    }

    this.notify();

    return this;
  }

  setConfirm(confirm?: ModalConfirmType) {
    this._confirm = confirm;

    return this;
  }

  setCallback(callback?: ModalCallback) {
    if (callback) {
      this._callback = callback;
    }

    return this;
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
      this._endCallback = callback;
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
      this._endCallback = callback;
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
      this._endCallback = callback;
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

  final() {
    this._lifecycleState = MODAL_LIFECYCLE_STATE.final;

    this.notify();

    return this;
  }

  subscribe(listener: (modalState: ModalState) => void) {
    this.listeners.push(listener);

    return this;
  }

  unSubscribe(listener: (modalState: ModalState) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);

    return this;
  }

  notify() {
    const modalState = this.getState();

    this.listeners.forEach((listener) => listener(modalState));

    return this;
  }
}
