import { ElementType, HTMLAttributes } from "react";
import useModalOptions from "../hooks/useModalOptions";

export interface ModalSubContentProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const ModalSubContent = ({
  as,
  children,
  ...restProps
}: ModalSubContentProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { subContent } = options;

  if (!subContent && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{subContent || children}</Component>;
};

export default ModalSubContent;
