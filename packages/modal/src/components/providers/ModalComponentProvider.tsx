import { useEffect, useState } from "react";
import { Modal } from "../../services/modal";
import { ModalState } from "../../types";
import { ModalComponentPropsContext } from "../../hooks/useModalComponentProps";

interface ModalComponentProviderProps {
  breakPoint: number;
  modal: Modal;
}

const ModalComponentProvider = ({
  breakPoint,
  modal,
}: ModalComponentProviderProps) => {
  const [state, setState] = useState(modal.getState());

  const { Component, componentProps, backCoverStyle, modalStyle, isActive } =
    state;

  useEffect(() => {
    modal.setBreakPoint(breakPoint);
  }, [breakPoint]);

  const closeModal = () => {
    if (modal.options.backCoverConfirm === null) {
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
      modal.unsubscribe(listener);
    };
  }, []);

  return (
    <div className="modalWrapper">
      <button
        className={`closeModalCover ${isActive ? "" : "close"}`}
        style={backCoverStyle}
        type="button"
        onClick={closeModal}
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

export default ModalComponentProvider;
