import { waitFor } from "@testing-library/react";
import { delay } from "../utils";
import { ModalManager } from "./modalManager";
import { createElement } from "react";
import { ModalDispatchOptions, ModalManagerOptionsProps } from "../types";

describe("ModalManager", () => {
  let modalManager: ModalManager = new ModalManager();
  const testComponent = jest.fn();
  const anotherComponent = jest.fn();

  beforeEach(() => {
    modalManager = new ModalManager([
      { name: "test", component: testComponent },
      { name: "another", component: anotherComponent }
    ], {
      stateResponsiveComponent: false
    });
  });

  afterEach(() => {
    modalManager.clearModalStack();
    jest.clearAllMocks();
  });

  it("name에 따라 modal component를 정확하게 호출하는 지 확인", () => {
    const testModalOptions = { duration: 300 }

    modalManager.open("test", testModalOptions);

    const testModal = modalManager.getModalStack()[0];

    expect(testModal.name).toBe("test");
    expect(testModal.component).toBe(testComponent);
    expect(testModal.options.duration).toBe(testModalOptions.duration);
    expect(testModal.component).not.toBe(anotherComponent);
  });

  it("modal component seed를 추가하고 정확하게 검색하는지 확인", () => {
    modalManager.open("test");
    const modalId = modalManager.open("another");

    expect(modalId).toBe(2);
    expect(modalManager.getModalStack().length).toBe(2);
    expect(modalManager.getModalComponentSeed("another")).toBeDefined();

  });

  it("modal을 정확하게 제거하는지 확인", () => {
    modalManager.open("another");
    const modalId = modalManager.open("test");
    const initialCount = modalManager.getModalStack().length;

    modalManager.remove(modalId);

    expect(modalManager.getModalStack()[0].name).toBe("another");

    modalManager.remove("another");

    expect(modalManager.getModalStack().length).toBe(initialCount - 2);
  });

  it("modal을 edit이 정확하게 되는지 확인", () => {
    const modalId = modalManager.open("test", { content: "Hello World" });

    modalManager.edit(modalId, { content: "Updated Content" });

    const modal = modalManager.getModalStack()[0];
    expect(modal.options.content).toBe("Updated Content");
  });

  it("트랜잭션이 올바르게 처리되는지 확인", async () => {
    let result: boolean;

    modalManager.executeWithTransaction(async () => {
      await delay(100);
      result = true;
      return true;
    }, undefined);

    expect(modalManager.getTransactionState()).toBe("active");

    waitFor(async () => {
      expect(result).toBe(true);
    });

    waitFor(async () => {
      expect(modalManager.getTransactionState()).toBe("idle");
    });
  });

  it("상태 변화 시 리스너들에게 정확하게 알리는지 확인", () => {
    const listener = jest.fn();

    modalManager.subscribe(listener);
    modalManager.setBreakPoint(480);

    expect(listener).toHaveBeenCalled();
    expect(modalManager.getState().breakPoint).toBe(480);
  });

  it("modalManager의 defaultOptions이 적용되는지 확인", () => {
    modalManager.open("test");

    expect(modalManager.getModalStack()[0].options.stateResponsiveComponent).toBeFalsy();

    modalManager.remove();
    modalManager.setModalOptions({ stateResponsiveComponent: true });
    modalManager.open("test");

    expect(modalManager.getModalStack()[0].options.stateResponsiveComponent).toBeTruthy();
  });

  it("세팅된 position이 올바르게 반환되는지 확인", () => {
    modalManager.setModalOptions({
      position: {
        test: {
          open: {
            background: "white"
          },
          active: {
            background: "black"
          },
          close: {
            background: "pink"
          }
        },
        another: {
          open: {
            background: "purple"
          },
          active: {
            background: "blue"
          },
          close: {
            background: "red"
          }
        }
      }
    });

    const [testStyle1, currentPosition1] = modalManager.getCurrentModalPosition("active", "test-another");
    const [testStyle2, currentPosition2] = modalManager.getCurrentModalPosition("close", "test-test-another");

    expect(modalManager.getCurrentModalPosition("open", "test")[0].background).toBe("white");
    expect(modalManager.getCurrentModalPosition("active", "test")[0].background).toBe("black");
    expect(modalManager.getCurrentModalPosition("close", "test")[0].background).toBe("pink");
    expect(testStyle1.background).toBe("blue");
    expect(currentPosition1).toBe("another");
    expect(testStyle2.background).toBe("red");
    expect(currentPosition2).toBe("another");
  });

  it("open의 첫번째 인수가 ModalComponent | modalName을 올바르게 적용하는지 확인", () => {
    // modal name과 일치하지 않으면 modal이 open 되지 않음.
    modalManager.open("");
    expect(modalManager.getModalStack().length).toBe(0);

    modalManager.open("test");
    expect(modalManager.getModalStack()[0].component).toBe(testComponent);

    modalManager.open(testComponent);
    expect(modalManager.getModalStack()[1].component).toBe(testComponent);

    const element = createElement("div", null);
    modalManager.open(element);
    const modal = modalManager.getModalStack()[2];
    expect(modal.component(modal.state.componentProps)).toBe(element);
  });

  it("open에 두번째 인수가 content | action | dispatchOptions을 올바르게 적용하는지 확인", () => {
    modalManager.open("test", "content");
    expect(modalManager.getModalStack()[0].options.content).toBe("content");

    const action = jest.fn();
    modalManager.open("test", action);
    expect(modalManager.getModalStack()[1].options.action).toBe(action);

    modalManager.open("test", {
      payload: "payload"
    });
    expect(modalManager.getModalStack()[2].options.payload).toBe("payload");
  });

  it("dispatchOptions이 올바르게 적용되는지 확인", () => {
    const mockManagerOptions: ModalManagerOptionsProps = {
      transition: {
        transitionProperty: "notTransitionProperty",
        transitionTimingFunction: "notTransitionTimingFunction",
        transitionDelay: "notTransitionDelay"
      },
      duration: 200,
      backCoverColor: "notBackColor",
      backCoverOpacity: 0,
      stateResponsiveComponent: false
    }
    const mockDispatchOptions: ModalDispatchOptions<string> = {
      modalKey: "modalKey",
      action: jest.fn(),
      middleware: jest.fn(),
      backCoverConfirm: false,
      backCoverColor: "backCoverColor",
      backCoverOpacity: 0.9,
      escKeyActive: false,
      payload: "payload",
      closeDelay: 100,
      duration: 100,
      transitionOptions: {
        transitionProperty: "transitionProperty",
        transitionTimingFunction: "transitionTimingFunction",
        transitionDelay: "transitionDelay"
      },
      position: "position",
      stateResponsiveComponent: true,
      role: "role",
      label: "label",
      onOpenAutoFocus: jest.fn(),
      required: true
    }
    const testModalManager = new ModalManager([], mockManagerOptions);

    testModalManager.open(createElement("div", null));

    const modal1 = testModalManager.getModalStack()[0];

    expect(Object.keys(mockDispatchOptions).every(key =>
      modal1.options[key as keyof typeof modal1.options] !== mockDispatchOptions[key as keyof typeof mockDispatchOptions]
    )).toBeTruthy();

    testModalManager.remove();

    testModalManager.open(createElement("div", null), mockDispatchOptions);

    const modal2 = testModalManager.getModalStack()[0];

    expect(Object.keys(mockDispatchOptions).every(key =>
      modal2.options[key as keyof typeof modal2.options] === mockDispatchOptions[key as keyof typeof mockDispatchOptions]
    )).toBeTruthy();
  });

});
