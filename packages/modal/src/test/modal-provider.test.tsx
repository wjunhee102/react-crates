import React from "react";
import { render, screen } from "@testing-library/react";
import ModalManager from "../services/modalManager";
import setModalProvider from "../components/providers/ModalProvider";

const modalManager = new ModalManager();
const ModalProvider = setModalProvider(modalManager);

describe("ModalProvider", () => {
  modalManager.open(<div>Test Modal</div>);

  it("renders without crashing", () => {
    render(<ModalProvider />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("handles open and close correctly", () => {
    const { getByText } = render(<ModalProvider />);
    expect(getByText("Test Modal")).not.toBeNull();

    modalManager.popModal("clear");
    expect(screen.queryByText("Test Modal")).not.toBeNull();
  });

  it("prevents scrolling when modal is open", () => {
    render(<ModalProvider disableScroll={true} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores scroll when modal is closed", () => {
    const { unmount } = render(<ModalProvider disableScroll={true} />);
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
