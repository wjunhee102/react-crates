import {
  DEFAULT_POSITION,
  MODAL_LIFECYCLE_STATE,
  MODAL_LIFECYCLE_STATE_LIST,
} from "../contants";
import { ModalLifecycleState } from "../types";

const POSITION_STATE_VALUE = {
  [MODAL_LIFECYCLE_STATE.open]: 0,
  [MODAL_LIFECYCLE_STATE.active]: 1,
  [MODAL_LIFECYCLE_STATE.close]: 2,
};

export function getPositionKeyByState(
  positionList: string[]
): string | [ModalLifecycleState, string] {
  if (
    positionList.length < 1 ||
    !MODAL_LIFECYCLE_STATE_LIST.includes(positionList[0])
  ) {
    return positionList[0] ?? DEFAULT_POSITION.center;
  }

  return positionList as [ModalLifecycleState, string];
}

export function getPositionKey(
  position: string,
  positionState: ModalLifecycleState
): string | [ModalLifecycleState, string] {
  const positionList = position.split("-");

  if (positionList.length < 3) {
    return getPositionKeyByState(positionList);
  }

  const positionStateValue = POSITION_STATE_VALUE[positionState];

  return positionList[positionStateValue];
}
