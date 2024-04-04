export type ModalLifecycleState = "open" | "active" | "close";

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

type CombinedPosition<T extends string> = T | `${T}-${T}` | `${T}-${T}-${T}`;

export type ModalPosition<T extends string = DefaultModalPosition> =
  | ((breakPoint: number) => CombinedPosition<DefaultModalPosition | T>)
  | CombinedPosition<DefaultModalPosition | T>;

export type ModalTransitionOptions = Omit<
  ModalTransitionProps,
  "transitionDuration"
>;

export type ModalConfirmType = string | boolean;

export type ModalActionState =
  | "initial"
  | "pending"
  | "success"
  | "error"
  | "final";
