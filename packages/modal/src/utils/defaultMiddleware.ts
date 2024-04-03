import { MODAL_TRANSACTION_STATE } from "../contants";
import { ModalMiddlewareProps } from "../types";

export async function defaultMiddleware({
  transactionController: {
    getTransactionState,
    standbyTransaction,
  },
  modalState,
}: ModalMiddlewareProps) {
  if (getTransactionState() !== MODAL_TRANSACTION_STATE.idle) {
    return;
  }

  standbyTransaction();

  if (modalState.isAwaitingConfirm) {
    modalState.close();
    return;
  }

  await modalState.callback(modalState.confirm, modalState);

  if (modalState.isCloseDelay) {
    setTimeout(() => {
      modalState.close();
    }, Math.max(modalState.closeDelayDuration, 0));

    return;
  }

  if (modalState.isAwaitingConfirm) {
    standbyTransaction();

    return;
  }

  modalState.close();
}
