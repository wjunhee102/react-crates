import { Modal } from "../services/modal";
import { ModalPositionTable, ModalTransitionOptions } from "./commonTypes";

export type ModalTransactionState = "idle" | "standby" | "active";

export interface ModalManagerState {
  modalStack: Modal[];
  breakPoint: number;
  isOpen: boolean;
  transactionState: ModalTransactionState;
}

export interface ModalListenerProps {
  modalStack: Modal[];
  transactionState: ModalTransactionState;
}

export type ModalListener = (state: ModalManagerState) => void;

export type DefaultModalName = "clear" | "unknown";

export type ModalRemovedName = DefaultModalName | string | string[];

export interface ModalManagerOptionsProps<T extends string> {
  position?: ModalPositionTable<T>;
  transition?: ModalTransitionOptions;
  duration?: number;
  backCoverColor?: string;
  backCoverOpacity?: number;
  stateResponsiveComponent?: boolean;
}

export type ModalAsyncCall<T = any, P = any> = (
  asyncCallback: (props: P) => T,
  asyncCallbackProps: P
) => Promise<T>;

export type CloseModalProps =
  | ModalRemovedName
  | number
  | [number, ModalRemovedName];

export type CloseModal = (closeModalProps: CloseModalProps) => void;