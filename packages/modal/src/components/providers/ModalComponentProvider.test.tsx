import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import ModalComponentProvider from "./ModalComponentProvider";
import { Modal } from "../../services/modal";
import ModalManager from "../../services/modalManager";
import setModalProvider from "./ModalProvider";
import { ModalConfirmType, ModalMiddlewareProps } from "../../types";
import { delay } from "../../utils";

describe("ModalComponentProvider", () => {
  const modalManager = new ModalManager();
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
        middleware: async (props: ModalMiddlewareProps) => {
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
  const ModalProvider = setModalProvider(modalManager);

  it("handles Enter and Escape key events", async () => {
    render(<ModalComponentProvider modal={modal} breakPoint={768} isCurrent />);

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    await act(async () => {
      await delay(0);

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

  it("handles backCover Click events", async () => {
    await render(
      <ModalComponentProvider modal={modal} breakPoint={768} isCurrent />
    );

    await act(async () => {
      await delay(0);

      const backCover = screen.getByRole("button");

      expect(document.activeElement).toBe(backCover);

      // keyboard 이벤트를 막았기 때문에 detail에 값을 주어 click임을 알려주기 위함.
      fireEvent.click(backCover, { detail: 1 });
    });

    expect(modal.confirm).toBe("test");
  });

  it("renders the modal content and handles focus correctly", async () => {
    const { unmount } = render(<ModalProvider />);

    await act(async () => {
      modalManager.open(<div>Modal Content1</div>);
      modalManager.open(<div>Modal Content2</div>);

      await modalManager.action();
    });

    expect(screen.queryByText("Modal Content2")).toBeNull();
    expect(screen.getByText("Modal Content1")).toBeInTheDocument();

    await act(async () => {
      const backCover = screen.getByRole("button");

      expect(document.activeElement).toBe(backCover);
    });

    act(() => {
      modalManager.remove("clear");
    });

    unmount();
  });
});
