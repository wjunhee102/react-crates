import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps1";

export interface ModalConfirmButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalConfirmButton1 = ({
  onClick,
  children,
  ...restProps
}: ModalConfirmButtonProps) => {
  const { action, confirmContent } = useModalComponentProps();

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
