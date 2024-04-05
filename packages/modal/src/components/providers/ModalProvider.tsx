import { useEffect, useMemo, useState } from "react";
import ModalManager from "../../services/modalManager";
import { ModalManagerState } from "../../types";
import { MODAL_TRANSACTION_STATE } from "../../contants";
import { setDisableBodyScroll } from "../../utils/disableBodyScroll";
import ModalComponentProvider from "./ModalComponentProvider";

import "./modalProvider.css";

interface ModalProviderCoreProps extends ModalProviderProps {
  modalManager: ModalManager;
}

function ModalProviderCore({
  modalManager,
  disableScroll = true,
}: ModalProviderCoreProps) {
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
    modalManager.subscribe(setModalManagerState);

    const originVh = document.documentElement.style.getPropertyValue("--vh");

    const listener = () => {
      modalManager.setBreakPoint(window.innerWidth);
      // 주소 표시줄이 보이거나 숨겨질 때 뷰포트 높이 조정
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", listener);

    return () => {
      modalManager.unsubscribe(setModalManagerState);
      document.documentElement.style.setProperty("--vh", originVh);
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
        <ModalComponentProvider
          key={modal.id}
          breakPoint={breakPoint}
          modal={modal}
        />
      ))}
    </div>
  );
}

export interface ModalProviderProps {
  disableScroll?: boolean;
}

function setModalProvider(modalManager: ModalManager) {
  return function ModalProvider(props: ModalProviderProps) {
    return <ModalProviderCore modalManager={modalManager} {...props} />;
  };
}

export default setModalProvider;
