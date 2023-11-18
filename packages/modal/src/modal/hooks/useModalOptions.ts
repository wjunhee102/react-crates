import { useContext } from "react";
import ModalContext from "../services/modalContext";
import { ModalComponentProps } from "../services/ModalFiber";

function useModalOptions<T = any>() {
  return useContext(ModalContext) as ModalComponentProps<T> | null;
}

export default useModalOptions;
