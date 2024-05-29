---
sidebar_position: 7
---

# DynamicModal 사용하기

- `DynamicModal`은 `React 컴포넌트`의 `자연스러운 흐름에 따라 구현`할 수 있는 모달입니다.
- 기존의 모달 개발 방식을 활용하여 직관적으로 모달을 구성하고 관리할 수 있습니다.
- `props`를 통해 기존 modal처럼 설정할 수 있습니다.
- [`DynamicModal API`](/docs/api/DynamicModal)

```tsx
import { generateModal } from "@react-crates/modal";

export const { DynamicModal } = generateModal();

function Example() {
  return (
    <div>
      <DynamicModal
        duration={250}
        position="center"
        action={(confirm?: boolean | string) => {
          ...
          return;
        }}
      >
        {/* trigger는 모달을 open하는 버튼입니다. */}
        <DynamicModal.Trigger>confirm</DynamicModal.Trigger>

        {/* element 내부의 component가 modal로 출력됩니다. */}
        <DynamicModal.Element>
          <div>
            <h2>타이틀</h2>
            <p>내용</p>
            <DynamicModal.Action.Cancel>취소</DynamicModal.Action.Cancel>
            <DynamicModal.Action.Confirm>확인</DynamicModal.Action.Confirm>
          </div>
        </DynamicModal.Element>
      </DynamicModal>
    </div>
  );
}

```
