import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { ModalManager } from "../../services";
import setModalProvider from "./ModalProvider";
import { delay } from "../../utils";
import { MODAL_TRANSACTION_STATE } from "../../contants";

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

  it("disableInteraction을 활성화 했을 때 interaction이 막히는지 확인", async () => {
    act(() => {
      global.innerHeight = 1000;
      // global.dispatchEvent(new Event("resize"));
    });

    const { unmount } = render(<ModalProvider disableInteraction={true} />);

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.pointerEvents).toBe("");

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe(
        MODAL_TRANSACTION_STATE.idle
      );
    });

    expect(document.body.style.width).toBe("100vw");
    // TO-DO
    // 테스트를 확인해야 함.
    //expect(document.body.style.height).toBe("calc(var(--vh, 1vh) * 100)");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.pointerEvents).toBe("none");

    act(() => {
      modalManager.remove();
    });

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.pointerEvents).toBe("");

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

  it("ModalProvider z-index 확인", () => {
    render(<ModalProvider disableInteraction={false} />);

    expect((() => {
      const modalProvider = document.querySelector(".modalProvider_rm");

      if (!modalProvider) {
        return null;
      }

      const style = getComputedStyle(modalProvider);

      return style.zIndex;
    })()).toBe("50");

    act(() => {
      modalManager.open(<div>Test Modal</div>, {
        zIndex: 100
      });
    });

    expect((() => {
      const modalProvider = document.querySelector(".modalProvider_rm");

      if (!modalProvider) {
        return null;
      }

      const style = getComputedStyle(modalProvider);

      return style.zIndex;
    })()).toBe("100");

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });


    expect((() => {
      const modalProvider = document.querySelector(".modalProvider_rm");

      if (!modalProvider) {
        return null;
      }

      const style = getComputedStyle(modalProvider);

      return style.zIndex;
    })()).toBe("100");

    act(() => {
      modalManager.remove();
      modalManager.remove();
    });

    expect((() => {
      const modalProvider = document.querySelector(".modalProvider_rm");

      if (!modalProvider) {
        return null;
      }

      const style = getComputedStyle(modalProvider);

      return style.zIndex;
    })()).toBe("50");
  });
});
