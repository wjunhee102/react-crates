import { ModalPositionTable } from "./commonTypes";
import { ModalComponent } from "./modalComponentTypes";
import { ModalDispatchOptions, ModalOptions } from "./modalOptionsTypes";

export interface ModalComponentSeed<
  T extends any = any,
  P extends string = string
> {
  name: string;
  component: ModalComponent;
  defaultOptions?: ModalDispatchOptions<T, P>;
}

export interface ModalSeed<T extends ModalDispatchOptions = ModalOptions> {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent<any>;
  options: T;
}

export type ModalComponentSeedTable<T extends string = string> = {
  [name in T]: {
    component: ModalComponent;
    defaultOptions?: ModalDispatchOptions;
  };
};
