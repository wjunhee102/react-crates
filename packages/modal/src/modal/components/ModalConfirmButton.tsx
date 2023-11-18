import { ButtonHTMLAttributes, MouseEvent } from "react";
import useModalOptions from "../hooks/useModalOptions";

export interface ModalConfirmButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalConfirmButton1 = ({
  onClick,
  children,
  ...restProps
}: ModalConfirmButtonProps) => {
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { action, confirmContent } = options;

  const onClickConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(true);
  };

  return (
    <button {...restProps} onClick={onClickConfirm} type="button">
      {confirmContent || children || "확인"}
    </button>
  );
};

export default ModalConfirmButton1;
