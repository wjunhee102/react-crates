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
} from "./modalControllerTypes";
import { CloseModalProps, ModalTransactionState } from "./modalManagerTypes";
import { ModalDispatchOptions } from "./modalOptionsTypes";
import { ModalComponentSeed, ModalComponentSeedTable } from "./modalSeedTypes";

export interface ModalManagerInterface {
  getTransactionState: () => ModalTransactionState;
  getCurrentModalPosition: (
    positionState: ModalLifecycleState,
    position?: string
  ) => [PositionStyle, string];
  getModalTransition: (
    duration?: number,
    options?: ModalTransitionOptions
  ) => ModalTransition;
  getModalComponentSeed: (name: string) => ModalComponentSeed | undefined;
  executeAsync: <F = any, P = any>(
    asyncCallback: (props: P) => Promise<F>,
    asyncCallbackProps: P
  ) => Promise<F>;
  executeWithTransaction: <T = any>(asyncCallback: (props: T) => Promise<boolean>,
    asyncCallbackProps: T) => Promise<boolean>
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
  remove: (closeTarget?: CloseModalProps) => number;
  action: (targetModalId: number, confirm?: boolean | string) => Promise<boolean>;
} & Controller<T, P>;
