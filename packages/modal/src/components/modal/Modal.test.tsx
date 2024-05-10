import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { ModalManager } from "../../services";
import setModalProvider from "../providers/ModalProvider";
import { Modal } from ".";
import { ModalConfirmType } from "../../types";

describe("DynamicModal", () => {
  const modalManager = new ModalManager(
    [
      {
        name: "test",
        component: () => (
          <div>
            <Modal.Title>1</Modal.Title>
            <Modal.Title.Sub>2</Modal.Title.Sub>
            <Modal.Content>3</Modal.Content>
            <Modal.Content.Sub>4</Modal.Content.Sub>
            <Modal.Action>action</Modal.Action>
            <Modal.Action.Cancel>5</Modal.Action.Cancel>
            <Modal.Action.Confirm>6</Modal.Action.Confirm>
            <Modal.Action.Custom confirmType="custom">7</Modal.Action.Custom>
          </div>
        ),
      },
    ],
    {
      duration: 0,
    }
  );
  const ModalProvider = setModalProvider(modalManager);

  afterEach(() => {
    act(() => {
      modalManager.remove("clear");
    });
  });

  it("Modal Component가 올바르게 렌더링 되는지 확인", async () => {
    const { queryByText, getByText } = render(<ModalProvider />);

    const action = jest.fn((confirm?: ModalConfirmType) => {
      if (confirm === undefined) {
        return "action";
      }

      return confirm;
    });

    act(() => {
      modalManager.open("test", {
        title: "title",
        subTitle: "subTitle",
        content: "content",
        subContent: "subContent",
        cancelContent: "cancel",
        confirmContent: "confirm",
        customActionContent: "custom",
        action,
      });
    });

    expect(getByText("title")).toBeInTheDocument();
    expect(getByText("subTitle")).toBeInTheDocument();
    expect(getByText("content")).toBeInTheDocument();
    expect(getByText("subContent")).toBeInTheDocument();
    expect(getByText("cancel")).toBeInTheDocument();
    expect(getByText("confirm")).toBeInTheDocument();
    expect(getByText("custom")).toBeInTheDocument();

    const actionButton = getByText("action");

    await waitFor(() => {
      fireEvent.click(actionButton);
      expect(queryByText("title")).toBeNull();
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.results[0].value).toBe("action");

    act(() => {
      modalManager.open(
        <div>
          <Modal.Title>title</Modal.Title>
          <Modal.Title.Sub>subTitle</Modal.Title.Sub>
          <Modal.Content>content</Modal.Content>
          <Modal.Content.Sub>subContent</Modal.Content.Sub>
          <Modal.Action>action</Modal.Action>
          <Modal.Action.Cancel>cancel</Modal.Action.Cancel>
          <Modal.Action.Confirm>confirm</Modal.Action.Confirm>
          <Modal.Action.Custom confirmType="custom">custom</Modal.Action.Custom>
        </div>,
        {
          action,
        }
      );
    });

    expect(getByText("title")).toBeInTheDocument();
    expect(getByText("subTitle")).toBeInTheDocument();
    expect(getByText("content")).toBeInTheDocument();
    expect(getByText("subContent")).toBeInTheDocument();
    expect(getByText("action")).toBeInTheDocument();
    expect(getByText("cancel")).toBeInTheDocument();
    expect(getByText("confirm")).toBeInTheDocument();

    const customAction = getByText("custom");

    await waitFor(() => {
      fireEvent.click(customAction);
      expect(queryByText("title")).toBeNull();
    });

    expect(action).toHaveBeenCalledTimes(2);
    expect(action.mock.results[1].value).toBe("custom");
  });

  it("Modal.Action content 렌더링 확인", () => {
    const { getByText, getAllByText } = render(<ModalProvider />);

    act(() => {
      modalManager.open(
        <div>
          {/*
             action에 confirmType이 없으면 
             cancel - confirm - custom 순으로 렌더링
          */}
          <Modal.Action />
          <Modal.Action confirmType={false} />
          <Modal.Action confirmType={true} />
          <Modal.Action confirmType="custom" />
        </div>,
        {
          cancelContent: "cancel",
          confirmContent: "confirm",
          customActionContent: "custom",
        }
      );
    });

    expect(getAllByText("cancel").length).toBe(2);
    expect(getByText("confirm")).toBeInTheDocument();
    expect(getByText("custom")).toBeInTheDocument();
  });
});
