import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";

export interface ModalContentsProps
  extends HTMLAttributes<HTMLDivElement | HTMLParagraphElement> {
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

const ModalSubContents = ({
  as,
  children,
  ...restProps
}: ModalContentsProps) => {
  const { subContents } = useModalComponentProps();

  if (!subContents && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{subContents || children}</Component>;
};

ModalContents.displayName = "Modal.Contents";
ModalSubContents.displayName = "Modal.Contents.Sub";

ModalContents.Sub = ModalSubContents;

export default ModalContents;
