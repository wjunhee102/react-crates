---
sidebar_position: 5
---

# Modal Active State

## Modal Action State

- `Modal action` 실행 중에 상태를 변경하여 `Modal의 Component`를 변경할 수 있습니다.
- `Action state`로 상태별 View를 쉽게 구성할 수 있습니다.
- 기본 action 상태는 `“initial"`입니다.

```tsx
import { useState } from "react";
import { modalCtrl } from "./modal";

function Example() {
  const [message, setMessage] = useState(null);

  const confirm = () => {

    modalCtrl.confirm(async (confirm, { pending, success, error }) => {
      // 기본 actionState는 "initial"입니다.
      if (!confirm) {
        return;
      }

      pending(); // actionState를 "pending"으로 변경합니다.

      try {
        const data = await api();

        setMessage(data);
        success(); // actionState를 "success"으로 변경합니다.
      } catch (someError) {
        error(); // actionState를 "error"으로 변경합니다.
      }
    });

  }

  return (
    <div>
      <button onClick={confirm}>confirm</button>
    </div>
  );
}

---
// Modal Action State 목록입니다.

type ModalActionState =
  | "initial"
  | "pending"
  | "success"
  | "error"
```

## Modal Action State 활용

```tsx
// modal.ts
import { generateModal } from "@react-crates/modal";

const { modalCtrl } = generateModal({
  confirm: {
    component: () => <div></div>,
    // 해당 옵션을 활성해야 자동 state response 기능이 활성화됩니다.
    stateResponsiveComponent: true
  },
  // 아래에 name으로 modal을 등록하면 actionState에 활용할 수 있습니다.
  pending: {
    ...
  },
  success: {
    ...
  },
  error: {
    ...
  }

}, {
  ...
  stateResponsiveComponent: true // 전체 모달의 기본 값으로 설정할 수 있습니다.
});

modalCtrl.confirm(async (confirm, {
  initial,
  pending,
  success,
  error,
  end
}) => {

  initial() // modal이 기존 modal component를 유지합니다.
  pending() // modal이 등록된 "pending" modal로 변경됩니다.
  success() // modal이 등록된 "success" modal로 변경됩니다.
  error() // modal이 등록된 "error" modal로 변경됩니다.
  end() // modal이 기존 modal component로 돌아갑니다.

  pending("로딩 중..."); // modal content가 변경됩니다.

});

// 다른 등록된 modal로 변경할 수 있습니다.
modalCtrl.confirm(async (confirm, { pending }) => {

  // 등록된 modal 확용
  pending({
    component: "example",
  });

  // 동적 modal component 생성
  pending({
    component: () => <div>로딩...</div>,
  });

});

// Modal Component에 직접 actionState를 활용할 수 있습니다.
import { ModalFC } from "@react-crates/modal";

const ExampleModal: ModalFC = ({ actionState }) => {
  if (actionState === "initial") {
    return (
      <div>initial</div>
    );
  }

  if (actionState === "pending") {
    return (
      <div>loading...</div>
    );
  }

  ...
}
```
