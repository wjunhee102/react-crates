import { act, cleanup, render, screen } from "@testing-library/react";
import { ModalManager } from "../../services";
import setModalProvider from "./ModalProvider";
import { delay } from "../../utils";

describe("ModalProvider", () => {
  const modalManager = new ModalManager([], { duration: 0 });
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

describe("ModalProvider scrolling block", () => {
  const modalManager = new ModalManager();
  const ModalProvider = setModalProvider(modalManager);

  it("disableScroll을 활성화 했을 때 scroll이 막히는지 확인", () => {
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

  it("disableScroll을 활성화 했을 때 scroll이 되는지 확인", () => {
    render(<ModalProvider disableScroll={false} />);

    act(() => {
      modalManager.open(<div>Test Modal</div>);
    });

    expect(document.body.style.width).toBe("");
    expect(document.body.style.height).toBe("");
    expect(document.body.style.overflow).toBe("");
  });
});
