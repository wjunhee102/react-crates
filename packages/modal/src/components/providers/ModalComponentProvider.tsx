import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../../services/modal";
import { ModalState } from "../../types";
import { ModalComponentPropsContext } from "../../hooks/useModalComponentProps";

interface ModalComponentProviderProps {
  breakPoint: number;
  modal: Modal;
  isCurrent: boolean;
}

const ModalComponentProvider = ({
  breakPoint,
  modal,
  isCurrent,
}: ModalComponentProviderProps) => {
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
    <div className="modalWrapper">
      <button
        className={`closeModalCover ${isActive ? "" : "close"}`}
        style={backCoverStyle}
        type="button"
        onClick={closeModal}
      />
      <div className="modalContentContainer">
        <div
          ref={modalContentRef}
          tabIndex={-1}
          className="modalContent"
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

export default ModalComponentProvider;
