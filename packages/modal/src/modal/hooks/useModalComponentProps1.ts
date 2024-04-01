import { useContext, createContext } from "react";
import { ModalComponentProps } from "../services/modal";

export const ModalComponentPropsContext = createContext<ModalComponentProps | null>(null);

export function useModalComponentProps() {
  const modalComponentProps = useContext(ModalComponentPropsContext);

  if (!modalComponentProps) {
    throw new Error("useModalComponentProps  must be used within a ModalComponentProps Provider");
  }

  return modalComponentProps;
}
