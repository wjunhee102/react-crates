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

  const modalBackCoverRef = useRef<HTMLButtonElement>(null);

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

  const actionToKeyUp = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "Enter":
          isEnterKeyActive && modal.action(true);
          return;
        case "Escape":
          isEscKeyActive && modal.action(false);
          return;
        default:
          return;
      }
    },
    []
  );

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
    if (isCurrent && modalBackCoverRef.current) {
      modalBackCoverRef.current.focus();
    }
  }, [isCurrent]);

  useEffect(() => {
    modal.setBreakPoint(breakPoint);
  }, [breakPoint]);

  return (
    <div className="modalWrapper_rm">
      <button
        ref={modalBackCoverRef}
        className={`closeModalCover_rm ${isActive ? "" : "close_rm"}`}
        style={backCoverStyle}
        type="button"
        onClick={closeModal}
        onKeyUp={actionToKeyUp}
      />
      <div className="modalContentContainer_rm">
        <div className="modalContent_rm" style={modalStyle}>
          <ModalComponentPropsContext.Provider value={componentProps}>
            <Component {...componentProps} />
          </ModalComponentPropsContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default ModalComponentProvider;
