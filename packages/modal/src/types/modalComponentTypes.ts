import { CSSProperties, ReactNode, FC } from "react";
import { ModalActionState } from "./commonTypes";

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
  payload?: T;
}

export type ModalComponent<T = any> = FC<ModalComponentProps<T>>;

export interface ModalState {
  component: ModalComponent;
  isActive: boolean;
  modalStyle: CSSProperties;
  backCoverStyle: CSSProperties;
  componentProps: ModalComponentProps;
  isEscKeyActive: boolean;
  isEnterKeyActive: boolean;
}
