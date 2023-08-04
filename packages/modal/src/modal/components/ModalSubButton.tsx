import React, { ButtonHTMLAttributes, MouseEvent } from "react";
import useModalOptions from "../hooks/useModalOptions";
import { ModalConfirmType } from "../services/modalStateManager";

export interface ModalSubButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType: ModalConfirmType;
}

const ModalSubButton = ({
  onClick,
  children,
  confirmType,
  ...restProps
}: ModalSubButtonProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { action, subBtnContent } = options;

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(confirmType);
  };

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {subBtnContent || children || "서브"}
    </button>
  );
};

export default ModalSubButton;
