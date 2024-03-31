import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import { ModalMiddlewareProps } from "../services/modal";

export async function defaultMiddleware({
  transactionController: {
    transactionState,
    standbyTransaction,
  },
  modalState,
}: ModalMiddlewareProps) {
  if (transactionState !== MODAL_TRANSACTION_STATE.idle) {
    return;
  }

  standbyTransaction();


  if (modalState.isAwaitingConfirm) {
    modalState.close();
    return;
  }

  await modalState.callback(modalState.confirm, modalState.getStateController());

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
