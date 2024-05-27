import { Modal } from "../services/modal";
import {
  ModalActionState,
  ModalConfirmType,
  ModalLifecycleState,
} from "./common";
import { ComponentPropsOptions, ModalComponent } from "./modalComponentTypes";

export interface StateControllerOptions {
  afterCloseCallback?: (confirm?: ModalConfirmType) => void;
  isAwaitingConfirm?: boolean;
  component?: string | ModalComponent;
  options?: ComponentPropsOptions;
}

export interface StateController {
  initial: () => void;
  pending: (
    message?:
      | string
      | Omit<StateControllerOptions, "afterCloseCallback" | "isAwaitingConfirm">
  ) => void;
  success: (
    message?:
      | string
      | StateControllerOptions
      | ((confirm?: ModalConfirmType) => unknown)
  ) => void;
  error: (
    message?:
      | string
      | StateControllerOptions
      | ((confirm?: ModalConfirmType) => unknown)
  ) => void;
  end: (
    message?:
      | string
      | StateControllerOptions
      | ((confirm?: ModalConfirmType) => unknown)
  ) => void;
  getLifecycleState: () => ModalLifecycleState;
  getActionState: () => ModalActionState;
}
export interface ModalMiddlewareProps {
  modalState: Modal;
}

export type ModalMiddleware = (props: ModalMiddlewareProps) => Promise<boolean>;

export type ModalCallback = (
  confirm: ModalConfirmType | undefined,
  stateController: StateController
) => any | Promise<any>;
