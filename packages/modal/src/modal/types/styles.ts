import { ModalLifecycleState } from "../services/modalStateManager";

export interface ModalTransition {
  transitionProperty: string;
  transitionDuration: string;
  transitionTimingFunction: string;
  transitionDelay: string;
}

export type ModalTransitionProps = {
  [key in keyof ModalTransition]?: ModalTransition[key];
};

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

export interface PositionStyle {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
  opacity?: number;
  background?: string;
}

export type DefaultModalName = "clear" | "unknown";

export type ModalRemovedName = DefaultModalName | string | string[];


export type ModalPositionStyle = {
  [key in ModalLifecycleState]: PositionStyle;
};

export type ModalPositionTable<T extends string = string> = {
  [key in DefaultModalPosition | T]: ModalPositionStyle;
};

export type ModalPositionMap<T extends string = string> = Map<
  T | DefaultModalPosition,
  ModalPositionStyle
>;

export type ModalTransitionOptions = Omit<
  ModalTransitionProps,
  "transitionDuration"
>;