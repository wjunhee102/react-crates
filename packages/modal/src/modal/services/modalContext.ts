import { createContext } from "react";
import { ModalComponentProps } from "./modal";

const ModalContext = createContext<ModalComponentProps | null>(null);

export default ModalContext;
