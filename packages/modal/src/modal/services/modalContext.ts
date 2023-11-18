import { createContext } from "react";
import { ModalComponentProps } from "../services/ModalFiber";

const ModalContext = createContext<ModalComponentProps | null>(null);

export default ModalContext;
