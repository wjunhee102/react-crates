import { act } from "react-dom/test-utils";
import { ModalManager } from "../../services";
import { ModalComponentSeed, ModalConfirmType } from "../../types";
import setModalProvider from "../providers/ModalProvider";
import { modalCollection } from "./ModalCollection";
import { fireEvent, render, waitFor } from "@testing-library/react";

describe("ModalCollection", () => {
  const modalManager = new ModalManager(
    Object.entries(modalCollection).reduce((acc, [key, value]) => {
      acc.push({
        name: key,
        component: value.component,
        defaultOptions: value.defaultOptions,
      });

      return acc;
    }, [] as ModalComponentSeed[]),
    {
      duration: 0,
    }
  );
  const ModalProvider = setModalProvider(modalManager);

  afterEach(() => {
    act(() => {
      modalManager.remove("clear");
    });
    jest.clearAllMocks();
  });

  it("ModalCollection이 올바르게 렌더링 되는지 확인", () => {
    const { getByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open("alert", "alertModal");
      modalManager.open("confirm", "confirmModal");
      modalManager.open("prompt", "promptModal");
    });

    expect(getByText("alertModal")).toBeInTheDocument();
    expect(getByText("confirmModal")).toBeInTheDocument();
    expect(getByText("promptModal")).toBeInTheDocument();
  });

  it("ModalCollection.Alert action 확인", async () => {
    const action = jest.fn((confirm?: ModalConfirmType) => {
      return confirm;
    });
    const { getByText, queryByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open("alert", action);
    });

    const actionTrigger = getByText("Confirm");

    await waitFor(() => {
      fireEvent.click(actionTrigger);
      expect(queryByText("Alert")).toBeNull();
    });

    act(() => {
      modalManager.open("alert", action);
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    act(() => {
      const modalContents = document.activeElement;

      if (!modalContents) {
        throw new Error("not render");
      }

      fireEvent.keyUp(modalContents, { key: "Esc" });
    });

    await waitFor(() => {
      expect(queryByText("Alert")).toBeNull();
    });

    expect(action).toHaveBeenCalledTimes(2);
    expect(action.mock.results[0].value).toBe(true);
    expect(action.mock.results[1].value).toBe(true);
  });

  it("ModalCollection.Confirm action 확인", async () => {
    const action = jest.fn((confirm?: ModalConfirmType) => {
      return confirm;
    });
    const { getByText, queryByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open("confirm", action);
    });

    const actionTriggerByCancel = getByText("Cancel");

    await waitFor(() => {
      fireEvent.click(actionTriggerByCancel);
      expect(queryByText("Confirm")).toBeNull();
    });

    act(() => {
      modalManager.open("confirm", {
        confirmContent: "confirm-trigger",
        action,
      });
    });

    const actionTriggerByConfirm = getByText("confirm-trigger");

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    act(() => {
      fireEvent.click(actionTriggerByConfirm);
    });

    await waitFor(() => {
      expect(queryByText("Confirm")).toBeNull();
    });

    act(() => {
      modalManager.open("confirm", action);
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    act(() => {
      const modalContents = document.activeElement;

      if (!modalContents) {
        throw new Error("not render");
      }

      fireEvent.keyUp(modalContents, { key: "Esc" });
    });

    await waitFor(() => {
      expect(queryByText("Confirm")).toBeNull();
    });

    expect(action).toHaveBeenCalledTimes(3);
    expect(action.mock.results[0].value).toBe(false);
    expect(action.mock.results[1].value).toBe(true);
    expect(action.mock.results[2].value).toBe(false);
  });

  it("ModalCollection.Prompt", async () => {
    const action = jest.fn((confirm?: ModalConfirmType) => {
      return confirm;
    });
    const { getByRole, queryByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open("prompt", action);
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    const input = getByRole("textbox");

    act(() => {
      fireEvent.change(input, { target: { value: "test" } });
    });

    act(() => {
      fireEvent.keyUp(input, { key: "Enter" });
    });

    await waitFor(() => {
      expect(queryByText("Prompt")).toBeNull();
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.results[0].value).toBe("test");
  });
});
