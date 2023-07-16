import { ReactNode } from "react";

export type DefaultModalName = "clear" | "unknown";

export type DefaultModalPosition =
  | "default"
  | "backCover"
  | "bottom"
  | "top"
  | "left"
  | "right"
  | "center"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

export type ModalTransactionState = "idle" | "standby" | "active";

export type ModalConfirmType = boolean | string | null;

export type ModalLifecycleState = "open" | "active" | "close";

export type ModalActionState = "initial" | "pending" | "success" | "error" | "final";

export type ModalContentsType = ReactNode | null;