---
sidebar_position: 2
---

# ModalProvider

- modal이 오픈될 위치입니다.
- [`ModalProvider 배치하기`](/docs/getting-started/register-modal)

## Props

| Property           | Type        | Default | Description                                           |
| :----------------- | :---------- | :------ | :---------------------------------------------------- |
| disableInteraction | `boolean`   | `true`  | modal이 open 되어 있을 때 외부 인터렉션을 방지합니다. |
| children           | `ReactNode` | -       | -                                                     |

## 예제

```tsx
const { ModalProvider } = generateModal();

function App() {
  return (
    <div>
      <div>main</div>
      <ModalProvider disableInteraction />
    </div>
  );
}
```
