import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps";

export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

const ModalTitle = ({ as, children, ...restProps }: ModalTitleProps) => {
  const { title } = useModalComponentProps();

  if (!title && !children) {
    return null;
  }

  const Component = as || "h2";

  return <Component {...restProps}>{title || children}</Component>;
};

export default ModalTitle;
