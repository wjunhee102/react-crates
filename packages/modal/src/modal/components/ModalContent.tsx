import React, { ElementType, HTMLAttributes } from "react";
import useModalOptions from "../hooks/useModalOptions";

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const ModalContent = ({ as, children, ...restProps }: ModalContentProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { content } = options;

  if (!content && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{content || children}</Component>;
};

export default ModalContent;
