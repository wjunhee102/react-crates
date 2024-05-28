import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { modalCollection } from "./components";
import { generateModal } from "./generate";
import { ModalComponentProps } from "./types";
import { ModalFC } from ".";
import { useModalComponentProps } from "./hooks/useModalComponentProps";
import { MODAL_TRANSACTION_STATE } from "./contants";

describe("modal", () => {
  const pendingComponent = jest.fn();
  const successComponent = jest.fn();
  const errorComponent = jest.fn();
  const {
    modalCtrl,
    ModalProvider,
    modalManager,
    DynamicModal,
    useIsOpenModal,
  } = generateModal(
    {
      ...modalCollection,
      pending: {
        component: pendingComponent,
      },
      success: {
        component: successComponent,
      },
      error: {
        component: errorComponent,
      },
    },
    {
      duration: 10,
    }
  );

  afterEach(() => {
    act(() => {
      modalManager.remove("clear");
    });
    jest.clearAllMocks();
  });

  it("modal이 open 될때 modal로 focus가 이동하는지 확인", () => {
    const { getByText } = render(
      <div>
        <ModalProvider />
        <button>test</button>
      </div>
    );
    const testButton = getByText("test");

    act(() => {
      testButton.focus();
      modalCtrl.alert();
    });

    const modalComponentDom = modalManager.getModalStack()[0].componentRef;

    if (!modalComponentDom) {
      throw Error("not render");
    }

    expect(getByText("Alert")).toBeInTheDocument();
    expect(testButton).not.toBe(document.activeElement);
    expect(modalComponentDom).toBe(document.activeElement);

    act(() => {
      fireEvent.keyDown(modalComponentDom, {
        key: "Tab",
      });
    });

    expect(modalComponentDom.contains(document.activeElement)).toBeTruthy();
  });

  it("stateResponsiveComponent 동작 확인", async () => {
    const { getByText, getByRole } = render(
      <div>
        <ModalProvider />
        <DynamicModal
          stateResponsiveComponent
          action={(_, { pending, success }) => {
            const modal = modalManager.getModalStack()[0];

            pending();
            expect(modal.component).toBe(pendingComponent);

            success({ component: "alert" });
            expect(modal.component).toBe(modalCollection.alert.component);
          }}
        >
          <DynamicModal.Trigger>trigger</DynamicModal.Trigger>
          <DynamicModal.Element>
            <div>
              <DynamicModal.Action>Confirm</DynamicModal.Action>
            </div>
          </DynamicModal.Element>
        </DynamicModal>
      </div>
    );

    act(() => {
      modalCtrl.confirm({
        title: "test",
        stateResponsiveComponent: true,
        action: (_, { pending, success, error, end }) => {
          const modal = modalManager.getModalStack()[0];

          pending();
          expect(modal.component).toBe(pendingComponent);

          error();
          expect(modal.component).toBe(errorComponent);

          end();
          expect(modal.component).toBe(modalCollection.confirm.component);

          success({ isAwaitingConfirm: true });
          return;
        },
      });
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe(
        MODAL_TRANSACTION_STATE.idle
      );
    });

    act(() => {
      const confirm = getByText("Confirm");
      fireEvent.click(confirm);
    });

    expect(modalManager.getModalStack()[0].component).toBe(successComponent);

    act(() => {
      modalManager.remove();
    });

    act(() => {
      const trigger = getByRole("button");
      fireEvent.click(trigger);
    });

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe(
        MODAL_TRANSACTION_STATE.idle
      );
    });

    await act(async () => {
      const confirm = getByText("Confirm");
      fireEvent.click(confirm);
    });
  });

  it("useIsOpenModal를 사용하여 modal이 open 됐을 때를 감지할 수 있는지 확인", () => {
    const TestComponent = () => {
      const isOpen = useIsOpenModal();

      return <div>{isOpen ? "open" : "close"}</div>;
    };

    const { getByText } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    expect(getByText("close")).toBeInTheDocument();

    act(() => {
      modalCtrl.alert();
    });

    expect(getByText("open")).toBeInTheDocument();

    act(() => {
      modalCtrl.remove();
    });

    expect(getByText("close")).toBeInTheDocument();
  });

  it("ModalFC와 useModalComponent를 이용하여 modal을 만들수 있는지 확인", async () => {
    const mockDispatchOptions: Omit<
      ModalComponentProps,
      "actionState" | "action"
    > = {
      title: "title",
      subTitle: "subTitle",
      content: "content",
      subContent: "subContent",
      confirmContent: "confirmContent",
      cancelContent: "cancelContent",
      customActionContent: "customActionContent",
      payload: "payload",
    };
    const notMockDispatchOptions: Omit<ModalComponentProps, "action"> = {
      title: "nottitle",
      subTitle: "notsubTitle",
      content: "notcontent",
      subContent: "notsubContent",
      confirmContent: "notconfirmContent",
      cancelContent: "notcancelContent",
      customActionContent: "notcustomActionContent",
      payload: "notpayload",
      actionState: "error",
    };

    let modalProps1: Omit<ModalComponentProps, "action"> =
      notMockDispatchOptions;
    let modalProps2: Omit<ModalComponentProps, "action"> =
      notMockDispatchOptions;

    // props의 action은 modal의 메소드이기 때문에 다를 수 밖에 없어 제거
    const modal1: ModalFC = ({ action, ...props }) => {
      useEffect(() => {
        modalProps1 = props;
      }, []);
      return null;
    };

    // props의 action은 modal의 메소드이기 때문에 다를 수 밖에 없어 제거
    const modal2 = () => {
      const { action, ...props } = useModalComponentProps();

      useEffect(() => {
        modalProps2 = props;
      }, []);

      return null;
    };
    const {
      modalCtrl: testModalCtrl,
      ModalProvider: TestModalProvider,
      modalManager: testModalManager,
    } = generateModal({
      modal1: {
        component: modal1,
        defaultOptions: mockDispatchOptions,
      },
      modal2: {
        component: modal2,
        defaultOptions: mockDispatchOptions,
      },
    });

    render(<TestModalProvider />);

    act(() => {
      testModalCtrl.modal1();
      testModalCtrl.modal2();
    });

    await waitFor(() => {
      expect(testModalManager.getTransactionState()).toBe(
        MODAL_TRANSACTION_STATE.idle
      );
    });

    expect(
      Object.keys(mockDispatchOptions).every(
        (key) =>
          notMockDispatchOptions[key as keyof typeof notMockDispatchOptions] !==
          mockDispatchOptions[key as keyof typeof mockDispatchOptions]
      )
    ).toBeTruthy();

    expect(
      Object.keys(mockDispatchOptions).every(
        (key) =>
          modalProps1[key as keyof typeof modalProps1] ===
          mockDispatchOptions[key as keyof typeof mockDispatchOptions]
      )
    ).toBeTruthy();

    expect(
      Object.keys(modalProps2).every(
        (key) =>
          modalProps1[key as keyof typeof modalProps1] ===
          modalProps2[key as keyof typeof modalProps2]
      )
    ).toBeTruthy();
  });

  it("modal의 생성 애니메이션이 작동될 때 modal action이 동작하지 않는 지 확인", async () => {
    const { getByText } = render(<ModalProvider />);

    const action = jest.fn();

    act(() => {
      modalCtrl.alert({ action, duration: 100 });
    });

    expect(getByText("Alert")).toBeInTheDocument();
    expect(modalManager.getTransactionState()).toBe(
      MODAL_TRANSACTION_STATE.active
    );

    act(() => {
      const confirm = getByText("Confirm");

      // 무시 됨.
      fireEvent.click(confirm);
      fireEvent.click(confirm);
      fireEvent.click(confirm);
    });

    expect(action).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      expect(modalManager.getTransactionState()).toBe(
        MODAL_TRANSACTION_STATE.idle
      );
    });

    await act(async () => {
      const confirm = getByText("Confirm");

      fireEvent.click(confirm);
      // 무시 됨.
      fireEvent.click(confirm);
      fireEvent.click(confirm);
    });

    expect(action).toHaveBeenCalledTimes(1);
    // alert modal의 confirm 버튼의 confirmType은 true
    expect(action.mock.results[0]).toBeTruthy();
  });
});
