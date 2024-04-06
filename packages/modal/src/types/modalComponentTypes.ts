import { CSSProperties, ReactNode } from "react";
import { ModalActionState } from ".";

export interface ModalComponentProps<T = any> {
  title?: ReactNode;
  subTitle?: ReactNode;
  content?: ReactNode;
  subContent?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customActionContent?: ReactNode;
  action: (confirm?: string | boolean) => void;
  actionState: ModalActionState;
  payload?: T;
}

export type ModalComponent<T = any> = React.FC<ModalComponentProps<T>>;

export interface ModalState {
  component: ModalComponent;
  isActive: boolean;
  modalStyle: CSSProperties;
  backCoverStyle: CSSProperties;
  componentProps: ModalComponentProps;
  isEscKeyActive: boolean;
  isEnterKeyActive: boolean;
}
