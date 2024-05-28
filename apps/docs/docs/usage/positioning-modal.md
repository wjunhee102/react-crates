---
sidebar_position: 3
---

# Modal Positioning

- 유동적 위치 지정: `position` 속성을 사용하여 modal의 위치를 동적으로 조정할 수 있습니다.
- 복합 위치 설정: 여러 `position` 값들을 조합하여 modal의 생성 및 소멸 위치를 세밀하게 설정할 수 있습니다.
- 조건부 위치 설정: `breakPoint(width)` 값을 기반으로 화면 크기에 따라 modal의 위치를 조정할 수 있습니다. 이를 통해 반응형 디자인에 적합하게 모달을 위치시킬 수 있습니다.

```tsx
import { modalCtrl } from "./modal";

function Example() {
  const confirm = modalCtrl.confirm({
    position: "center"; // center에서 생성되고 사라집니다.
  });

  const confirm = modalCtrl.confirm({
    position: "bottom-center"; // bottom에서 시작해서 center에 생성되고 사라집니다.
  });

  const confirm = modalCtrl.confirm({
    // bottom에서 시작해서 center에 생성되고 bottom에서 사라집니다.
    position: "bottom-center-bottom";
  });

  const confirm = modalCtrl.confirm({
    //
    position: (breakPoint) => breakPoint > 425 ? "center" : "bottom";
  });
}
```

- 본인만의 `position`을 만들고 조합해서 사용할 수 있습니다.

```tsx
// modal.ts
import { generateModal } from "@react-crates/modal";

export const { modalCtrl } = generatorModal({
  ...modalComponentTable
}, {
  position: {
    // 사용자에 맞춘 커스텀 position을 만들 수 있습니다.
    customPosition: {
      open: {
        left: "0px",
        right: "0px",
        ...
      },
      active: {
        ...
      },
      close: {
        ...
      }
    }
  }
});

---
// Example.tsx
import { modalCtrl } from "./modal";

function Example() {
  const confirm = modalCtrl.confirm({
    // 순서대로 open, active, close의 설정한 style이 적용됩니다.
    // ex) customPosition이 처음에 있으면 customPosition의 open style.
    // ex) customPosition이 중간에 있으면 customPosition의 active style이 적용.
    position: "center-customPosition-top";
  });
}

// Default Position 목록입니다.

type DefaultModalPosition =
  | "default"
  | "bottom"
  | "top"
  | "left"
  | "right"
  | "center"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";
```
