import { useEffect, useState } from "react";
import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import { ModalComponentPropsContext } from "../services/modalComponentPropsContext";
import { Modal as ModalStateManager, ModalState } from "../services/modal";
import { ModalTransactionState } from "../types";

interface ModalProps {
  breakPoint: number;
  transactionState: ModalTransactionState;
  modal: ModalStateManager;
}

const ModalComponent = ({
  breakPoint,
  transactionState,
  modal,
}: ModalProps) => {
  const [state, setState] = useState(modal.getState());

  const { Component, componentProps, backCoverStyle, modalStyle } = state;

  useEffect(() => {
    modal.setBreakPoint(breakPoint);
  }, [modal, breakPoint]);

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

    modal.init();
    modal.subscribe(listener);

    return () => {
      modal.unSubscribe(listener);
    };
  }, [modal]);

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
          <ModalComponentPropsContext.Provider value={componentProps}>
            <Component {...componentProps} />
          </ModalComponentPropsContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
