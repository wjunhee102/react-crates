import { ReactElement } from "react";
import {
  ModalLifecycleState,
  ModalPositionTable,
  ModalTransition,
  ModalTransitionOptions,
  PositionStyle,
} from "./commonTypes";
import { ModalComponent } from "./modalComponentTypes";
import {
  ModalCallback,
  ModalTransctionController,
} from "./modalControllerTypes";
import { CloseModalProps } from "./modalManagerTypes";
import { ModalDispatchOptions } from "./modalOptionsTypes";
import { ModalComponentSeed, ModalComponentSeedTable } from "./modalSeedTypes";

export interface ModalManagerInterface extends ModalTransctionController {
  getCurrentModalPosition: (
    positionState: ModalLifecycleState,
    position?: string
  ) => PositionStyle;
  getModalTransition: (
    duration?: number,
    options?: ModalTransitionOptions
  ) => ModalTransition;
  getModalComponentSeed: (name: string) => ModalComponentSeed | undefined;
  executeAsync: <F = any, P = any>(
    asyncCallback: (props: P) => Promise<F>,
    asyncCallbackProps: P
  ) => Promise<F>;
}

export type Controller<
  T extends ModalComponentSeedTable,
  P extends ModalPositionTable
> = {
    [K in keyof T]: (
      options?:
        | (T[K]["defaultOptions"] extends { payload: infer R }
          ? Omit<
            ModalDispatchOptions<
              R,
              Exclude<Extract<keyof P, string>, "backCover" | "default">
            >,
            "required"
          >
          : Omit<
            ModalDispatchOptions<
              any,
              Exclude<Extract<keyof P, string>, "backCover" | "default">
            >,
            "required"
          >)
        | ModalCallback
        | string
    ) => number;
  };

export type ModalController<
  T extends ModalComponentSeedTable,
  P extends ModalPositionTable
> = {
  open: <K = any>(
    name: string | ModalComponent | ReactElement,
    options?:
      | Omit<
        ModalDispatchOptions<
          K,
          Exclude<Extract<keyof P, string>, "backCover" | "default">
        >,
        "required"
      >
      | ModalCallback
      | string
  ) => number;
  close: (closeTarget?: CloseModalProps) => number;
  action: (targetModalId: number, confirm?: boolean | string) => void;
} & Controller<T, P>;
