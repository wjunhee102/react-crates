---
sidebar_position: 3
---

# Modal 만들기

- 해당 라이브러리를 사용하기 위해선 `Modal Component`를 만들어야 합니다.
- `Modal Component`는 3가지 방법으로 만들 수 있습니다.

### ModalFC를 이용하여 Modal Component 만들기

```tsx title="ExampleModal.tsx"
import { ModalFC } from "@react-crates/modal";

const ExampleModal: ModalFC = ({
  title,
  content,
  confirmContent,
  cancelContent,
  action,
}) => {
  return (
    <div>
      <h2>{title || "타이틀"}</h2>
      <p>{content || "내용"}</p>
      <button onClick={() => action(false)}>{confirmContent || "취소"}</button>
      <button onClick={() => action(true)}>{cancelContent || "확인"}</button>
    </div>
  );
};

// ModalComponentProps은 아래와 같이 구성되어 있습니다.

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

### useModalComponentProps를 이용한 Modal Component 만들기

```tsx title="ExampleModal.tsx"
import { useModalComponentProps } from "@react-crates/modal";

const ExampleModal = () => {
  const { title, content, confirmContent, cancelContent, action } =
    useModalComponentProps();

  return (
    <div>
      <h2>{title || "타이틀"}</h2>
      <p>{content || "내용"}</p>
      <button onClick={() => action(false)}>{confirmContent || "취소"}</button>
      <button onClick={() => action(true)}>{cancelContent || "확인"}</button>
    </div>
  );
};
```

### Modal을 이용한 Modal Component 만들기

```tsx title="ExampleModal.tsx"
import { Modal } from "@react-crates/modal";

const ExampleModal = () => {
  return (
    <div>
      {/* modal을 open할 때 children으로 입력한 값을 대치합니다. */}
      <Modal.Title>타이틀</Modal.Title>
      <Modal.Content>내용</Modal.Content>
      <Modal.Action.Cancel>취소</Modal.Action.Cancel>
      <Modal.Action.Confirm>확인</Modal.Action.Confirm>
    </div>
  );
};

// Modal Util Component 목록

<Modal.Title />
<Modal.SubTitle />
<Modal.Content />
<Modal.SubContent />
<Modal.Action />
<Modal.Action.Confirm />
<Modal.Action.Cancel />
<Modal.Action.Custom />
```

### Modal Template 이용

- `ModalTemplate`은 style이 적용 되어있는 preset Component입니다.
- `ModalTemplate`을 활용하여 쉽게 Modal의 레이아웃을 쉽게 구성할 수 있습니다.

```tsx
import { ModalTemplate, Modal } from "@react-crates/modal";

const ExampleModal = () => {
  return (
    <ModalTemplate>
      <ModalTemplate.Header>
        <Modal.Title>타이틀</Modal.Title>
      </ModalTemplate.Header>

      <ModalTemplate.Main>
        <Modal.Content>내용</Modal.Content>
      </ModalTemplate.Main>

      <ModalTemplate.Footer>
        <Modal.Action.Cancel>취소</Modal.Action.Cancel>
        <Modal.Action.Confirm>확인</Modal.Action.Confirm>
      </ModalTemplate.Footer>
    </ModalTemplate>
  );
};

// Modal Template 목록

<ModalTemplate>
<ModalTemplate.Header>
<ModalTemplate.Main>
<ModalTemplate.Footer>
```

Modal Component를 만들었으면 이제 Modal을 등록할 차례입니다.
