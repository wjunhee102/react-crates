import {
  MODAL_LIFECYCLE_STATE,
  MODAL_POSITION,
} from "../contants";
import { ModalLifecycleState } from "../types";

const POSITION_STATE_VALUE = {
  [MODAL_LIFECYCLE_STATE.open]: 0,
  [MODAL_LIFECYCLE_STATE.active]: 1,
  [MODAL_LIFECYCLE_STATE.close]: 2,
};

function covertPositionList(position: string) {
  const positionList = position.split("-");

  if (positionList.length < 1) {
    return Array.from({ length: 3 }).map(_ => MODAL_POSITION.center);
  }

  const lastIndex = positionList.length - 1;

  return Array.from({ length: 3 }).map((_, index) => {
    return positionList[index] || positionList[lastIndex];
  });
}

export function getPositionKey(
  position: string,
  positionState: ModalLifecycleState
): string {
  if (typeof position !== "string") {
    return MODAL_POSITION.center;
  }

  const positionList = covertPositionList(position);
  const positionStateValue = POSITION_STATE_VALUE[positionState];

  return positionList[positionStateValue];
}
