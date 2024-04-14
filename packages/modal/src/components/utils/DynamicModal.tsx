import {
  ReactNode,
  ReactElement,
  isValidElement,
  createContext,
  useContext,
  useMemo,
  ButtonHTMLAttributes,
  useCallback,
  MouseEvent,
} from "react";
import ModalManager from "../../services/modalManager";
import { Modal } from "../../components/modal";
import {
  ModalConfirmType,
  ModalDispatchOptions,
  ModalCallback,
  ModalEditOptions,
} from "../../types";

type DynamicModalOptions = Omit<ModalEditOptions, "payload">;

class DynamicModalManager {
  private modalId: number | null = null;
  private isOpen = false;
  private element: ReactElement | null = null;
  private options: DynamicModalOptions = {};

  constructor(private modalManager: ModalManager) {}

  editModal() {
    if (!this.isOpen || !this.modalId || !this.element) {
      return;
    }

    this.modalManager.edit(this.modalId, {
      component: () => this.element,
      ...this.options,
    });
  }

  setElement(element: ReactElement) {
    if (isValidElement(element)) {
      this.element = element;
    }

    this.editModal();

    return this;
  }

  setOptions(options: DynamicModalOptions = {}) {
    const callback: ModalCallback = (...props) => {
      options.action && options.action(...props);
      this.isOpen = false;
      this.modalId = null;
    };

    this.options = {
      ...options,
      action: callback,
    };

    return this;
  }

  open() {
    if (this.isOpen || !this.element) {
      return;
    }

    this.isOpen = true;
    this.modalId = this.modalManager.open(this.element, this.options);
  }

  async action(confirm?: ModalConfirmType) {
    if (!this.modalId) {
      return;
    }

    const result = await this.modalManager.action(this.modalId, confirm);

    if (!result) {
      return;
    }

    this.isOpen = false;
    this.modalId = null;

    return;
  }
}

const DynamicModalContext = createContext<DynamicModalManager | null>(null);

function useDynamicModal() {
  const dynamicModalManager = useContext(DynamicModalContext);

  if (!dynamicModalManager) {
    throw Error("useDynamicModal must be used within a DynamicModal");
  }

  return dynamicModalManager;
}

export interface DynamicModalTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const DynamicModalTrigger = ({
  onClick,
  ...restProps
}: DynamicModalTriggerProps) => {
  const dynamicModalManager = useDynamicModal();

  const openModal = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      onClick && onClick(event);
      dynamicModalManager.open();
    },
    [dynamicModalManager, onClick]
  );

  return <button onClick={openModal} {...restProps} />;
};

export interface DynamicModalElementProps {
  children: ReactElement;
}

const DynamicModalElement = ({ children }: DynamicModalElementProps) => {
  const dynamicModalManager = useDynamicModal();

  dynamicModalManager.setElement(children);

  return null;
};

interface DynamicModalProviderProps {
  modalManager: ModalManager;
  options?: DynamicModalOptions;
  children: ReactNode;
}

const DynamicModalProvider = ({
  modalManager,
  options,
  children,
}: DynamicModalProviderProps) => {
  const dynamicModalManager = useMemo(
    () => new DynamicModalManager(modalManager),
    [modalManager]
  );

  dynamicModalManager.setOptions(options);

  return (
    <DynamicModalContext.Provider value={dynamicModalManager}>
      {children}
    </DynamicModalContext.Provider>
  );
};

export interface DynamicModalProps<T extends string> {
  options?: ModalDispatchOptions<any, T>;
  children: ReactNode;
}

const setDynamicModal = <T extends string>(modalManager: ModalManager) => {
  function DynamicModal({ children, options = {} }: DynamicModalProps<T>) {
    return (
      <DynamicModalProvider modalManager={modalManager} options={options}>
        {children}
      </DynamicModalProvider>
    );
  }

  DynamicModal.displayName = "DynamicModal";

  DynamicModal.Trigger = DynamicModalTrigger;
  DynamicModal.Element = DynamicModalElement;
  DynamicModal.Action = Modal.Action;

  return DynamicModal;
};

DynamicModalTrigger.displayName = "DynamicModal.Trigger";
DynamicModalElement.displayName = "DynamicModal.Element";

export default setDynamicModal;
