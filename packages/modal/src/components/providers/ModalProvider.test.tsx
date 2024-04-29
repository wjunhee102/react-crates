import { act, cleanup, render, screen } from "@testing-library/react";
import ModalManager from "../../services/modalManager";
import setModalProvider from "./ModalProvider";

describe("ModalProvider", () => {
  const modalManager = new ModalManager();
  const ModalProvider = setModalProvider(modalManager);

  beforeEach(() => {
    render(<ModalProvider />);
  });

  afterEach(() => {
    act(() => {
      modalManager.remove("clear");
    });

    cleanup();
  });

  it("renders without crashing", () => {
    expect(document.querySelector(".modalProvider_rm")).not.toBeNull();
  });

  it("renders modal", async () => {
    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("modal open and clear correctly", () => {
    act(() => {
      modalManager.open(<div>Test Modal1</div>);
      modalManager.open(<div>Test Modal2</div>);
      modalManager.open(<div>Test Modal3</div>);
    });

    expect(screen.getByText("Test Modal1")).toBeInTheDocument();

    act(() => {
      modalManager.remove(modalManager.getModalStack()[1].id);
    });

    expect(screen.queryByText("Test Modal2")).toBeNull();

    act(() => {
      modalManager.remove("clear");
    });

    expect(screen.queryByText("Test Modal1")).toBeNull();
    expect(screen.queryByText("Test Modal3")).toBeNull();
  });
});

describe("ModalProvider scrolling block", () => {
  const modalManager = new ModalManager();
  const ModalProvider = setModalProvider(modalManager);

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
      modalManager.remove();
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
