import { useEffect, useState } from "react";
import { MODAL_TRANSACTION_STATE } from "../contants/constants";
import { ModalComponentPropsContext } from "../hooks/useModalComponentProps";
import { Modal, ModalState } from "../services/modal";
import { ModalTransactionState } from "../types";

interface ModalComponentProps {
  breakPoint: number;
  transactionState: ModalTransactionState;
  modal: Modal;
}

const ModalComponent = ({
  breakPoint,
  transactionState,
  modal,
}: ModalComponentProps) => {
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

    modal.init();
    modal.subscribe(listener);

    return () => {
      modal.unSubscribe(listener);
    };
  }, []);

  return (
    <div className="modalWrapper">
      <button
        className={`closeModalCover ${modal.isActive ? "" : "close"}`}
        style={backCoverStyle}
        type="button"
        onClick={onCloseModal}
      />
      <div className="modalContentContainer">
        <div className="modalContent" style={modalStyle}>
          <ModalComponentPropsContext.Provider value={componentProps}>
            <Component {...componentProps} />
          </ModalComponentPropsContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
