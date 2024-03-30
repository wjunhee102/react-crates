import ModalManager from "./services/modalManager";

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
