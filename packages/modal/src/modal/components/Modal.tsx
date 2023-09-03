import React, { useEffect, useState } from "react";
import { MODAL_POSITION, MODAL_TRANSACTION_STATE } from "../contants/constants";
import ModalContext from "../services/modalContext";
import ModalManager from "../services/modalManager";
import { ModalTransactionState } from "../types";
import { delay } from "../utils/delay";
import { Modal as ModalStateManager, ModalState } from "../services/ModalFiber";

interface ModalProps {
  modalManager: ModalManager;
  breakPoint: number;
  transactionState: ModalTransactionState;
  modal: ModalStateManager;
}

const Modal = ({
  modalManager,
  breakPoint,
  transactionState,
  modal,
}: ModalProps) => {
  const [state, setState] = useState(modal.getState());

  const { Component, componentProps, backCoverStyle, modalStyle } = state;

  useEffect(() => {
    modal.setBreakPoint(breakPoint);
  }, [breakPoint]);

  const onCloseModal = () => {
    if (
      transactionState !== MODAL_TRANSACTION_STATE.idle ||
      modal.options.backCoverConfirm === null
    ) {
      return;
    }

    modal.action(modal.options.backCoverConfirm);
  };

  useEffect(() => {
    const listener = (modalState: ModalState) => {
      setState(modalState);
    };

    modal.subscribe(listener);

    return () => {
      modal.unSubscribe(listener);
    };
  }, [modal]);

  useEffect(() => {
    let asyncOpenModal: NodeJS.Timeout | null = null;

    if (setTimeout) {
      asyncOpenModal = setTimeout(() => {
        modal.active();
      }, 10);
    } else {
      modal.active();
    }

    return () => {
      if (clearTimeout) {
        asyncOpenModal && clearTimeout(asyncOpenModal);
      }
    };
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   if (lifecycleState === MODAL_LIFECYCLE_STATE.active) {
  //     return;
  //   }

  //   if (lifecycleState === MODAL_LIFECYCLE_STATE.close) {
  //     options.closeModal(stateManager.endCallback, stateManager.confirm);
  //   }

  //   if (lifecycleState === MODAL_LIFECYCLE_STATE.open) {
  //     const { duration } = options;

  //     modalManager.call(delay, duration ?? 0);
  //   }
  //   // eslint-disable-next-line
  // }, [lifecycleState]);

  // useEffect(() => {
  //   if (transactionState === "idle" && isClose) {
  //     modalProps.action(backCoverConfirm);
  //   }
  //   // eslint-disable-next-line
  // }, [isClose, transactionState]);

  return (
    <div className="modalWrapper-r">
      <button
        className={`closeModalCover-r ${modal.isActive ? "" : "close-r"}`}
        style={backCoverStyle}
        type="button"
        onClick={onCloseModal}
      >
        {" "}
      </button>
      <div className="modalContentContainer-r">
        <div className="modalContent-r" style={modalStyle}>
          {/* <ModalContext.Provider value={modalProps}>
            <Component {...modalProps} />
          </ModalContext.Provider> */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
