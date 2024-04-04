import { MODAL_TRANSACTION_STATE } from "../contants";
import { CloseModal, ModalClose, ModalTransactionState } from "../types";

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
  };

  if (duration === undefined) {
    return async (callback, confirm) => {
      console.log(getTransactionState());
      if (getTransactionState() === MODAL_TRANSACTION_STATE.active) {
        return;
      }

      startTransaction();

      close(callback, confirm);
    };
  }

  return async (callback, confirm) => {
    console.log(getTransactionState());
    if (getTransactionState() === MODAL_TRANSACTION_STATE.active) {
      return;
    }

    startTransaction();

    setTimeout(() => {
      close(callback, confirm);
    }, Math.max(duration, 0));
  };
}
