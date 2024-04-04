import { ModalMiddlewareProps } from "../types";
import { delay } from "./delay";

export async function defaultMiddleware({ modalState }: ModalMiddlewareProps) {
  if (modalState.isAwaitingConfirm) {
    return modalState.close();
  }

  await modalState.callback(modalState.confirm, modalState);

  if (modalState.isCloseDelay) {
    await delay(modalState.closeDelayDuration);

    return modalState.close();
  }

  if (modalState.isAwaitingConfirm) {
    return false;
  }

  return modalState.close();
}
