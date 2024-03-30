import { ReactNode } from "react";
import { ButtonHTMLAttributes, MouseEvent } from "react";
import useModalOptions from "../hooks/useModalOptions";
import { ModalConfirmType, ModalComponentProps } from "../services/modal";

function getContent(
  children: ReactNode,
  { confirmContent, cancelContent, customContent }: ModalComponentProps,
  confirmType?: ModalConfirmType
) {
  if (children) {
    return children;
  }

  if (!confirmType) {
    return cancelContent;
  }

  if (confirmType === true) {
    return confirmContent;
  }

  return customContent;
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
  const options = useModalOptions();

  if (!options) {
    return null;
  }

  const { action } = options;

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(confirmType);
  };

  const content = getContent(children, options, confirmType);

  if (!content) {
    return null;
  }

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {content}
    </button>
  );
};

export default ModalButton;
