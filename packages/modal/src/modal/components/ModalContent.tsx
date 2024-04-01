import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps1";

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const ModalContent = ({ as, children, ...restProps }: ModalContentProps) => {
  const { content } = useModalComponentProps();

  if (!content && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{content || children}</Component>;
};

export default ModalContent;
