import { CSSProperties, ReactNode, FC } from "react";
import { ModalActionState, ModalLifecycleState } from "./commonTypes";

export interface ComponentPropsOptions {
  title?: ReactNode;
  subTitle?: ReactNode;
  content?: ReactNode;
  subContent?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customActionContent?: ReactNode;
}

export interface ModalComponentProps<T = any> extends ComponentPropsOptions {
  action: (confirm?: string | boolean) => void;
  actionState: ModalActionState;
  currentPosition: string;
  lifecycleState: ModalLifecycleState
  payload?: T;
}

export type ModalComponent<T = any> = FC<ModalComponentProps<T>>;

export interface ModalState {
  component: ModalComponent;
  isOpened: boolean;
  isActive: boolean;
  actionState: ModalActionState;
  modalClassName?: string;
  modalStyle: CSSProperties;
  backCoverStyle: CSSProperties;
  componentProps: ModalComponentProps;
  isEscKeyActive: boolean;
  label: string;
  role: string;
}
