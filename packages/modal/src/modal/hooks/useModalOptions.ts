import { useContext } from "react";
import ModalContext from "../services/modalContext";
import { ModalComponentProps } from "../types";

function useModalOptions<T = any>() {
  return useContext(ModalContext) as ModalComponentProps<T> | null;
}

export default useModalOptions;
