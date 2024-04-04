import { useContext, createContext } from "react";
import { ModalComponentProps } from "../types";

export const ModalComponentPropsContext =
  createContext<ModalComponentProps | null>(null);

export function useModalComponentProps() {
  const modalComponentProps = useContext(ModalComponentPropsContext);

  if (!modalComponentProps) {
    throw new Error(
      "useModalComponentProps must be used within a ModalComponentProps Provider"
    );
  }

  return modalComponentProps;
}
