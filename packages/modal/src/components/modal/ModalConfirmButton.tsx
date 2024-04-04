import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";

export interface ModalConfirmButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalConfirmButton = ({
  onClick,
  children,
  ...restProps
}: ModalConfirmButtonProps) => {
  const { action, confirmContents } = useModalComponentProps();

  const onClickConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(true);
  };

  return (
    <button {...restProps} onClick={onClickConfirm} type="button">
      {confirmContents || children || "확인"}
    </button>
  );
};

export default ModalConfirmButton;
