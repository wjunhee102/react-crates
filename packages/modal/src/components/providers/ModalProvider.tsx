import {
  forwardRef,
  KeyboardEvent,
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModalManager, Modal } from "../../services";
import { ModalManagerState, ModalTransactionState } from "../../types";
import ModalComponentProvider from "./ModalComponentProvider";

import "./modalProvider.css";

let overflow = "";
let height = "";
let width = "";
let pointerEvents = "";

interface ModalProviderCoreProps extends ModalProviderProps {
  modalManager: ModalManager;
}

const ModalProviderCore = ({
  modalManager,
  disableInteraction = true,
  children,
}: ModalProviderCoreProps) => {
  const [
    { modalStack, isOpen, transactionState, breakPoint, currentModalId, zIndex },
    setModalManagerState,
  ] = useState<ModalManagerState>(modalManager.getState());

  const modalProviderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalManager.subscribe(setModalManagerState);

    const originVh = document.documentElement.style.getPropertyValue("--vh");

    const syncViewportAndBreakpoints = () => {
      modalManager.setBreakPoint(window.innerWidth);
      // TO-DO
      // 테스트를 확인해야 함.
      // 주소 표시줄이 보이거나 숨겨질 때 뷰포트 높이 조정
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    syncViewportAndBreakpoints();
    window.addEventListener("resize", syncViewportAndBreakpoints);

    return () => {
      modalManager.unsubscribe(setModalManagerState);
      modalManager.remove("clear");
      document.documentElement.style.setProperty("--vh", originVh);
      window.removeEventListener("resize", syncViewportAndBreakpoints);
    };
  }, []);

  useEffect(() => {
    if (isOpen && disableInteraction) {
      overflow = document.body.style.overflow;
      height = document.body.style.height;
      width = document.body.style.width;
      pointerEvents = document.body.style.pointerEvents;

      document.body.style.overflow = "hidden";
      document.body.style.height = "calc(var(--vh, 1vh) * 100)";
      document.body.style.width = "100vw";
      document.body.style.pointerEvents = "none";

      return () => {
        document.body.style.overflow = overflow;
        document.body.style.height = height;
        document.body.style.width = width;
        document.body.style.pointerEvents = pointerEvents;

        overflow = "";
        height = "";
        width = "";
        pointerEvents = "";
      };
    }

    if (disableInteraction) {
      document.body.style.overflow = overflow;
      document.body.style.height = height;
      document.body.style.width = width;
      document.body.style.pointerEvents = pointerEvents;

      return () => {
        overflow = "";
        height = "";
        width = "";
        pointerEvents = "";
      };
    }
  }, [isOpen]);

  const disableKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (
        modalProviderRef.current &&
        modalProviderRef.current.contains(document.activeElement)
      ) {
        return;
      }

      event.preventDefault();
    },
    [transactionState]
  );

  useEffect(() => {
    if (currentModalId > 0) {
      const currentModalRef = modalStack[modalStack.length - 1].componentRef;

      if (currentModalRef) {
        currentModalRef.focus();

        return;
      }

      if (modalProviderRef.current) {
        modalProviderRef.current.focus();
      }
    }
  }, [currentModalId]);

  const props = {
    isOpen,
    zIndex,
    modalStack,
    breakPoint,
    transactionState,
    currentModalId,
    onKeyDown: disableKeyDown,
    ref: modalProviderRef,
  };

  if (children) {
    return (
      <>
        {children}
        <ModalProviderView {...props} />
      </>
    );
  }

  return <ModalProviderView {...props} />;
};

interface ModalProviderViewProps {
  isOpen: boolean;
  zIndex: number;
  modalStack: Modal[];
  breakPoint: number;
  transactionState: ModalTransactionState;
  currentModalId: number;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

const ModalProviderView = forwardRef<HTMLDivElement, ModalProviderViewProps>(
  ({ isOpen, zIndex, modalStack, breakPoint, currentModalId, onKeyDown }, ref) => (
    <div
      ref={ref}
      tabIndex={-1}
      className={`modalProvider_rm ${isOpen ? "open_rm" : ""}`}
      style={{
        zIndex
      }}
      onKeyDown={onKeyDown}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {modalStack.map((modal) => (
          <ModalComponentProvider
            key={modal.id}
            breakPoint={breakPoint}
            modal={modal}
            isCurrent={modal.id === currentModalId}
          />
        ))}
      </div>
    </div>
  )
);

export interface ModalProviderProps {
  disableInteraction?: boolean;
  children?: ReactNode;
}

function setModalProvider(modalManager: ModalManager) {
  return function ModalProvider(props: ModalProviderProps) {
    return <ModalProviderCore modalManager={modalManager} {...props} />;
  };
}

export default setModalProvider;
