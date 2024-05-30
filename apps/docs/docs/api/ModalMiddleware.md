---
sidebar_position: 5
---

# Modal Middleware

Modal의 action을 가로채어 원하는 로직을 구성할 수 있습니다.

```ts
interface ModalMiddlewareProps {
  modalState: Modal;
}

class ModalState {
  id: number;
  name: string;
  confirm: string | number | undefined;
  isAwaitingConfirm: boolean;
  isCloseDelay: boolean;
  closeDelayDuration: number;
  callback: (
    confirm: ModalConfirmType | undefined,
    stateController: StateController
  ) => any | Promise<any>;
  getActionState(): ModalActionState;
  getLifecycleState(): ModalLifecycleState;
  init(): Promise<void>;
  active(): void;
  close(): Promise<boolean>;
}
```

### Properties

| Property           | Type                                | Description                                               |
| :----------------- | :---------------------------------- | :-------------------------------------------------------- |
| id                 | `number`                            | modal id                                                  |
| name               | `string`                            | modal name                                                |
| confirm            | `string` \| `number` \| `undefined` | 사용자가 입력한 `confirm value`                           |
| isAwatingConfirm   | `boolean`                           | 사용자에게 modal의 action의 실행 결과를 보여주기 위한 값  |
| isCloseDelay       | `boolean`                           | action을 실행한 뒤 delay후에 close할 것인지를 나타내는 값 |
| closeDelayDuration | `number`                            | action이 실행 된 뒤 얼마 뒤에 close될 것인지 나타내는 값  |

### Methods

| Property          | Return                                                    | Description                                                                           |
| :---------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| callback          | `void`                                                    | `(confirm: string \| boolean \| undefined, stateController: StateController) => void` |
| getActionState    | `initial` \| `pending` \| `success` \| `error` \| `final` | modal의 현재 action state를 반환                                                      |
| getLifecycleState | `open` \| `active` \| `close`                             | modal의 현재 lifeState를 반환                                                         |
| init              | `Promise<void>`                                           | modal의 lifeState를 `open`으로 변경                                                   |
| active            | `void`                                                    | modal의 lifeState를 `active`으로 변경                                                 |
| close             | `Promise<boolean>`                                        | modal를 close로 변경하고 close 성공 유무 반환                                         |

### 예제

- default로 동작하는 middleware입니다.
- `modalState.close`가 실행되야 modal이 close 됩니다.
- `modalState.callback`을 실행되어야 `modal action`이 실행됩니다.

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
