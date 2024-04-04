import { ModalMiddlewareProps } from "../types";

export async function defaultMiddleware({ modalState }: ModalMiddlewareProps) {
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
    return;
  }

  modalState.close();
}
