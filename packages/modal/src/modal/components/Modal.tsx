import React, { useEffect, useMemo, useState } from "react";
import { MODAL_POSITION, MODAL_TRANSACTION_STATE } from "../contants/constants";
import ModalContext from "../services/modalContext";
import ModalManager from "../services/modalManager";
import {
  MODAL_LIFECYCLE_STATE,
  ModalCallback,
  ModalConfirmType,
  ModalState,
  StateController,
} from "../services/modalStateManager";
import {
  ModalComponentProps,
  ModalFiber,
  ModalTransactionState,
} from "../types";
import { delay } from "../utils/delay";

interface ModalProps extends ModalFiber {
  modalManager: ModalManager;
  breakPoint: number;
  transactionState: ModalTransactionState;
}

const Modal = ({
  modalManager,
  breakPoint,
  transactionState,
  options,
  component: Component,
}: ModalProps) => {
  const { isClose, backCoverConfirm, stateManager } = options;

  const [state, setState] = useState(stateManager.getState());

  const { lifecycleState } = state;

  const isActive = lifecycleState === MODAL_LIFECYCLE_STATE.active;

  const stateController: StateController = useMemo(
    () => stateManager.getController(),
    [stateManager]
  );

  const modalProps: ModalComponentProps = useMemo(() => {
    const { middleware } = options;

    const appliedOptions = {
      ...options,
      callback: undefined,
      closeModal: undefined,
      middleware: undefined,
    };

    const props = {
      ...appliedOptions,
      ...state,
      transactionState,
      stateController,
      action: (confirm?: ModalConfirmType, actionCallback?: ModalCallback) => {
        if (transactionState !== MODAL_TRANSACTION_STATE.idle) {
          return;
        }

        stateManager.setConfirm(confirm).setCallback(actionCallback);

        middleware({
          transactionState,
          standbyTransaction: modalManager.standbyTransaction,
          startTransaction: modalManager.startTransaction,
          endTransaction: modalManager.endTransaction,
          stateController,
        });
      },
    };

    return props;
    // eslint-disable-next-line
  }, [options, transactionState, state]);

  const {
    modalStyle,
    backCoverStyle,
  }: {
    modalStyle: React.CSSProperties;
    backCoverStyle: React.CSSProperties;
  } = useMemo(() => {
    const {
      backCoverColor,
      backCoverOpacity,
      duration,
      transitionOptions,
      position: rawPosition,
    } = options;

    const position =
      typeof rawPosition === "function" ? rawPosition(breakPoint) : rawPosition;

    const backCoverPosition = modalManager.getCurrentModalPosition(
      lifecycleState,
      MODAL_POSITION.backCover
    );
    const modalPosition = modalManager.getCurrentModalPosition(
      lifecycleState,
      position
    );
    const transition = modalManager.getModalTrainsition(
      duration,
      transitionOptions
    );
    const isActiveState = lifecycleState === MODAL_LIFECYCLE_STATE.active;

    return {
      modalStyle: {
        pointerEvents: isActiveState ? "auto" : "none",
        ...transition,
        ...modalPosition,
      },
      backCoverStyle: {
        cursor:
          isActiveState && options.backCoverConfirm !== null
            ? "pointer"
            : "default",
        ...transition,
        ...backCoverPosition,
        background:
          (isActiveState && backCoverColor) || backCoverPosition.background,
        opacity:
          (isActiveState && backCoverOpacity) || backCoverPosition.opacity,
      },
    };
  }, [options, modalManager, breakPoint, lifecycleState]);

  const onCloseModal = () => {
    if (
      transactionState !== MODAL_TRANSACTION_STATE.idle ||
      backCoverConfirm === null
    ) {
      return;
    }

    modalProps.action(backCoverConfirm);
  };

  useEffect(() => {
    const listener = (modalState: ModalState) => {
      setState(modalState);
    };

    stateManager.subscribe(listener);

    return () => {
      stateManager.unSubscribe(listener);
    };
  }, [stateManager]);

  useEffect(() => {
    let asyncOpenModal: NodeJS.Timeout | null = null;

    if (setTimeout) {
      asyncOpenModal = setTimeout(() => {
        stateManager.lifecycleState = MODAL_LIFECYCLE_STATE.active;
        stateManager.notify();
      }, 10);
    } else {
      stateManager.lifecycleState = MODAL_LIFECYCLE_STATE.active;
      stateManager.notify();
    }

    return () => {
      if (clearTimeout) {
        asyncOpenModal && clearTimeout(asyncOpenModal);
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (lifecycleState === MODAL_LIFECYCLE_STATE.active) {
      return;
    }

    if (lifecycleState === MODAL_LIFECYCLE_STATE.final) {
      options.closeModal(stateManager.endCallback, stateManager.confirm);
    }

    if (lifecycleState === MODAL_LIFECYCLE_STATE.initial) {
      const { duration } = options;

      modalManager.call(delay, duration ?? 0);
    }
    // eslint-disable-next-line
  }, [lifecycleState]);

  useEffect(() => {
    if (transactionState === "idle" && isClose) {
      modalProps.action(backCoverConfirm);
    }
    // eslint-disable-next-line
  }, [isClose, transactionState]);

  return (
    <div className="modalWrapper-r">
      <button
        className={`closeModalCover-r ${isActive ? "" : "close-r"}`}
        style={backCoverStyle}
        type="button"
        onClick={onCloseModal}
      >
        {" "}
      </button>
      <div className="modalContentContainer-r">
        <div className="modalContent-r" style={modalStyle}>
          <ModalContext.Provider value={modalProps}>
            <Component {...modalProps} />
          </ModalContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default Modal;
