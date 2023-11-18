import { ElementType, HTMLAttributes } from "react";
import useModalOptions from "../hooks/useModalOptions";

export interface ModalSubTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

const ModalSubTitle = ({ as, children, ...restProps }: ModalSubTitleProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { subTitle } = options;

  if (!subTitle && !children) {
    return null;
  }

  const Component = as || "h3";

  return <Component {...restProps}>{subTitle || children}</Component>;
};

export default ModalSubTitle;
