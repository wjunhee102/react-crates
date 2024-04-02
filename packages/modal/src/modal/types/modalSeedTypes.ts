import { ModalComponent } from "./modalComponentTypes";
import { ModalDispatchOptions, ModalOptions } from "./modalOptionsTypes";

export interface ModalComponentSeed {
  name: string;
  component: ModalComponent;
  defaultOptions?: ModalDispatchOptions;
}

export interface ModalSeed<T extends ModalDispatchOptions = ModalOptions> {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent<any>;
  options: T;
}
