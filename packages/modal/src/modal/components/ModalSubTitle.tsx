import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps1";

export interface ModalSubTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

const ModalSubTitle = ({ as, children, ...restProps }: ModalSubTitleProps) => {
  const { subTitle } = useModalComponentProps();

  if (!subTitle && !children) {
    return null;
  }

  const Component = as || "h3";

  return <Component {...restProps}>{subTitle || children}</Component>;
};

export default ModalSubTitle;
