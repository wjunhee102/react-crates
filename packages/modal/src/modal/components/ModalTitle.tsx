import { ElementType, HTMLAttributes } from "react";
import useModalOptions from "../hooks/useModalOptions";

export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

const ModalTitle = ({ as, children, ...restProps }: ModalTitleProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { title } = options;

  if (!title && !children) {
    return null;
  }

  const Component = as || "h2";

  return <Component {...restProps}>{title || children}</Component>;
};

export default ModalTitle;
