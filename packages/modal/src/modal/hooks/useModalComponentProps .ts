import { useContext } from "react";
import { ModalComponentPropsContext } from "../services/modalComponentPropsContext";

export function useModalComponentProps() {
  const modalComponentProps = useContext(ModalComponentPropsContext);

  if (!modalComponentProps) {
    throw new Error("useModalComponentProps  must be used within a ModalComponentProps Provider");
  }

  return modalComponentProps;
}
