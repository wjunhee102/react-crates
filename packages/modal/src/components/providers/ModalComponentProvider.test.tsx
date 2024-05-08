import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import ModalComponentProvider from "./ModalComponentProvider";
import { ModalManager, Modal } from "../../services";
import setModalProvider from "./ModalProvider";
import { ModalConfirmType } from "../../types";

describe("ModalComponentProvider", () => {
  const modalManager = new ModalManager();
  const ModalProvider = setModalProvider(modalManager);
  const modal = new Modal(
    {
      id: 1,
      modalKey: null,
      name: "modal",
      component: () => <div>Modal Content</div>,
      options: {
        closeModal: async (
          callback?: (confirm?: ModalConfirmType) => void,
          confirm?: ModalConfirmType
        ) => {
          callback && callback(confirm);
          return false;
        },
        middleware: async () => {
          return false;
        },
        escKeyActive: true,
        backCoverConfirm: "test",
        action: () => {},
      },
    },
    modalManager
  );

  afterEach(() => {
    act(() => {
      modalManager.remove("clear");
    });
  });

  it("keyboard option이 활성화 되어있을 때, keyboard action이 실행되는지 확인", async () => {
    const { container } = render(
      <ModalComponentProvider modal={modal} breakPoint={768} isCurrent />
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    await act(async () => {
      const modalContent = container.querySelector("div.modalContent_rm");

      if (!modalContent) {
        throw new Error("not modal content");
      }

      fireEvent.keyUp(modalContent, { key: "Esc" });
    });

    expect(modal.confirm).toBe("test");
  });

  it("keyboard option이 비활성화 되어있을 때, keyboard action이 실행되지 않는지 확인", async () => {
    let disableKeyboardActionModal = new Modal(
      {
        id: 1,
        modalKey: null,
        name: "modal",
        component: () => <div>Modal Content</div>,
        options: {
          closeModal: async (
            callback?: (confirm?: ModalConfirmType) => void,
            confirm?: ModalConfirmType
          ) => {
            callback && callback(confirm);
            return false;
          },
          middleware: async () => {
            return false;
          },
          escKeyActive: false,
        },
      },
      modalManager
    );

    const { container } = render(
      <ModalComponentProvider
        modal={disableKeyboardActionModal}
        breakPoint={768}
        isCurrent
      />
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    await act(async () => {
      const modalContent = container.querySelector("div.modalContent_rm");

      if (!modalContent) {
        throw new Error("not modal content");
      }

      fireEvent.keyUp(modalContent, { key: "Esc" });
    });

    expect(disableKeyboardActionModal.confirm).toBeUndefined();
  });

  it("BackCover를 클릭하면 modal의 action이 실행되는지 확인", async () => {
    render(<ModalComponentProvider modal={modal} breakPoint={768} isCurrent />);

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    await act(async () => {
      const backCover = screen.getByRole("button");

      // keyboard 이벤트를 막았기 때문에 detail에 값을 주어 click임을 알려주기 위함.
      fireEvent.click(backCover, { detail: 1 });
    });

    expect(modal.confirm).toBe("test");
  });

  it("모달이 닫혔을 때 다음 모달로 포커스가 맞춰지는지 확인", async () => {
    const { getByRole } = render(<ModalProvider />);

    await act(async () => {
      modalManager.open(<div>Modal Content1</div>);
      modalManager.open(<div>Modal Content2</div>);

      await modalManager.action();
    });

    expect(screen.queryByText("Modal Content2")).toBeNull();
    expect(screen.getByText("Modal Content1")).toBeInTheDocument();

    await waitFor(async () => {
      expect(document.activeElement).toBe(
        document.querySelector("div.modalContent_rm")
      );
    });

    await waitFor(() => {
      expect(getByRole("button")).toHaveStyle("cursor: pointer");
    });
  });

  it("모달이 열렸을 때 모달을 제외하고 모든 요소가 aria-hidden=true로 변경", async () => {
    const { container } = render(
      <>
        <ModalProvider />
        <div id="test" />
      </>
    );

    act(() => {
      modalManager.open(<div>Modal Content1</div>);
      modalManager.open(<div>Modal Content2</div>);
    });

    const test = container.querySelector("#test");
    const modals = container.querySelectorAll(".modalWrapper_rm");
    const modal1 = modals[0];
    const modal2 = modals[modals.length - 1];

    if (!test || !modal1 || !modal2) {
      throw new Error("not rendering");
    }

    expect(test.getAttribute("aria-hidden")).toBe("true");
    expect(modal1.getAttribute("aria-hidden")).toBe("true");
    expect(modal2.getAttribute("aria-hidden")).toBe("false");

    await waitFor(() => {
      modalManager.action();
      expect(screen.queryByText("Modal Content2")).toBeNull();
      expect(modal1.getAttribute("aria-hidden")).toBe("false");
    });
  });
});
