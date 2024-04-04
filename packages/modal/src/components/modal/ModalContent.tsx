import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";

export interface ModalContentProps
  extends HTMLAttributes<HTMLDivElement | HTMLParagraphElement> {
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

const ModalSubContent = ({ as, children, ...restProps }: ModalContentProps) => {
  const { subContent } = useModalComponentProps();

  if (!subContent && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{subContent || children}</Component>;
};

ModalContent.displayName = "Modal.Content";
ModalSubContent.displayName = "Modal.Content.Sub";

ModalContent.Sub = ModalSubContent;

export default ModalContent;
