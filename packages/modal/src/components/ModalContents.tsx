import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps";

export interface ModalContentsProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const ModalContents = ({ as, children, ...restProps }: ModalContentsProps) => {
  const { contents } = useModalComponentProps();

  if (!contents && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{contents || children}</Component>;
};

export default ModalContents;
