import { createContext } from "react";
import { ModalComponentProps } from "../types";

const ModalContext = createContext<ModalComponentProps | null>(null);

export default ModalContext;
