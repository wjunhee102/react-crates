import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { ModalManager } from "../../services";
import setModalProvider from "../providers/ModalProvider";
import setDynamicModal from "./DynamicModal";
import { useState } from "react";

describe("DynamicModal", () => {
  const modalManager = new ModalManager([], {
    duration: 0,
  });
  const ModalProvider = setModalProvider(modalManager);
  const DynamicModal = setDynamicModal(modalManager);

  afterEach(() => {
    act(() => {
      modalManager.remove("clear");
    });
  });

  it("DynamicModal.Element children이 올바르게 렌더링되는 지 확인", async () => {
    const { queryByText, getByRole, getByText } = render(
      <div>
        <ModalProvider />
        <DynamicModal>
          <DynamicModal.Trigger>trigger</DynamicModal.Trigger>
          <DynamicModal.Element>
            <div>
              <div>content</div>
              <DynamicModal.Action confirmType={true}>
                confirm
              </DynamicModal.Action>
            </div>
          </DynamicModal.Element>
        </DynamicModal>
      </div>
    );

    expect(queryByText("content")).toBeNull();

    act(() => {
      const trigger = getByRole("button");

      fireEvent.click(trigger);
    });

    expect(getByText("content")).toBeInTheDocument();

    const actionButton = getByText("confirm");

    // modal transaction이 idle 될 때 까지 시도
    await waitFor(() => {
      fireEvent.click(actionButton);
      expect(queryByText("content")).toBeNull();
    });
  });

  it("DynamicModal.Element에 상태변화가 적용되는지 확인", async () => {
    const TestComponent = () => {
      const [count, setCount] = useState(0);
      return (
        <div>
          <ModalProvider />
          <DynamicModal>
            <DynamicModal.Trigger>trigger</DynamicModal.Trigger>
            <DynamicModal.Element>
              <div>
                <div>{count}</div>
                <button
                  onClick={() => {
                    setCount(count + 1);
                  }}
                >
                  plus
                </button>
              </div>
            </DynamicModal.Element>
          </DynamicModal>
        </div>
      );
    };

    const { getByRole, getByText } = render(<TestComponent />);

    act(() => {
      const trigger = getByRole("button");

      fireEvent.click(trigger);
    });

    expect(getByText("0")).toBeInTheDocument();

    act(() => {
      const plus = getByText("plus");

      fireEvent.click(plus);
    });

    expect(getByText("1")).toBeInTheDocument();
  });
});
