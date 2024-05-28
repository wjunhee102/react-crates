---
sidebar_position: 8
---

# Modal Middleware

- Modal의 action을 가로채어 원하는 로직을 구현할 수 있습니다.
- 다음의 코드는 default로 동작하는 middleware입니다.

```tsx
async function defaultMiddleware({ modalState }: ModalMiddlewareProps) {
  if (modalState.isAwaitingConfirm) {
    return modalState.close();
  }

  await modalState.callback(modalState.confirm, modalState);

  if (modalState.isCloseDelay) {
    await delay(modalState.closeDelayDuration);

    return modalState.close();
  }

  if (modalState.isAwaitingConfirm) {
    return false;
  }

  return modalState.close();
}
```
