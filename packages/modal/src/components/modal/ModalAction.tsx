import { forwardRef, ReactNode, ButtonHTMLAttributes, MouseEvent } from "react";
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

const ModalConfirm = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, type = "button", ...restProps }, ref) => {
  const { action, confirmContent } = useModalComponentProps();

  const onClickConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(true);
  };

  return (
    <button ref={ref} onClick={onClickConfirm} type={type} {...restProps}>
      {confirmContent || children || "확인"}
    </button>
  );
});

const ModalCancel = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, type = "button", ...restProps }, ref) => {
  const { action, cancelContent } = useModalComponentProps();

  const onClickCancel = (e: MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
    action(false);
  };

  return (
    <button ref={ref} onClick={onClickCancel} type={type} {...restProps}>
      {cancelContent || children || "취소"}
    </button>
  );
});

export interface ModalCustomActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmType: ModalConfirmType;
}

const ModalCustomAction = forwardRef<HTMLButtonElement, ModalCustomActionProps>(
  ({ onClick, children, confirmType, type = "button", ...restProps }, ref) => {
    const { action, customActionContent } = useModalComponentProps();

    const onClickSub = (e: MouseEvent<HTMLButtonElement>) => {
      onClick && onClick(e);
      action(confirmType);
    };

    return (
      <button ref={ref} onClick={onClickSub} type={type} {...restProps}>
        {customActionContent || children || "커스텀"}
      </button>
    );
  }
);

ModalAction.displayName = "Modal.Action";
ModalConfirm.displayName = "Modal.Action.Confirm";
ModalCancel.displayName = "Modal.Action.Cancel";
ModalCustomAction.displayName = "Modal.Action.Custom";

ModalAction.Confirm = ModalConfirm;
ModalAction.Cancel = ModalCancel;
ModalAction.Custom = ModalCustomAction;

export default ModalAction;
