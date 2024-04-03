import { CSSProperties, ReactNode } from "react";
import { ModalActionState } from ".";

export interface ModalComponentProps<T = any> {
  title?: ReactNode;
  subTitle?: ReactNode;
  contents?: ReactNode;
  subContents?: ReactNode;
  confirmContents?: ReactNode;
  cancelContents?: ReactNode;
  customContents?: ReactNode;
  action: (confirm?: string | boolean) => void;
  actionState: ModalActionState;
  payload?: T;
}

export type ModalComponent<T = any> = React.FC<ModalComponentProps<T>>;

export interface ModalState {
  Component: ModalComponent;
  isActive: boolean;
  modalStyle: CSSProperties;
  backCoverStyle: CSSProperties;
  componentProps: ModalComponentProps;
}