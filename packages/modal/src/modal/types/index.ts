import {
  Modal,
  ModalComponent,
  ModalMiddlewareProps,
} from "../services/modal";
import {
  ModalLifecycleState,
  ModalConfirmType,
  ModalCallback,
} from "../services/modal";

export interface ModalManagerState {
  modalStack: Modal[];
  breakPoint: number;
  isOpen: boolean;
  transactionState: ModalTransactionState;
}

export interface ModalListenerProps {
  modalStack: Modal[];
  transactionState: ModalTransactionState;
}

export type ModalListener = (state: ModalManagerState) => void;

export type DefaultModalName = "clear" | "unknown";

export type ModalRemovedName = DefaultModalName | string | string[];

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

export type ModalTransitionOptions = Omit<
  ModalTransitionProps,
  "transitionDuration"
>;

export interface ModalManagerOptionsProps<T extends string> {
  position?: ModalPositionTable<T>;
  transition?: ModalTransitionOptions;
  duration?: number;
  backCoverColor?: string;
  backCoverOpacity?: number;
  stateResponsiveComponent?: boolean;
}

export type ModalTransactionState = "idle" | "standby" | "active";

export type ModalAsyncCall<T = any, P = any> = (
  asyncCallback: (props: P) => T,
  asyncCallbackProps: P
) => Promise<T>;

// export interface ModalMiddlewareProps {
//   transactionState: ModalTransactionState;
//   standbyTransaction: () => void;
//   startTransaction: () => void;
//   endTransaction: () => void;
//   stateController: StateController;
// }

export type ModalMiddleware = (
  props: ModalMiddlewareProps
) => void | Promise<void>;

type ModalPosition =
  | ((breakPoint: number) => DefaultModalPosition | string)
  | DefaultModalPosition
  | string;

export interface ModalDispatchOptions<T = any> {
  modalKey?: string;
  callback?: ModalCallback;
  middleware?: ModalMiddleware;
  backCoverConfirm?: ModalConfirmType;
  backCoverColor?: string;
  backCoverOpacity?: number;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  subContent?: React.ReactNode;
  confirmContent?: React.ReactNode;
  cancelContent?: React.ReactNode;
  customContent?: React.ReactNode;
  payload?: T;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: ModalTransitionOptions;
  position?: ModalPosition;
  stateResponsiveComponent?: boolean;
  required?: boolean;
}

export interface EditModalOptionsProps<T = any>
  extends ModalDispatchOptions<T> {
  isClose?: boolean;
}

export type ModalClose = (
  callback?: (confirm?: ModalConfirmType) => void,
  confirm?: ModalConfirmType
) => void;

export interface ModalOptions<T = any> extends EditModalOptionsProps<T> {
  closeModal: ModalClose;
  middleware: ModalMiddleware;
  // stateManager: ModalStateManager;
}

export type CloseModalProps =
  | ModalRemovedName
  | number
  | [number, ModalRemovedName];

export type CloseModal = (closeModalProps: CloseModalProps) => void;

/** 
export interface ModalComponentProps<T = any>
  extends Omit<ModalOptions<T>, "callback" | "closeModal" | "middleware">,
  ModalState {
  transactionState: ModalTransactionState;
  action: (confirm?: ModalConfirmType) => void;
}
**/

// export type ModalComponent<T = any> = React.FC<ModalComponentProps<T>>;

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
