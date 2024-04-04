import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";

export interface ModalSubContentProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const ModalSubContents = ({
  as,
  children,
  ...restProps
}: ModalSubContentProps) => {
  const { subContents } = useModalComponentProps();

  if (!subContents && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{subContents || children}</Component>;
};

export default ModalSubContents;
