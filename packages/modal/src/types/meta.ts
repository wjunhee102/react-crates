import { ModalComponent } from "./component";
import { ModalOptions } from "./options"

export type ModalMeta<T = any> = {
  component: ModalComponent;
  options: ModalOptions<T>;
}