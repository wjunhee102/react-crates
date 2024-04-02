import { ModalLifecycleState, ModalTransition, ModalTransitionOptions, PositionStyle } from "./commonTypes";
import { ModalTransctionController } from "./modalControllerTypes";
import { ModalComponentSeed } from "./modalSeedTypes";

export interface ModalManagerInterface extends ModalTransctionController {
  getCurrentModalPosition: (positionState: ModalLifecycleState, position?: string) => PositionStyle;
  getModalTransition: (duration?: number, options?: ModalTransitionOptions) => ModalTransition;
  getModalComponentSeed: (name: string) => ModalComponentSeed | undefined;
  call: <F = any, P = any>(asyncCallback: (props: P) => Promise<F>, asyncCallbackProps: P) => Promise<F>;
}
