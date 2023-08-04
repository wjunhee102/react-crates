import { useEffect, useState } from "react";
import ModalManager from "../services/modalManager";
import { ModalListener } from "../types";

function setUseIsOpenModal(defaultModalManager: ModalManager) {
  return (modalManager: ModalManager = defaultModalManager) => {
    const [isOpenModal, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
      const listener: ModalListener = ({ modalFiberStack }) => {
        setIsOpen(modalFiberStack.length > 0);
      };

      modalManager.subscribe(listener);

      return () => {
        modalManager.unSubscribe(listener);
      };
    }, [modalManager]);

    return isOpenModal;
  };
}

export default setUseIsOpenModal;
