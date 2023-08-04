import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import { CloseModal, ModalClose, ModalTransactionState } from "../types";

function setDuration(rawDuration: number) {
  const duration = rawDuration;

  return duration < 0 ? 0 : duration;
}

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
  duration: rawDuration,
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

  if (rawDuration === undefined) {
    return async (callback, confirm) => {
      const transactionState = getTransactionState();

      if (transactionState === MODAL_TRANSACTION_STATE.active) {
        return;
      }

      startTransaction();

      close(callback, confirm);
    };
  }

  const duration = setDuration(rawDuration);

  return async (callback, confirm) => {
    const transactionState = getTransactionState();

    if (transactionState === MODAL_TRANSACTION_STATE.active) {
      return;
    }

    startTransaction();

    if (setTimeout === undefined) {
      close(callback, confirm);
      return;
    }

    setTimeout(() => {
      close(callback, confirm);
    }, duration);
  };
}
