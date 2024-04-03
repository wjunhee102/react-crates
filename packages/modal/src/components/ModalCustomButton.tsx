import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps";
import { ModalConfirmType } from "../types";

export interface ModalCustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType: ModalConfirmType;
}

const ModalCustomButton = ({
  onClick,
  children,
  confirmType,
  ...restProps
}: ModalCustomButtonProps) => {
  const { action, customContents } = useModalComponentProps();

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(confirmType);
  };

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {customContents || children || "커스텀"}
    </button>
  );
};

export default ModalCustomButton;
