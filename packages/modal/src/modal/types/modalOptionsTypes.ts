import { ModalConfirmType, ModalPosition, ModalTransitionOptions } from "./commonTypes";
import { ModalCallback, ModalMiddleware } from "./modalControllerTypes";

export interface ModalDispatchOptions<T = any> {
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
  customContent?: React.ReactNode;
  payload?: T;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: ModalTransitionOptions;
  position?: ModalPosition;
  stateResponsiveComponent?: boolean;
  required?: boolean;
}

export interface EditModalOptionsProps<T = any>
  extends ModalDispatchOptions<T> {
  isClose?: boolean;
}

export type ModalClose = (
  callback?: (confirm?: ModalConfirmType) => void,
  confirm?: ModalConfirmType
) => void;

export interface ModalOptions<T = any> extends EditModalOptionsProps<T> {
  closeModal: ModalClose;
  middleware: ModalMiddleware;
  // stateManager: ModalStateManager;
}