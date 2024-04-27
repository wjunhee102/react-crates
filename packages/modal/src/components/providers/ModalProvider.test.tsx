import { act, render, screen } from "@testing-library/react";
import ModalManager from "../../services/modalManager";
import setModalProvider from "./ModalProvider";

describe("ModalProvider", () => {
  const modalManager = new ModalManager();
  const ModalProvider = setModalProvider(modalManager);

  it("renders without crashing", () => {
    render(<ModalProvider />);
    expect(document.querySelector(".modalProvider_rm")).not.toBeNull();
  });

  it("renders modal", async () => {
    render(<ModalProvider />);

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(screen.getByText("Test Modal")).toBeInTheDocument();

    act(() => {
      modalManager.close();
    });
  });

  it("modal open and clear correctly", () => {
    const { getByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open(<div>Test Modal1</div>);
      modalManager.open(<div>Test Modal2</div>);
      modalManager.open(<div>Test Modal3</div>);
    });

    expect(getByText("Test Modal1")).not.toBeNull();

    act(() => {
      modalManager.close("clear");
    });

    expect(screen.queryByText("Test Modal1")).toBeNull();
  });

  it("prevents scrolling when modal is open", () => {
    const { unmount } = render(<ModalProvider disableScroll={true} />);

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(document.body.style.width).toBe("100vw");
    expect(document.body.style.height).toBe("100vh");
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      modalManager.close();
    });

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    unmount();

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");
  });

  it("allows scrolling.", () => {
    render(<ModalProvider disableScroll={false} />);

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");
  });
});
