import { Fragment } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";
import { PolymorphicComponentPropsWithoutRef } from "./type";

export type ModalTitleElement =
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | typeof Fragment;

const ModalTitle = <T extends ModalTitleElement = "h2">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
  const { title } = useModalComponentProps();

  if (!title && !children) {
    return null;
  }

  const Component = as || "h2";

  return <Component {...restProps}>{title || children}</Component>;
};

const ModalSubTitle = <T extends ModalTitleElement = "h3">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
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
