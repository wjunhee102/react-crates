import { ReactNode, useEffect, useState } from "react";
import ModalManager from "../../services/modalManager";
import { ModalManagerState } from "../../types";
import { MODAL_TRANSACTION_STATE } from "../../contants";
import ModalComponentProvider from "./ModalComponentProvider";
import { Modal } from "../../services/modal";

import "./modalProvider.css";

let overflow = "";
let height = "";
let width = "";

interface ModalProviderCoreProps extends ModalProviderProps {
  modalManager: ModalManager;
}

const ModalProviderCore = ({
  modalManager,
  disableScroll = true,
  children,
}: ModalProviderCoreProps) => {
  const [
    { modalStack, transactionState, isOpen, breakPoint, currentModalId },
    setModalManagerState,
  ] = useState<ModalManagerState>(modalManager.getState());

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
    };
  }, []);

  useEffect(() => {
    if (isOpen && disableScroll) {
      overflow = document.body.style.overflow;
      height = document.body.style.height;
      width = document.body.style.width;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";

      return () => {
        document.body.style.overflow = overflow;
        document.body.style.height = height;
        document.body.style.width = width;

        overflow = "";
        height = "";
        width = "";
      };
    }

    document.body.style.overflow = overflow;
    document.body.style.height = height;
    document.body.style.width = width;

    return () => {
      overflow = "";
      height = "";
      width = "";
    };
  }, [isOpen]);

  const props = {
    isOpen,
    modalStack,
    breakPoint,
    currentModalId,
    onClearModal,
  };

  if (children) {
    return (
      <>
        {children}
        <ModalProviderView {...props} />
      </>
    );
  }

  return <ModalProviderView {...props} />;
};

interface ModalProviderViewProps {
  isOpen: boolean;
  modalStack: Modal[];
  breakPoint: number;
  currentModalId: number;
  onClearModal: () => void;
}

const ModalProviderView = ({
  isOpen,
  modalStack,
  breakPoint,
  currentModalId,
  onClearModal,
}: ModalProviderViewProps) => (
  <div className={`modalProvider_rm ${isOpen ? "open_rm" : ""}`}>
    <button type="button" className="modalClearBtn_rm" onClick={onClearModal}>
      {" "}
    </button>
    {modalStack.map((modal) => (
      <ModalComponentProvider
        key={modal.id}
        breakPoint={breakPoint}
        modal={modal}
        isCurrent={modal.id === currentModalId}
      />
    ))}
  </div>
);

export interface ModalProviderProps {
  disableScroll?: boolean;
  children?: ReactNode;
}

function setModalProvider(modalManager: ModalManager) {
  return function ModalProvider(props: ModalProviderProps) {
    return <ModalProviderCore modalManager={modalManager} {...props} />;
  };
}

export default setModalProvider;
