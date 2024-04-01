import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps1";

export interface ModalSubContentProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const ModalSubContent = ({
  as,
  children,
  ...restProps
}: ModalSubContentProps) => {
  const { subContent } = useModalComponentProps();

  if (!subContent && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{subContent || children}</Component>;
};

export default ModalSubContent;
