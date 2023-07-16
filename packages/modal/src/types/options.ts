import { DefaultModalPosition, ModalConfirmType, ModalContentsType } from "./common";
import { ModalCallback } from "./controller";
import { ModalMiddleware } from "./middleware";

export type ModalBackCoverOptions = {
  backCoverConfirm: ModalConfirmType;
  backCoverColor: string;
  backCoverOpacity: number;
};

export type ModalContentsOptions = {
  title: ModalContentsType;
  contents: ModalContentsType;
  confirmContents: ModalContentsType;
  cancelContents: ModalContentsType;
  subContents: ModalContentsType;
};

export type ModalTransitionOptions = {
  transitionProperty: string;
  transitionDuration: number;
  transitionTimingFunction: string;
  transitionDelay: number;
}

export type ModalOptions<T = any> = ModalBackCoverOptions &
  ModalContentsOptions &
  ModalTransitionOptions &
{
  callback: ModalCallback; // 모달에서 사용자가 action을 했을 때 실행되는 함수
  middleware: ModalMiddleware; // 모달 callback을 실행하기 전 실행 후 모달의 상태에 따라 어떻게 동작할지 결정하는 로직 함수
  autoClose: number | (() => void); // 자동의 close 될 duration 또는 함수
  payload: T; // 모달에 전달하고 싶은 값이 있을 때 사용
  closeDelay: number; // 모달이 닫히는 것을 딜레이 하고 싶을때
  position:
  | ((breakPoint: number) => DefaultModalPosition | string)
  | DefaultModalPosition
  | string; // 모달이 닫힐때 어떤 position으로 사리질지 애니메이션 관련 함수
  required: boolean; // modal option을 새로 덮혀 씌울 수 없게 만드는 함수
}

export type ModalDefaultOptions<T = any> = {
  [Key in keyof ModalOptions<T>]?: ModalOptions<T>[Key];
}

export type ModalDispatchOptions<T = any> = Omit<ModalDefaultOptions<T>, "required">;