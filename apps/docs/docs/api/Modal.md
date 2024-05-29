---
sidebar_position: 4
---

# Modal

## Modal

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

### Modal.Action

## ModalFC

### ModalComponentProps

```ts
interface ModalComponentProps<T> {
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
