import {
  ModalConfirmType,
  ModalPosition,
  ModalTransitionOptions,
} from "./commonTypes";
import { ModalCallback, ModalMiddleware } from "./modalControllerTypes";

/**
 * modalKey는 중복 방지
 */
export interface ModalDispatchOptions<T = any, P extends string = string> {
  modalKey?: string;
  callback?: ModalCallback;
  middleware?: ModalMiddleware;
  backCoverConfirm?: ModalConfirmType;
  backCoverColor?: string;
  backCoverOpacity?: number;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  subContent?: React.ReactNode;
  confirmContent?: React.ReactNode;
  cancelContent?: React.ReactNode;
  customActionContent?: React.ReactNode;
  payload?: T;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: ModalTransitionOptions;
  position?: ModalPosition<P>;
  stateResponsiveComponent?: boolean;
  required?: boolean;
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
