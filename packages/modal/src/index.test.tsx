import { fireEvent, render, waitFor } from "@testing-library/react";
import { modalCollection } from "./components";
import { generateModal } from "./generate";
import { act } from "react-dom/test-utils";

describe("modal test", () => {
  const pendingComponent = jest.fn();
  const successComponent = jest.fn();
  const errorComponent = jest.fn();
  const {
    modalCtrl,
    ModalProvider,
    modalManager,
    DynamicModal,
    useIsOpenModal,
  } = generateModal({
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
  });

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
            <DynamicModal.Action>Confirm</DynamicModal.Action>
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
      expect(modalManager.getTransactionState()).toBe("idle");
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
      expect(modalManager.getTransactionState()).toBe("idle");
    });

    act(() => {
      const confirm = getByText("Confirm");
      fireEvent.click(confirm);
    });
  });

  it("useIsOpenModal를 사용하여 modal이 open 됐을 때를 감지할 수 있는지 확인", () => {
    function TestComponent() {
      const isOpen = useIsOpenModal();

      return <div>{isOpen ? "open" : "close"}</div>;
    }

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
});
