import { ReactNode } from "react";
import { ModalActionState, ModalConfirmType, ModalContentsType } from "./common";
import { ModalContentsOptions, ModalOptions } from "./options";

export type ModalComponentProps<T = any> = {
  id: number;
  state: ModalActionState;
  message: ModalContentsType;
  confirm: ModalContentsType;
  action: (confirm: ModalConfirmType) => void;
} & ModalContentsOptions & Pick<ModalOptions<T>, "payload">

export type ModalComponent = ReactNode | ((props: ModalComponentProps) => ReactNode);