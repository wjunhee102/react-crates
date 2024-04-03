import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps";

export interface ModalCancelButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalCancelButton = ({
  onClick,
  children,
  ...restProps
}: ModalCancelButtonProps) => {
  const { action, cancelContents } = useModalComponentProps();

  const onClickCancel = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(false);
  };

  return (
    <button {...restProps} onClick={onClickCancel} type="button">
      {cancelContents || children || "취소"}
    </button>
  );
};

export default ModalCancelButton;