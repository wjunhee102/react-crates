import { useEffect, useState } from "react";
import ModalManager from "../services/modalManager";
import { ModalCallback } from "../services/modalStateManager";
import { ModalDispatchOptions } from "../types";
import { ModalComponent, ModalComponentProps } from "../services/ModalFiber";

export interface ModalRegistratorProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  name?: string;
  modalManager?: ModalManager;
  options?: ModalDispatchOptions;
  children:
    | ((props: ModalComponentProps) => React.ReactElement)
    | ModalComponent;
}

const setModalRegistrator = (defaultModalManager: ModalManager) =>
  function ModalRegistrator({
    open,
    setOpen,
    children,
    name,
    modalManager = defaultModalManager,
    options = {},
  }: ModalRegistratorProps) {
    const [modalId, setModalId] = useState(-1);
    const [currentName, setCurrentName] = useState("");

    const callback: ModalCallback = (confirm, stateController) => {
      setOpen && setOpen(false);
      options.callback && options.callback(confirm, stateController);
    };

    const modalOptions = {
      ...options,
      callback,
    };

    if (name) {
      modalManager.setModalComponent({
        name,
        component: children,
        defaultOptions: modalOptions,
      });
    }

    useEffect(() => {
      if (!name) {
        // eslint-disable-next-line
        return () => {};
      }

      if (currentName !== name) {
        setCurrentName(name);
      }

      return () => {
        modalManager.removeModalComponent(name);
      };
      // eslint-disable-next-line
    }, [name]);

    useEffect(() => {
      if (!open) {
        if (modalId === -1) {
          return;
        }

        modalManager.edit(modalId, { isClose: true });
        setModalId(-1);
        return;
      }

      const id = modalManager.open(name || children, modalOptions);
      setModalId(id);
      // eslint-disable-next-line
    }, [open]);

    return null;
  };

export default setModalRegistrator;
