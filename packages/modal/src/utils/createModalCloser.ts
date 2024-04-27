import { MODAL_TRANSACTION_STATE } from "../contants";
import { CloseModal, ModalClose, ModalTransactionState } from "../types";
import { delay } from "./delay";

interface CreateModalCloserProps {
  id: number;
  duration?: number;
  closeModal: CloseModal;
  getTransactionState: () => ModalTransactionState;
  startTransaction: () => void;
  endTransaction: () => void;
}

export function createModalCloser({
  id,
  duration,
  closeModal,
  getTransactionState,
  startTransaction,
  endTransaction,
}: CreateModalCloserProps): ModalClose {
  const close: ModalClose = async (callback, confirm) => {
    callback && (await callback(confirm));
    closeModal(id);
    endTransaction();

    return true;
  };

  return async (callback, confirm) => {
    if (getTransactionState() === MODAL_TRANSACTION_STATE.active) {
      return false;
    }

    startTransaction();

    duration && await delay(duration);

    return close(callback, confirm);
  };
}
