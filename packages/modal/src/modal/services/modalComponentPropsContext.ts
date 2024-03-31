import { createContext } from "react";
import { ModalComponentProps } from "./modal";

export const ModalComponentPropsContext = createContext<ModalComponentProps | null>(null);

