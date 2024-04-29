import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import ModalComponentProvider from "./ModalComponentProvider";
import { Modal } from "../../services/modal";
import ModalManager from "../../services/modalManager";
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
        enterKeyActive: true,
        escKeyActive: true,
        backCoverConfirm: "test",
        action: () => {},
      },
    },
    modalManager
  );

  it("keyboard option이 활성화 되어있을 때, keyboard action이 실행되는지 확인", async () => {
    render(<ModalComponentProvider modal={modal} breakPoint={768} isCurrent />);

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    await act(async () => {
      const backCover = screen.getByRole("button");

      fireEvent.keyUp(backCover, { key: "Enter" });
    });

    expect(modal.confirm).toBeTruthy();

    await act(async () => {
      const backCover = screen.getByRole("button");

      fireEvent.keyUp(backCover, { key: "Esc" });
    });

    expect(modal.confirm).toBeFalsy();
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
          enterKeyActive: false,
          escKeyActive: false,
        },
      },
      modalManager
    );

    render(
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
      const backCover = screen.getByRole("button");

      fireEvent.keyUp(backCover, { key: "Enter" });
    });

    expect(disableKeyboardActionModal.confirm).toBeUndefined();

    await act(async () => {
      const backCover = screen.getByRole("button");

      fireEvent.keyUp(backCover, { key: "Esc" });
    });

    expect(disableKeyboardActionModal.confirm).toBeUndefined();
  });

  it("BackCover를 클릭하면 modal의 action이 실행되는지 확인", async () => {
    await render(
      <ModalComponentProvider modal={modal} breakPoint={768} isCurrent />
    );

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    await act(async () => {
      const backCover = screen.getByRole("button");

      expect(document.activeElement).toBe(backCover);

      // keyboard 이벤트를 막았기 때문에 detail에 값을 주어 click임을 알려주기 위함.
      fireEvent.click(backCover, { detail: 1 });
    });

    expect(modal.confirm).toBe("test");
  });

  it("모달이 닫혔을 때 다음 모달로 포커스가 맞춰지는지 확인", async () => {
    const { unmount, getByRole } = render(<ModalProvider />);

    await act(async () => {
      modalManager.open(<div>Modal Content1</div>);
      modalManager.open(<div>Modal Content2</div>);

      await modalManager.action();
    });

    expect(screen.queryByText("Modal Content2")).toBeNull();
    expect(screen.getByText("Modal Content1")).toBeInTheDocument();

    await act(async () => {
      const backCover = getByRole("button");

      expect(document.activeElement).toBe(backCover);
    });

    await waitFor(() => {
      expect(getByRole("button")).toHaveStyle("cursor: pointer");
    });

    act(() => {
      modalManager.remove("clear");
    });

    unmount();
  });
});
