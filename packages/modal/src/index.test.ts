import { generateModal } from "./generate";

describe("generateModal", () => {
  it("올바르게 요소를 반환하는 지 확인", () => {
    const { modalCtrl } = generateModal(
      {
        test: {
          component: () => null,
          defaultOptions: {
            payload: "바보",
          },
        },
        바보: {
          component: () => null,
          defaultOptions: {},
        },
      },
      {
        position: {
          test: {
            open: {},
            active: {},
            close: {},
          },
        },
      }
    );

    expect(modalCtrl).toBeDefined();
    expect(typeof modalCtrl.test).toBe("function");
    expect(typeof modalCtrl.바보).toBe("function");

    // 가정: open 함수가 모달 ID를 반환하도록 설정되어 있음
    const modalId = modalCtrl.test({
      payload: "s",
      position: "bottom-bottom-bottom",
    });
    expect(typeof modalId).toBe("number");
  });

  it("modalCtrl에 등록된 모달의 이름으로 메소드가 등록되어 있는지 확인", () => {
    const { modalCtrl } = generateModal(
      {
        test: {
          component: () => null,
          defaultOptions: {
            payload: "바보",
          },
        },
        바보: {
          component: () => null,
          defaultOptions: {},
        },
      },
      {
        position: {
          test: {
            open: {},
            active: {},
            close: {},
          },
        },
      }
    );

    expect(modalCtrl).toBeDefined();
    expect(typeof modalCtrl.test).toBe("function");
    expect(typeof modalCtrl.바보).toBe("function");
  });
});
