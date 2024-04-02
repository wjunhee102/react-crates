import { ReactNode } from "react";
import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps";
import { ModalComponentProps, ModalConfirmType } from "../types";

function getContent(
  children: ReactNode,
  { confirmContent, cancelContent, customContent }: ModalComponentProps,
  confirmType?: ModalConfirmType
) {
  if (children) {
    return children;
  }

  if (!confirmType) {
    return cancelContent;
  }

  if (confirmType === true) {
    return confirmContent;
  }

  return customContent;
}

export interface ModalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType?: ModalConfirmType;
}

const ModalButton = ({
  onClick,
  children,
  confirmType,
  ...restProps
}: ModalButtonProps) => {
  const componentProps = useModalComponentProps();

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    componentProps.action(confirmType);
  };

  const content = getContent(children, componentProps, confirmType);

  if (!content) {
    return null;
  }

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {content}
    </button>
  );
};

export default ModalButton;
