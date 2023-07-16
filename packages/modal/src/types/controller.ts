import { DefaultModalPosition, ModalActionState, ModalConfirmType, ModalContentsType } from "./common";

export type ModalControllerOptions = {
  title?: ModalContentsType;
  contents?: ModalContentsType;
  confirmContents?: ModalContentsType;
  cancelContents?: ModalContentsType;
  subContents?: ModalContentsType;
  closeDelay?: number;
  position?:
  | ((breakPoint: number) => DefaultModalPosition | string)
  | DefaultModalPosition
  | string;
  transitionProperty?: string;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  transitionDelay?: number;
  backCoverConfirm?: ModalConfirmType;
  backCoverColor?: string;
  backCoverOpacity?: number;
  callback?: ModalCallback;
}



export type ModalControllerProps = {
  message?: ModalContentsType;
  isAwaitingConfirm?: boolean;
  isCloseDelay?: boolean;
  options?: ModalControllerOptions;
  endCallback?: () => void;
}

/**
 * modal component를 변경하고,
 * modal component를 변경할때 추가할 선택된 defatult options들 선택해서 넣을 수 있게 할것.
 * modal message로 받을 수 있게.
 * end callback 
 */

export type ModalActionController = (modalActionState: ModalActionState, props: ModalControllerProps) => void;

export type ModalActionControllerSetState = (props: string | ModalControllerProps) => void;

export type ModalController = {
  initial: ModalActionControllerSetState;
  pending: ModalActionControllerSetState;
  success: ModalActionControllerSetState;
  error: ModalActionControllerSetState;
  final: ModalActionControllerSetState;
  setModal: ModalActionController;
  changeModalMeta: (
    componentKey: string,
    isChangeComponent: boolean,
    changeOptions?: ModalControllerOptions
  ) => void;
  state: ModalActionState;
}

export type ModalCallback = (confirm: ModalConfirmType | undefined, controller: ModalController) => any | Promise<any>;