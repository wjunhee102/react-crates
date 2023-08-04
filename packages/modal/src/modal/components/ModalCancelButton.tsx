import React, { ButtonHTMLAttributes, MouseEvent } from "react";
import useModalOptions from "../hooks/useModalOptions";

export interface ModalCancelButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalCancelButton = ({
  onClick,
  children,
  ...restProps
}: ModalCancelButtonProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { action, cancelContent } = options;

  const onClickCancel = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(false);
  };

  return (
    <button {...restProps} onClick={onClickCancel} type="button">
      {cancelContent || children || "취소"}
    </button>
  );
};

export default ModalCancelButton;
