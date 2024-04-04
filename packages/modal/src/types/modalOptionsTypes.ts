import {
  ModalConfirmType,
  ModalPosition,
  ModalTransitionOptions,
} from "./commonTypes";
import { ModalCallback, ModalMiddleware } from "./modalControllerTypes";

export interface ModalDispatchOptions<T = any, P extends string = string> {
  modalKey?: string;
  callback?: ModalCallback;
  middleware?: ModalMiddleware;
  backCoverConfirm?: ModalConfirmType;
  backCoverColor?: string;
  backCoverOpacity?: number;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  contents?: React.ReactNode;
  subContents?: React.ReactNode;
  confirmContents?: React.ReactNode;
  cancelContents?: React.ReactNode;
  customActionContents?: React.ReactNode;
  payload?: T;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: ModalTransitionOptions;
  position?: ModalPosition<P>;
  stateResponsiveComponent?: boolean;
  required?: boolean;
  isClose?: boolean;
}

export type ModalClose = (
  callback?: (confirm?: ModalConfirmType) => void,
  confirm?: ModalConfirmType
) => void;

export interface ModalOptions<T = any, P extends string = string>
  extends ModalDispatchOptions<T, P> {
  closeModal: ModalClose;
  middleware: ModalMiddleware;
}
