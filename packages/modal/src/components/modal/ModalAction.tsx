import { ReactNode } from "react";
import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useModalComponentProps } from "../../hooks/useModalComponentProps";
import { ModalComponentProps, ModalConfirmType } from "../../types";

function getContent(
  children: ReactNode,
  { confirmContent, cancelContent, customActionContent }: ModalComponentProps,
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

  return customActionContent;
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

export interface ModalConfirmProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalConfirm = ({
  onClick,
  children,
  ...restProps
}: ModalConfirmProps) => {
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

export interface ModalCancelProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalCancel = ({ onClick, children, ...restProps }: ModalCancelProps) => {
  const { action, cancelContent } = useModalComponentProps();

  const onClickCancel = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(false);
  };

  return (
    <button {...restProps} onClick={onClickCancel} type="button">
      {cancelContent || children || "취소"}
    </button>
  );
};

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
  const { action, customActionContent } = useModalComponentProps();

  const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(confirmType);
  };

  return (
    <button {...restProps} onClick={onClickSub} type="button">
      {customActionContent || children || "커스텀"}
    </button>
  );
};

ModalAction.displayName = "Modal.Action";
ModalConfirm.displayName = "Modal.Action.Confirm";
ModalCancel.displayName = "Modal.Action.Cancel";
ModalCustomAction.displayName = "Modal.Action.Custom";

ModalAction.Confirm = ModalConfirm;
ModalAction.Cancel = ModalCancel;
ModalAction.Custom = ModalCustomAction;

export default ModalAction;