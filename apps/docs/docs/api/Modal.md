---
sidebar_position: 3
---

# Modal

[`Modal 만들기`](/docs/getting-started/create-modal)

## ModalComponentProps\<T = any>

```ts
interface ModalComponentProps<T = any> {
  title?: ReactNode;
  subTitle?: ReactNode;
  content?: ReactNode;
  subContent?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customActionContent?: ReactNode;
  // modal의 action 상태
  actionState: "initial" | "pending" | "success" | "error";
  action: (confirm?: string | boolean) => void; // modal 실행
  payload?: T; // modal 통신이 필요하면 해당 프로퍼티를 활용해보세요.
}
```

### Props

| Property            | Type                                          | Default | Description |
| :------------------ | :-------------------------------------------- | :------ | :---------- |
| title               | `ReactNode`                                   | -       | -           |
| subTitle            | `ReactNode`                                   | -       | -           |
| content             | `ReactNode`                                   | -       | -           |
| subContent          | `ReactNode`                                   | -       | -           |
| confirmContent      | `ReactNode`                                   | -       | -           |
| cancelContent       | `ReactNode`                                   | -       | -           |
| customActionContent | `ReactNode`                                   | -       | -           |
| actionState         | `initial` \| `pending`\| `success` \| `error` | -       |             |
| action              | `function`                                    | -       | -           |
| payload             | `T` \| `undefined`                            | -       | -           |

## ModalFC

`props` 형태로 `ModalComponentProps`를 전달하는 방법

### 예제

```tsx
import { ModalFC } from "@react-crates/modal";

const ExampleModal: ModalFC = ({ title, content, action ... }) => {
  ...

  return (
    <div>
      ...
    </div>
  );
}
```

## useModalComponentProps

`hook`의 형태로 `ModalComponentProps`를 전달하는 방법

### 예제

```tsx
import { useModalComponentProps } from "@react-crates/modal";

function ExampleModal (){
  const { title, content, action ... } = useModalComponentProps();

  return (
    <div>
      ...
    </div>
  );
}
```

## Modal Component

component로 `ModalComponentProps`를 전달하는 방법

### 구성

```tsx
<Modal.Title />
<Modal.SubTitle />
<Modal.Content />
<Modal.SubContent />
<Modal.Action />
<Modal.Action.Confirm />
<Modal.Action.Cancel />
<Modal.Action.Custom />
```

### 예제

```tsx
import { Modal } from "@react-crates/modal";

function ExampleModal() {
  return (
    <div>
      <Modal.Title />
      <Modal.Content />
      <Modal.Action />
    </div>
  );
}
```

### Modal.Title

#### 예제

```tsx
type ModalTitleElement = "div" | "h1" | "h2" | "h3" | "h4" | typeof Fragment;

const ModalTitle = <T extends ModalTitleElement = "h2">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
  const { title } = useModalComponentProps();

  if (!title && !children) {
    return null;
  }

  const Component = as || "h2";

  return <Component {...restProps}>{title || children}</Component>;
};

const ModalSubTitle = <T extends ModalTitleElement = "h3">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
  const { subTitle } = useModalComponentProps();

  if (!subTitle && !children) {
    return null;
  }

  const Component = as || "h3";

  return <Component {...restProps}>{subTitle || children}</Component>;
};

ModalTitle.displayName = "Modal.Title";
ModalSubTitle.displayNmae = "Modal.Title.Sub";

ModalTitle.Sub = ModalSubTitle;
```

### Modal.Content

#### 예제

```tsx
type ModalContentElement = "div" | "p" | typeof Fragment;

const ModalContent = <T extends ModalContentElement = "div">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
  const { content } = useModalComponentProps();

  if (!content && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{content || children}</Component>;
};

const ModalSubContent = <T extends ModalContentElement = "div">({
  as,
  children,
  ...restProps
}: PolymorphicComponentPropsWithoutRef<T>) => {
  const { subContent } = useModalComponentProps();

  if (!subContent && !children) {
    return null;
  }

  const Component = as || "div";

  return <Component {...restProps}>{subContent || children}</Component>;
};

ModalContent.displayName = "Modal.Content";
ModalSubContent.displayName = "Modal.Content.Sub";

ModalContent.Sub = ModalSubContent;
```

### Modal.Action

#### 예제

```tsx
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

interface ModalActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
```
