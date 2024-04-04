import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";
import { ModalConfirmType } from "../../types";

export interface ModalCustomActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType: ModalConfirmType;
}

const ModalCustomAction = ({
  onClick,
  children,
  confirmType,
  ...restProps
}: ModalCustomActionProps) => {
  const { action, customActionContents } = useModalComponentProps();

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(confirmType);
  };

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {customActionContents || children || "커스텀"}
    </button>
  );
};

export default ModalCustomAction;
