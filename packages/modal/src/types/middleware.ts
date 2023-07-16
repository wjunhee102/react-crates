import Modal from "../services/Modal";
import { ModalActionState, ModalConfirmType, ModalTransactionState } from "./common";
import { ModalCallback } from "./controller";

export interface ModalState {
  confirm: ModalConfirmType;
  callback: ModalCallback;
  isAwaitingConfirm: boolean;
  isCloseDelay: boolean;
  closeDelay: number;
  actionState: ModalActionState;
  open: () => void;
  active: () => void;
  close: () => void;
  controller: Modal;
}

export interface ModalMiddlewareProps {
  transactionState: ModalTransactionState;
  standbyTransaction: () => void;
  startTransaction: () => void;
  endTransaction: () => void;
  modalState: ModalState;
}

export type ModalMiddleware = (
  props: ModalMiddlewareProps
) => void | Promise<void>;