import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import { ModalMiddlewareProps } from "../services/ModalFiber";

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

  if (modalState.isCloseDelay && modalState.closeDelayDuration > 0 && setTimeout) {
    setTimeout(() => {
      modalState.close();
    }, modalState.closeDelayDuration);

    return;
  }

  if (modalState.isAwaitingConfirm) {
    standbyTransaction();

    return;
  }

  modalState.close();
}
