import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import { ModalMiddlewareProps } from "../types";

export async function defaultMiddleware({
  transactionState,
  standbyTransaction,
  stateController,
}: ModalMiddlewareProps) {
  if (transactionState !== MODAL_TRANSACTION_STATE.idle) {
    return;
  }

  standbyTransaction();

  const { final, stateManager } = stateController;

  const { confirm, callback } = stateManager.getStartActionState();

  if (stateManager.isAwaitingConfirm) {
    final();
    return;
  }

  await callback(confirm, stateController);

  const { isAwaitingConfirm, isCloseDelay, closeDelayDuration } =
    stateManager.getEndActionState();

  if (isCloseDelay && closeDelayDuration > 0 && setTimeout) {
    setTimeout(() => {
      final();
    }, closeDelayDuration);

    return;
  }

  if (isAwaitingConfirm) {
    standbyTransaction();
    
    return;
  }

  final();
}
