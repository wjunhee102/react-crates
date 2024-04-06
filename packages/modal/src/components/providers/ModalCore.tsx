import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../../services/modal";
import { ModalState } from "../../types";
import { ModalComponentPropsContext } from "../../hooks/useModalComponentProps";

interface ModalCoreProps {
  breakPoint: number;
  modal: Modal;
  isCurrent: boolean;
}

const ModalCore = ({ breakPoint, modal, isCurrent }: ModalCoreProps) => {
  const [state, setState] = useState(modal.getState());

  const modalContentRef = useRef<HTMLDivElement>(null);

  const {
    component: Component,
    componentProps,
    backCoverStyle,
    modalStyle,
    isActive,
    isEnterKeyActive,
    isEscKeyActive,
  } = state;

  const closeModal = useCallback(() => {
    if (modal.options.backCoverConfirm === null) {
      return;
    }

    modal.action(modal.options.backCoverConfirm);
  }, []);

  const actionToKeyUp = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Enter":
        isEnterKeyActive && modal.action(true);
        return;
      case "Escape":
        isEscKeyActive && modal.action(modal.options.backCoverConfirm);
        return;
      default:
        return;
    }
  }, []);

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

  useEffect(() => {
    if (isCurrent && modalContentRef.current) {
      modalContentRef.current.focus();
    }
  }, [isCurrent]);

  useEffect(() => {
    modal.setBreakPoint(breakPoint);
  }, [breakPoint]);

  return (
    <div className="modalWrapper_rm">
      <button
        className={`closeModalCover_rm ${isActive ? "" : "close_rm"}`}
        style={backCoverStyle}
        type="button"
        onClick={closeModal}
      />
      <div className="modalContentContainer_rm">
        <div
          ref={modalContentRef}
          tabIndex={-1}
          className="modalContent_rm"
          style={modalStyle}
          onKeyUp={actionToKeyUp}
        >
          <ModalComponentPropsContext.Provider value={componentProps}>
            <Component {...componentProps} />
          </ModalComponentPropsContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default ModalCore;