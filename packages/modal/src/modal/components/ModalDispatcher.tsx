import { useEffect, useMemo, useState } from "react";
import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import ModalManager from "../services/modalManager";
import {
  ModalComponentFiber,
  ModalListener,
  ModalManagerOptionsProps,
  ModalTransactionState,
} from "../types";
import { Modal } from "../services/ModalFiber";
import { setDisableBodyScroll } from "../utils/disableBodyScroll";
import ModalComponent from "./Modal";

import "./modal.css";

export interface ModalDispatcherProps {
  modalManager?: ModalManager;
  modalMeta?: ModalComponentFiber | ModalComponentFiber[];
  options?: ModalManagerOptionsProps<any>;
  disableScroll?: boolean;
}

function setModalDispatcher(defaultModalManager: ModalManager) {
  return function ModalDispatcher({
    modalManager = defaultModalManager,
    modalMeta,
    options,
    disableScroll = true,
  }: ModalDispatcherProps) {
    const [modalFiberList, setModalFiberList] = useState<Modal[]>([]);
    const [breakPoint, setBreakPoint] = useState(window?.innerWidth ?? 0);
    const [isOpen, setIsOpen] = useState(false);
    const [transactionState, setTransactionState] =
      useState<ModalTransactionState>(MODAL_TRANSACTION_STATE.idle);
    const disableBodyScroll = useMemo(() => setDisableBodyScroll(), []);

    const onClearModal = () => {
      if (
        isOpen &&
        modalFiberList.length > 0 &&
        transactionState === MODAL_TRANSACTION_STATE.idle
      ) {
        modalManager.popModalFiber("clear");
      }
    };

    useEffect(() => {
      const listener: ModalListener = ({
        modalFiberStack,
        transactionState: state,
      }) => {
        setModalFiberList(modalFiberStack);
        setTransactionState(state);
      };

      if (modalMeta) {
        modalManager.setModalComponent(modalMeta);
      }

      if (options) {
        modalManager.initModalOptions(options);
      }

      modalManager.subscribe(listener);
      setModalFiberList(modalManager.getModalFiberStack());

      return () => {
        modalManager.unSubscribe(listener);
      };
      // eslint-disable-next-line
    }, [modalManager]);

    useEffect(() => {
      let asyncOpenModal: NodeJS.Timeout | null = null;

      if (modalFiberList.length > 0) {
        setIsOpen(true);
        disableBodyScroll(disableScroll);
      } else if (setTimeout) {
        asyncOpenModal = setTimeout(() => {
          setIsOpen(false);
          disableBodyScroll(false);
        }, 0);
      } else {
        setIsOpen(false);
        disableBodyScroll(false);
      }

      return () => {
        if (clearTimeout && asyncOpenModal) {
          clearTimeout(asyncOpenModal);
        }
      };
      // eslint-disable-next-line
    }, [modalFiberList]);

    useEffect(() => {
      const listener = () => {
        setBreakPoint(window.innerWidth);
        // 주소 표시줄이 보이거나 숨겨질 때 뷰포트 높이 조정
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      };

      window.addEventListener("resize", listener);

      return () => {
        window.removeEventListener("resize", listener);
        disableBodyScroll(false);
      };
    }, []);

    return (
      <div className={`modalDispatcher-r ${isOpen ? "open-r" : ""}`}>
        <button
          type="button"
          className="modalClearBtn-r"
          onClick={onClearModal}
        >
          {" "}
        </button>
        {modalFiberList.map((modalFiber) => (
          <ModalComponent
            key={modalFiber.id}
            breakPoint={breakPoint}
            transactionState={transactionState}
            modal={modalFiber}
          />
        ))}
      </div>
    );
  };
}

export default setModalDispatcher;
