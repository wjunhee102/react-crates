import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { ModalManager } from "../../services";
import setModalProvider from "./ModalProvider";
import { delay } from "../../utils";

describe("ModalProvider", () => {
  const modalManager = new ModalManager([], {
    duration: 0,
    position: {
      test: {
        open: {
          className: "test",
        },
        active: {
          className: "test",
        },
        close: {
          className: "test",
        },
      },
    },
  });
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

  it("ModalProvider가 렌더링 되었는지 확인", () => {
    expect(document.querySelector(".modalProvider_rm")).not.toBeNull();
  });

  it("modal이 렌더링 되었는지 확인", async () => {
    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("modal을 오픈하고 제거 되는지 확인", () => {
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

  it("modal이 오픈 중일 때 action이 실행되지 않는지 확인", async () => {
    act(() => {
      modalManager.open(<div>Test Modal1</div>, { duration: 200 });
    });

    expect(screen.getByText("Test Modal1")).toBeInTheDocument();

    await act(async () => {
      const result = await modalManager.action();

      expect(result).toBeFalsy();
    });

    await act(async () => {
      await delay(200);

      const result = await modalManager.action();

      expect(result).toBeTruthy();
    });
  });
});

describe("ModalProvider interaction block", () => {
  const modalManager = new ModalManager([], {
    duration: 0,
    position: {
      test: {
        open: {},
        active: {
          className: "test",
        },
        close: {},
      },
    },
  });
  const ModalProvider = setModalProvider(modalManager);

  it("disableInteraction을 활성화 했을 때 interaction이 막히는지 확인", () => {
    const { unmount } = render(<ModalProvider disableInteraction={true} />);

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

  it("disableInteraction을 활성화 했을 때 interaction이 되는지 확인", () => {
    render(<ModalProvider disableInteraction={false} />);

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");
  });

  it("resize시 modal의 position이 변경되는 지 확인", async () => {
    act(() => {
      global.innerWidth = 1000;
      global.dispatchEvent(new Event("resize"));
    });

    const { getByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open(<div>Test Modal</div>, {
        position: (breakPoint) => (breakPoint > 480 ? "center" : "test"),
      });
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    await waitFor(() => {
      const modalContent = getByText("Test Modal").parentElement;
      expect(modalContent?.className.includes("test")).toBeFalsy();
    });

    act(() => {
      global.innerWidth = 480;
      global.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      const modalContent = getByText("Test Modal").parentElement;
      expect(modalContent?.className.includes("test")).toBeTruthy();
    });
  });
});
