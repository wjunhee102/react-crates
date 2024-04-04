import { ElementType, HTMLAttributes } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";

export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

const ModalTitle = ({ as, children, ...restProps }: ModalTitleProps) => {
  const { title } = useModalComponentProps();

  if (!title && !children) {
    return null;
  }

  const Component = as || "h2";

  return <Component {...restProps}>{title || children}</Component>;
};

const ModalSubTitle = ({ as, children, ...restProps }: ModalTitleProps) => {
  const { subTitle } = useModalComponentProps();

  if (!subTitle && !children) {
    return null;
  }

  const Component = as || "h3";

  return <Component {...restProps}>{subTitle || children}</Component>;
};

ModalTitle.displayName = "Modal.Title";
ModalSubTitle.displayNmae = "Modal.Title.Sub";

ModalTitle.Sub = ModalSubTitle;

export default ModalTitle;
