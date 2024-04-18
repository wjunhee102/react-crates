import { Fragment } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";
import { PolymorphicComponentPropsWithoutRef } from "./type";

export type ModalContentElement = "div" | "p" | typeof Fragment;

const ModalContent = <T extends ModalContentElement = "div">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
  const { content } = useModalComponentProps();

  if (!content && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{content || children}</Component>;
};

const ModalSubContent = <T extends ModalContentElement = "div">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
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
