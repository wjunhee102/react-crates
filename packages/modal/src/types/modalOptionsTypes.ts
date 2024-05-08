import {
  ModalConfirmType,
  ModalPosition,
  ModalTransitionOptions,
} from "./commonTypes";
import { ModalCallback, ModalMiddleware } from "./modalControllerTypes";
import { ComponentPropsOptions, ModalComponent } from "./modalComponentTypes";

/**
 * modalKey는 중복 방지
 */
export interface ModalDispatchOptions<T = any, P extends string = string> extends ComponentPropsOptions {
  modalKey?: string;
  action?: ModalCallback;
  middleware?: ModalMiddleware;
  backCoverConfirm?: ModalConfirmType | null;
  backCoverColor?: string;
  backCoverOpacity?: number;
  escKeyActive?: boolean;
  payload?: T;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: ModalTransitionOptions;
  position?: ModalPosition<P>;
  stateResponsiveComponent?: boolean;
  required?: boolean;
  role?: string;
  label?: string;
}

export type ModalClose = (
  callback?: (confirm?: ModalConfirmType) => void,
  confirm?: ModalConfirmType
) => Promise<boolean>;

export interface ModalOptions<T = any, P extends string = string>
  extends ModalDispatchOptions<T, P> {
  closeModal: ModalClose;
  middleware: ModalMiddleware;
}

export interface ModalEditOptions<T extends string = string> extends ComponentPropsOptions {
  component?: ModalComponent;
  action?: ModalCallback;
  backCoverConfirm?: ModalConfirmType | null;
  backCoverColor?: string;
  backCoverOpacity?: number;
  escKeyActive?: boolean;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: ModalTransitionOptions;
  position?: ModalPosition<T>;
  stateResponsiveComponent?: boolean;
  payload?: any;
}