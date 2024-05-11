import { generateModal } from "./generate";
import { ModalManager } from "./services";

describe("generateModal", () => {
  const testComponent = jest.fn();
  const anotherComponent = jest.fn();
  const testModal = {
    component: testComponent,
    defaultOptions: {
      payload: "test"
    }
  }
  const anotherModal = {
    component: anotherComponent,
    defaultOptions: {
      payload: "another",
    }
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("올바르게 요소를 반환하는 지 확인", () => {
    const { modalCtrl, modalManager, ModalProvider, DynamicModal, useIsOpenModal } = generateModal();

    expect(typeof ModalProvider).toBe("function");
    expect(typeof DynamicModal).toBe("function");
    expect(typeof useIsOpenModal).toBe("function");
    expect(modalManager).toBeInstanceOf(ModalManager);
    expect(modalCtrl.action).toBe(modalManager.action);
    expect(modalCtrl.open).toBe(modalManager.open);
    expect(modalCtrl.remove).toBe(modalManager.remove);
  });

  // intellisence도 확인.
  it("modalCtrl에 등록된 모달의 이름으로 메소드가 등록되어 있는지 확인", () => {
    const { modalCtrl, modalManager } = generateModal(
      {
        test: testModal,
        another: anotherModal,
      }
    );

    expect(typeof modalCtrl.test).toBe("function");
    expect(typeof modalCtrl.another).toBe("function");

    modalCtrl.test();
    modalCtrl.another();

    const modal1 = modalManager.getModalStack()[0];
    const modal2 = modalManager.getModalStack()[1];

    expect(modal1.component).toBe(testComponent);
    expect(modal2.component).toBe(anotherComponent);
  });

  // intellisence도 확인.
  it("position을 등록하면 올바르게 반환되는지 확인", () => {
    const testPosition = {
      open: {
        background: "white"
      },
      active: {
        background: "black"
      },
      close: {
        background: "pink"
      }
    };
    const { modalCtrl, modalManager } = generateModal({}, {
      position: {
        test: testPosition
      }
    });

    modalCtrl.open(testComponent, { position: "test" });

    const modal = modalManager.getModalStack()[0];
    expect(modal.options.position).toBe("test");
    expect(modalManager.getModalPosition("test")).toBe(testPosition);
  });
});
