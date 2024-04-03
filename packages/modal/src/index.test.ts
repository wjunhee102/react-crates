import ModalManager from "./services/modalManager";
import { generateModalSuite } from './generate';

describe("ModalManager class", () => {
  let modalManager: ModalManager;
  const mockComponent = jest.fn();

  beforeEach(() => {
    modalManager = new ModalManager();
    modalManager.setModalComponent({
      name: "mockType",
      component: mockComponent,
    });
  });

  test("open should push new modal fiber", () => {
    const mockOptions = { duration: 300 };

    modalManager.open("mockType", mockOptions);

    const modalFiberList = modalManager.getModalStack();

    expect(modalFiberList.length).toBe(1);
    expect(modalFiberList[0].name).toBe("mockType");
    expect(modalFiberList[0].component).toBe(mockComponent);
    expect(modalFiberList[0].options.duration).toBe(mockOptions.duration);
  });

  test("close should pop modal fiber", () => {
    const mockOptions = { duration: 300 };

    modalManager.open("mockType", mockOptions);
    modalManager.remove();

    expect(modalManager.getModalStack().length).toBe(0);
  });

});

describe('generateModalSuite', () => {
  it('should correctly initialize modal controllers', () => {
    const { modalCtrl } = generateModalSuite({
      test: {
        component: () => null,
        defaultOptions: {
          payload: "바보"
        }
      },
      바보: {
        component: () => null,
        defaultOptions: {}
      }
    }, {
      position: {
        test: {
          open: {},
          active: {},
          close: {}
        }
      }
    });

    expect(modalCtrl).toBeDefined();
    expect(typeof modalCtrl.test).toBe('function');
    expect(typeof modalCtrl.바보).toBe('function');

    // 가정: open 함수가 모달 ID를 반환하도록 설정되어 있음
    const modalId = modalCtrl.test({
      payload: "s",
      position: "center-backCover-bottom",
    });
    expect(typeof modalId).toBe('number');
  });

  it('should allow extending modal suite with new options and modal components', () => {
    const { extendModalSuite } = generateModalSuite({}, {});

    const ctrl = extendModalSuite({
      test: {
        component: () => null,
        defaultOptions: {
          payload: 0
        }
      }
    }, {
      position: {
        test: {
          open: {},
          active: {},
          close: {}
        }
      }
    });

    // 가정: open 함수가 모달 ID를 반환하도록 설정되어 있음
    const newModalId = ctrl.test({
      payload: 1,
      position: "test"
    });
    expect(typeof newModalId).toBe('number');
  });
});
