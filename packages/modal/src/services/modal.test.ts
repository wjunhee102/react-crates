import { act } from "@testing-library/react";
import { Modal } from "./modal";
import { ModalManager } from "./modalManager";
import { createElement } from "react";

describe("Modal", () => {
  let modalManager: ModalManager;
  let modal: Modal;

  const testComponent = () => null;
  const pendingComponent = () => createElement("div", null, "pending");
  const successComponent = () => createElement("div", null, "success");
  const errorComponent = () => createElement("div", null, "error");

  beforeEach(() => {
    modalManager = new ModalManager([
      {
        name: "pending",
        component: pendingComponent,
      },
      {
        name: "success",
        component: successComponent,
      },
      {
        name: "error",
        component: errorComponent,
      }
    ]);
    modal = new Modal({
      id: 1,
      modalKey: "key1",
      name: "test",
      component: testComponent,
      options: {
        duration: 300,
        stateResponsiveComponent: true,
        escKeyActive: true,
        enterKeyActive: true,
        action: jest.fn(),
        closeModal: jest.fn(),
        middleware: async () => {
          return false;
        },
      }
    }, modalManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Modal 생성 및 초기 설정 확인", () => {
    expect(modal.id).toEqual(1);
    expect(modal.name).toEqual("test");
    expect(modal.isCurrent).toEqual(false);
    expect(modal.options.duration).toEqual(300);
  });

  it("Modal의 상태 변경 및 알림 리스너 호출 확인", () => {
    const listener = jest.fn();
    modal.subscribe(listener);
    modal.pending();

    act(() => {
      modal.active();
    });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(modal.getLifecycleState()).toEqual("active");
    expect(modal.getActionState()).toEqual("pending");
  });

  it("Modal의 생명주기 이벤트 처리 확인", () => {
    act(() => {
      modal.init();
      modal.success();
      modal.close();
    });

    expect(modal.getLifecycleState()).toEqual("close");
    expect(modal.getActionState()).toEqual("success");
    expect(modal.options.closeModal).toHaveBeenCalled();
  });

  it("edit으로 Modal의 options 및 component 변경 확인", () => {
    const newOptions = {
      title: "New Title",
      content: "Updated Content"
    };

    const newModalComponent = () => createElement("div", null, "New Content");

    act(() => {
      modal.edit({ component: newModalComponent, ...newOptions });
    });

    expect(modal.options.title).toEqual(newOptions.title);
    expect(modal.component).toBe(newModalComponent);
  });

  it("stateResponsive 활성화 상태에서 action state 변경시 component 변경 확인", () => {
    act(() => {
      modal.pending();
    });

    expect(modal.component).toBe(pendingComponent);

    act(() => {
      modal.success();
    });

    expect(modal.component).toBe(successComponent);

    act(() => {
      modal.error();
    });

    expect(modal.component).toBe(errorComponent);

    act(() => {
      modal.end();
    });

    expect(modal.component).toBe(testComponent);
  });

});
