import { ReactNode } from "react";
import { DEFAULT_DURATION, DEFAULT_POSITION, DEFAULT_TRANSITION } from "../contants/constants";

type ModalLifecycleState = "open" | "active" | "close";

type DetailedModalActionState = "pending" | "success" | "error" | "final";

type ModalActionState = "initial" | DetailedModalActionState;

interface ModalComponentProps {
  title?: ReactNode;
  content?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customContent?: ReactNode;
  action: (confirm?: string | boolean) => void;
  actionState: ModalActionState;
}

type ModalComponent = (props: ModalComponentProps) => ReactNode;

interface ModalContentOptions {
  title?: ReactNode;
  content?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customContent?: ReactNode;
}

interface ModalBackCoverOptions {
  backCoverConfirm?: string | boolean;
  backCoverColor?: string;
  backCoverOpacity?: number; // 0 ~ 0.5 ~ 1;
}

type DetailedActionModalComonentTable = {
  [key in DetailedModalActionState]?: ModalComponent;
};

interface ModalComponentTable extends DetailedActionModalComonentTable {
  initial: ModalComponent;
}

interface ModalComponentFiber {
  componentTable: ModalComponentTable;
  defaultOptions?: any; // ModalDispatchOptions;
}

interface ModalComponentMeta {
  name: string;
  component: ModalComponent | ModalComponentTable;
  defaultOptions?: any; // ModalDispatchOptions;
}

/**
 * Case 1
 * Modal Component Fiber의 property의 값은 항상 존재할 것.
 * 처음에 세팅할 때 값이 없으면 initial의 값을 넣어줄 것.
 * Case 2
 * Modal Component Fiber의 property의 값은 없을 수 도 있음.
 * 만약 값이 없으면 modal state에서 변경할 것.
 * Case 3
 * Modal Component Fiber의 property의 값은 항상 존재할 것.
 * 처음에 세팅할 때 값이 없으면 default의 값을 넣어줄 것.
 * 
 * Case 3로 채택
 * 이유는 만약 initial만 사용할 거면 action state를 initial에서 변경하지 않으면 되기 때문.
 * action state를 변경할때 빈 값이면 해당 modal component의 값을 불러오고 string을 받으면 존재하는 modal map에서 불러오고 
 * Component를 넣으면 해당 Component를 불러올 것.
 */

interface StylePositionProperties {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
  opacity?: number;
  background?: string;
}

type ModalLifecycleStateToPositionStyle = {
  [key in ModalLifecycleState]: StylePositionProperties;
};

type DefaultModalPosition =
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

type ModalPositionTable<T extends string = string> = {
  [key in DefaultModalPosition | T]: ModalLifecycleStateToPositionStyle;
};

type ModalPositionMap<T extends string = string> = Map<
  T | DefaultModalPosition,
  ModalLifecycleStateToPositionStyle
>;

interface ModalTransition {
  transitionProperty: string;
  transitionDuration: string;
  transitionTimingFunction: string;
  transitionDelay: string;
}

type ModalTransitionProps = {
  [key in keyof ModalTransition]?: ModalTransition[key];
};

type ModalTransitionOptions = Omit<
  ModalTransitionProps,
  "transitionDuration"
>;

interface ModalManagerOptions<T extends string> {
  modalComponentMeta?: ModalComponentMeta;
  position?: ModalPositionTable<T>;
  transition?: ModalTransitionOptions;
  duration?: number;
  backCoverColor?: string;
  backCoverOpacity?: number;
  detailedModalComponentFiberTable?: DetailedActionModalComonentTable;
}

type ModalTransactionState = "idle" | "standby" | "active";

abstract class EventManager {
  getDetailedModalComponentFiber: (actionState: DetailedModalActionState) => ModalComponent | null;
  getModalComponentFiber: (name: string) => ModalComponentFiber | null;
}

class ModalEventManager<T extends string = string> implements EventManager {
  private currentId: number = 0;
  private callCount: number = 0;
  private transactionState: ModalTransactionState = "idle";
  private detailedModalComponentFiberTable: DetailedActionModalComonentTable = {};
  private modalComponentFiberMap: Map<string, ModalComponentFiber> = new Map();
  private modalPositionMap: ModalPositionMap = new Map();
  private modalTransition: ModalTransition = DEFAULT_TRANSITION;
  private modalDuration: number = DEFAULT_DURATION;

  constructor({

  }: ModalManagerOptions<T> = {}) {
    this.setModalComponentFiberMap.bind(this);
  }

  private setModalComponentFiberMap(componetFiber: ModalComponentMeta) {

  }

  initModalOptions(optionsProps: ModalManagerOptions<T>) {
    const { position, transition, duration } = optionsProps;

    const initialPosition: ModalPositionTable = {
      ...DEFAULT_POSITION,
      ...position,
    };

    this.setModalPosition(initialPosition);
    this.setModalTransition(transition);
    this.setModalDuration(duration);
  }

  setModalTransition(transitionProps?: ModalTransitionProps) {
    if (transitionProps === undefined) {
      return this;
    }

    const transition = {
      ...this.modalTransition,
      ...transitionProps,
    };

    this.modalTransition = transition;

    return this;
  }

  setModalDuration(duration: number = -1) {
    if (duration < 0) {
      return this;
    }

    this.modalDuration = duration;
    this.setModalTransition({ transitionDuration: `${duration}ms` });

    return this;
  }

  setModalPosition(modalPositionTable: ModalPositionTable<T>) {
    const modalPositionList = Object.entries(modalPositionTable);

    modalPositionList.forEach(([key, value]) => {
      this.modalPositionMap.set(key, value);
    });

    return this;
  }

  getDetailedModalComponentFiber(actionState: DetailedModalActionState) {
    const component = this.detailedModalComponentFiberTable[actionState];

    return component ? component : null;
  }

  getModalComponentFiber(name: string) {
    const modalComponentFiber = this.modalComponentFiberMap.get(name);

    return modalComponentFiber ? modalComponentFiber : null;
  }

}

type ModalProps = ModalContentOptions & ModalBackCoverOptions & {
  modalComponentTable: ModalComponentTable;
  eventManager: EventManager;
};

/**
 * TODO: Modal options은 modal event manager에서 분류할 것.
 */
class Modal {
  modalComponetTable: ModalComponentTable;
  eventManager: EventManager;

  constructor(props: ModalProps) {
    const {
      modalComponentTable,
      eventManager,
    } = props;

    this.modalComponetTable = modalComponentTable;
    this.eventManager = eventManager;
  }
}



