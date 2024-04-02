import { useEffect, useMemo, useState } from "react";
import { MODAL_TRANSACTION_STATE } from "../contants";
import ModalManager from "../services/modalManager";
import {
  ModalComponentSeed,
  ModalManagerOptionsProps,
  ModalManagerState,
} from "../types";
import { setDisableBodyScroll } from "../utils/disableBodyScroll";
import ModalComponent from "./ModalComponent";

import "./modal.css";

export interface ModalProviderProps {
  modalManager?: ModalManager;
  modalMeta?: ModalComponentSeed | ModalComponentSeed[];
  options?: ModalManagerOptionsProps<any>;
  disableScroll?: boolean;
}

function setModalProvider(defaultModalManager: ModalManager) {
  return function ModalProvider({
    modalManager = defaultModalManager,
    modalMeta,
    options,
    disableScroll = true,
  }: ModalProviderProps) {
    const [
      { modalStack, transactionState, isOpen, breakPoint },
      setModalManagerState,
    ] = useState<ModalManagerState>(modalManager.getState());
    const disableBodyScroll = useMemo(() => setDisableBodyScroll(), []);

    const onClearModal = () => {
      if (
        isOpen &&
        modalStack.length > 0 &&
        transactionState === MODAL_TRANSACTION_STATE.idle
      ) {
        modalManager.popModal("clear");
      }
    };

    useEffect(() => {
      if (modalMeta) {
        modalManager.setModalComponent(modalMeta);
      }

      if (options) {
        modalManager.initModalOptions(options);
      }

      modalManager.subscribe(setModalManagerState);

      const listener = () => {
        modalManager.setBreakPoint(window.innerWidth);
        // 주소 표시줄이 보이거나 숨겨질 때 뷰포트 높이 조정
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      };

      window.addEventListener("resize", listener);

      return () => {
        modalManager.unSubscribe(setModalManagerState);
        window.removeEventListener("resize", listener);
        disableBodyScroll(false);
      };
    }, []);

    useEffect(() => {
      let asyncOpenModal: NodeJS.Timeout | null = null;

      if (isOpen) {
        disableBodyScroll(disableScroll);
      } else {
        asyncOpenModal = setTimeout(() => {
          disableBodyScroll(false);
        }, 0);
      }

      return () => {
        if (asyncOpenModal) {
          clearTimeout(asyncOpenModal);
        }
      };
    }, [isOpen]);

    return (
      <div className={`modalProvider ${isOpen ? "open" : ""}`}>
        <button type="button" className="modalClearBtn" onClick={onClearModal}>
          {" "}
        </button>
        {modalStack.map((modal) => (
          <ModalComponent
            key={modal.id}
            breakPoint={breakPoint}
            transactionState={transactionState}
            modal={modal}
          />
        ))}
      </div>
    );
  };
}

export default setModalProvider;
