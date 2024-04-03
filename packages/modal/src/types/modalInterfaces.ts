import { ModalLifecycleState, ModalPositionTable, ModalTransition, ModalTransitionOptions, PositionStyle } from "./commonTypes";
import { ModalComponent } from "./modalComponentTypes";
import { ModalTransctionController } from "./modalControllerTypes";
import { CloseModalProps } from "./modalManagerTypes";
import { EditModalOptionsProps, ModalDispatchOptions } from "./modalOptionsTypes";
import { ModalComponentSeed, ModalComponentSeedTable } from "./modalSeedTypes";

export interface ModalManagerInterface extends ModalTransctionController {
  getCurrentModalPosition: (positionState: ModalLifecycleState, position?: string) => PositionStyle;
  getModalTransition: (duration?: number, options?: ModalTransitionOptions) => ModalTransition;
  getModalComponentSeed: (name: string) => ModalComponentSeed | undefined;
  executeAsync: <F = any, P = any>(asyncCallback: (props: P) => Promise<F>, asyncCallbackProps: P) => Promise<F>;
}

export type Controller<T extends ModalComponentSeedTable, P extends ModalPositionTable> = {
  [K in keyof T]: (options: T[K]['defaultOptions'] extends { payload: infer R }
    ? ModalDispatchOptions<R, Extract<keyof P, string>>
    : ModalDispatchOptions<any, Extract<keyof P, string>>
  ) => number;
}

export type ModalController<T extends ModalComponentSeedTable, P extends ModalPositionTable> = {
  open: <K = any>(name: string | ModalComponent, options?: ModalDispatchOptions<K, Extract<keyof P, string>>) => number;
  remove: (removedName?: CloseModalProps) => number;
  edit: <K = any>(id: number, props: EditModalOptionsProps<K, Extract<keyof P, string>>) => number;
  close: (id: number) => number;
} & Controller<T, P>