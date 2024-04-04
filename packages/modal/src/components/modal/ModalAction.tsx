import { ReactNode } from "react";
import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";
import { ModalComponentProps, ModalConfirmType } from "../../types";
import ModalConfirm from "./ModalConfirm";
import ModalCancle from "./ModalCancel";
import ModalCustomAction from "./ModalCustomAction";

function getContent(
  children: ReactNode,
  {
    confirmContents,
    cancelContents,
    customActionContents,
  }: ModalComponentProps,
  confirmType?: ModalConfirmType
) {
  if (children) {
    return children;
  }

  if (!confirmType) {
    return cancelContents;
  }

  if (confirmType === true) {
    return confirmContents;
  }

  return customActionContents;
}

export interface ModalActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType?: ModalConfirmType;
}

const ModalAction = ({
  onClick,
  children,
  confirmType,
  ...restProps
}: ModalActionProps) => {
  const componentProps = useModalComponentProps();

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    componentProps.action(confirmType);
  };

  const contents = getContent(children, componentProps, confirmType);

  if (!contents) {
    return null;
  }

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {contents}
    </button>
  );
};

ModalAction.Confirm = ModalConfirm;
ModalAction.Cancel = ModalCancle;
ModalAction.Custom = ModalCustomAction;

export default ModalAction;
