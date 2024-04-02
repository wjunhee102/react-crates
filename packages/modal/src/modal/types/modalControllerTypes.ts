import { Modal } from "../services/modal";
import { ModalActionState, ModalConfirmType, ModalLifecycleState } from "./commonTypes";
import { ModalComponent } from "./modalComponentTypes";
import { ModalTransactionState } from "./modalManagerTypes";

export interface ComponentPropsOptions {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  subContent?: React.ReactNode;
  confirmContent?: React.ReactNode;
  cancelContent?: React.ReactNode;
  customContent?: React.ReactNode;
}

export interface StateControllerOptions {
  endCallback?: (confirm?: ModalConfirmType) => void;
  isAwaitingConfirm?: boolean;
  component?: string | ModalComponent;
  options?: ComponentPropsOptions;
}

export interface StateController {
  initial: () => void;
  pending: (message?: string | Omit<StateControllerOptions, "endCallback" | "isAwaitingConfirm">) => void;
  success: (message?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => unknown)) => void;
  error: (message?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => unknown)) => void;
  end: (message?: string | StateControllerOptions | ((confirm?: ModalConfirmType) => unknown)) => void;
  getLifecycleState: () => ModalLifecycleState;
  getActionState: () => ModalActionState;
}

export interface ModalTransctionController {
  getTransactionState: () => ModalTransactionState;
  standbyTransaction: () => void;
  startTransaction: () => void;
  endTransaction: () => void;
}

export interface ModalMiddlewareProps {
  transactionController: ModalTransctionController;
  modalState: Modal;
}

export type ModalMiddleware = (
  props: ModalMiddlewareProps
) => void | Promise<void>;

export type ModalCallback = (
  confirm: ModalConfirmType | undefined,
  stateController: StateController
) => any | Promise<any>;