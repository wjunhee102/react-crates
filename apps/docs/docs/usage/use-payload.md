---
sidebar_position: 4
---

# Modal Payload 활용하기

- Modal과 통신이 필요한 경우 `payload` option을 사용할 수 있습니다.
- payload는 항상 `undefined`일 수 있습니다.
- payload의 타입을 `defaultOptions`에 적용하면 `modalCtrl`에서 `IntelliSense`가 활성화 됩니다.

```tsx
import { ModalFC } from "@react-crates/modal";

export interface ExamplePayload {
  foo: string;
  bar: number;
}

export const ExampleModal: ModalFC<ExamplePayload> = ({
  payload /* type: ExamplePayload | undefined */
}) => {
  return (
    <div>
      ...
    </div>
  );
}

--
// modal.ts
import { ExampleModal, ExamplePayload } from "./ExampleModal";

const { modalCtrl } = generateModal({
  confirm: {
    component: ExampleModal,
    defaultOptions: {
      // case 1
      payload: {
        foo: "foo",
        bar: 1,
      }
      // case 2
      payload: undefined as ExamplePayload | undefined
    }
  }
});

//
modalCtrl.confirm({
  payload: {
    ... // IntelliSense 활성화
  }
});
```
