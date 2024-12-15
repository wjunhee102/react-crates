import {
  useState,
  useRef,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  FocusEvent,
  useMemo,
  useCallback,
} from "react";
import { Modal } from "../../services";
import { ModalState } from "../../types";
import { ModalComponentPropsContext } from "../../hooks/useModalComponentProps";
import { hideOthers } from "../../utils/ariaHidden";

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
  const [state, setState] = useState(modal.state);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const focusableElements = useRef<FocusableElements>({
    first: null,
    last: null,
    elements: [],
    index: 0,
  });

  const {
    component: Component,
    componentProps,
    backCoverStyle,
    modalClassName,
    modalStyle,
    isActive,
    isOpened,
    isEscKeyActive,
    label,
    actionState,
    role,
  } = state;

  const focusModal = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (
        isOpened &&
        modalContentRef.current &&
        !modalContentRef.current.contains(document.activeElement)
      ) {
        event.preventDefault();
        modalContentRef.current && modalContentRef.current.focus();
      }
    },
    [isOpened]
  );

  const { actionBackCover, actionToEsc, disableOutsideFocus, focusBackCover } =
    useMemo(
      () => ({
        actionBackCover(event: MouseEvent<HTMLButtonElement>) {
          if (modal.options.backCoverConfirm === null || event.detail === 0) {
            return;
          }

          modal.action(modal.options.backCoverConfirm);
        },
        actionToEsc(event: KeyboardEvent<HTMLDivElement>) {
          if (
            event.key !== "Escape" ||
            modal.options.backCoverConfirm === null ||
            !isEscKeyActive
          ) {
            return;
          }

          isEscKeyActive && modal.action(modal.options.backCoverConfirm);
        },
        disableOutsideFocus(event: KeyboardEvent<HTMLDivElement>) {
          if (event.key === "Escape") {
            event.preventDefault();
          }

          if (event.key !== "Tab") {
            return;
          }

          event.preventDefault();

          if (!modalContentRef.current) {
            return;
          }

          if (
            focusableElements.current.first === null ||
            focusableElements.current.last === null
          ) {
            modalContentRef.current.focus();

            return;
          }

          if (
            event.target === focusableElements.current.first &&
            event.shiftKey
          ) {
            focusableElements.current.last.focus();
            focusableElements.current = {
              ...focusableElements.current,
              index: focusableElements.current.elements.length - 1,
            };

            return;
          }

          if (
            event.target === focusableElements.current.last &&
            !event.shiftKey
          ) {
            focusableElements.current.first.focus();
            focusableElements.current = {
              ...focusableElements.current,
              index: 0,
            };

            return;
          }

          focusableElements.current = {
            ...focusableElements.current,
            index: focusableElements.current.index + 1,
          };

          const targetElement =
            focusableElements.current.elements[focusableElements.current.index];

          if (!targetElement) {
            focusableElements.current = {
              ...focusableElements.current,
              index: 0,
            };
            modalContentRef.current.focus();

            return;
          }

          targetElement.focus();
        },
        focusBackCover() {
          modalContentRef.current && modalContentRef.current.focus();
        },
      }),
      []
    );

  const focusModalContent = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!isOpened) {
        event.preventDefault();
        modalRef.current && modalRef.current.focus();

        return;
      }

      if (
        event.currentTarget.contains(event.target) &&
        event.currentTarget !== event.target
      ) {
        const focusableElementIndex = focusableElements
          .current
          .elements
          .findIndex((element) => element === event.target);

        if (focusableElementIndex !== -1) {
          if (focusableElementIndex !== focusableElements.current.index) {
            focusableElements.current.index = focusableElementIndex;
          }

          return;
        }
      }

      if (modal.onOpenAutoFocus) {
        modal.onOpenAutoFocus(event);

        return;
      }

      event.preventDefault();

      focusableElements.current.first &&
        focusableElements.current.first.focus();
    },
    [isOpened]
  );

  useEffect(() => {
    const listener = (modalState: ModalState) => {
      setState(modalState);
    };

    modal.init();
    modal.subscribe(listener);
    modal.componentRef = modalRef.current;

    return () => {
      modal.componentRef = null;
      modal.unsubscribe(listener);
    };
  }, []);

  useEffect(() => {
    modal.updateIsCurrent(isCurrent);

    if (isCurrent && modalRef.current) {
      return hideOthers(modalRef.current);
    }
  }, [isCurrent]);

  useEffect(() => {
    if (modalContentRef.current) {
      focusableElements.current = setFocusableElements(modalContentRef.current);
    }

    if (
      isCurrent &&
      isOpened &&
      modalContentRef.current &&
      !modalContentRef.current.contains(document.activeElement)
    ) {
      modalContentRef.current && modalContentRef.current.focus();
    }
  }, [isOpened, actionState, Component]);

  useEffect(() => {
    modal.setBreakPoint(breakPoint);
  }, [breakPoint]);

  return (
    <div
      tabIndex={-1}
      ref={modalRef}
      aria-label={label}
      aria-labelledby={label}
      role={role}
      aria-hidden={isCurrent ? "false" : "true"}
      aria-modal="true"
      className="modalWrapper_rm"
      onFocus={focusModal}
      onKeyDown={disableOutsideFocus}
    >
      <button
        className={`closeModalCover_rm ${isActive ? "" : "close_rm"}`}
        style={backCoverStyle}
        type="button"
        onClick={actionBackCover}
        onFocus={focusBackCover}
      />
      <div className="modalContentContainer_rm">
        <div
          tabIndex={-1}
          ref={modalContentRef}
          className={`modalContent_rm ${modalClassName || ""}`}
          style={modalStyle}
          onKeyUp={actionToEsc}
          onFocus={focusModalContent}
        >
          <ModalComponentPropsContext.Provider value={componentProps}>
            <Component {...componentProps} />
          </ModalComponentPropsContext.Provider>
        </div>
      </div>
    </div>
  );
};

interface FocusableElements {
  first: HTMLElement | null;
  last: HTMLElement | null;
  elements: HTMLElement[];
  index: number;
}

function setFocusableElements(targetDom: HTMLDivElement): FocusableElements {
  const focusableElements: FocusableElements = {
    first: null,
    last: null,
    elements: [],
    index: 0,
  };
  const elements = targetDom.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  if (elements.length > 0) {
    const first = elements[0];
    const last = elements[elements.length - 1];

    if (first instanceof HTMLElement) {
      focusableElements.first = first;
    }

    if (last instanceof HTMLElement) {
      focusableElements.last = last;
    }

    focusableElements.elements = Array.from(elements).filter(
      (element) => element instanceof HTMLElement
    ) as HTMLElement[];
  }

  return focusableElements;
}

export default ModalComponentProvider;
