import { waitFor } from "@testing-library/react";
import { delay } from "../utils";
import ModalManager from "./modalManager";

describe("ModalManager", () => {
  let modalManager: ModalManager = new ModalManager();;

  beforeEach(() => {
    modalManager = new ModalManager([
      { name: "test", component: () => null },
      { name: "another", component: () => null }
    ], {
      stateResponsiveComponent: false
    });
  });

  afterEach(() => {
    modalManager.clearModalStack();
  });

  it("modal component seed를 추가하고 정확하게 검색하는지 확인", () => {

    modalManager.open("test");

    const modalId = modalManager.open("another");

    expect(modalManager.getModalStack().length).toBe(2);
    expect(modalManager.getModalComponentSeed("another")).toBeDefined();
    expect(modalId).toBe(2);
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

  it("should edit modal options correctly", () => {
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

    expect(modalManager.getCurrentModalPosition("open", "test").background).toBe("white");
    expect(modalManager.getCurrentModalPosition("active", "test").background).toBe("black");
    expect(modalManager.getCurrentModalPosition("close", "test").background).toBe("pink");
    expect(modalManager.getCurrentModalPosition("active", "test-another").background).toBe("blue");
    expect(modalManager.getCurrentModalPosition("close", "test-test-another").background).toBe("red");
  });

});
