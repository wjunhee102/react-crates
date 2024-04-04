import { MODAL_TRANSACTION_STATE } from "../contants";
import { CloseModal, ModalClose, ModalTransactionState } from "../types";
import { delay } from "./delay";

interface GetCloseModalProps {
  id: number;
  duration?: number;
  closeModal: CloseModal;
  getTransactionState: () => ModalTransactionState;
  startTransaction: () => void;
  endTransaction: () => void;
}

export function getCloseModal({
  id,
  duration,
  closeModal,
  getTransactionState,
  startTransaction,
  endTransaction,
}: GetCloseModalProps): ModalClose {
  const close: ModalClose = async (callback, confirm) => {
    callback && (await callback(confirm));
    closeModal(id);
    endTransaction();

    return true;
  };

  if (duration === undefined) {
    return async (callback, confirm) => {
      if (getTransactionState() === MODAL_TRANSACTION_STATE.active) {
        return false;
      }

      startTransaction();

      return close(callback, confirm);
    };
  }

  return async (callback, confirm) => {
    if (getTransactionState() === MODAL_TRANSACTION_STATE.active) {
      return false;
    }

    startTransaction();

    await delay(duration);

    return close(callback, confirm);
  };
}
