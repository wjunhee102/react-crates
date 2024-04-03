import { ReactNode } from "react";
import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../hooks/useModalComponentProps";
import { ModalComponentProps, ModalConfirmType } from "../types";

function getContent(
  children: ReactNode,
  { confirmContents, cancelContents, customContents }: ModalComponentProps,
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

  return customContents;
}

export interface ModalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType?: ModalConfirmType;
}

const ModalButton = ({
  onClick,
  children,
  confirmType,
  ...restProps
}: ModalButtonProps) => {
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

export default ModalButton;
