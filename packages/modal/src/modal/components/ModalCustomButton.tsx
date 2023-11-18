import { ButtonHTMLAttributes, MouseEvent } from "react";
import useModalOptions from "../hooks/useModalOptions";
import { ModalConfirmType } from "../services/ModalFiber";

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
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { action, customContent } = options;

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(confirmType);
  };

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {customContent || children || "커스텀"}
    </button>
  );
};

export default ModalCustomButton;
