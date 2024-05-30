---
sidebar_position: 6
---

# AfterCloseCallback

- 모달이 사리지고 나서 실행되는 함수입니다.
- `AfterCloseCallback`은 `success`, `error`, `end` 메소드만 등록할 수 있습니다.

```tsx
modalCtrl.confirm(async (confirm, { success, error, end }) => {

  // 기본 사용법
  success(() => {
    window.open("test.com");
  });

  // 더 많은 옵션을 추가하는 법.
  success({
    afterCloseCallback: () => {
      window.open("test.com");
    },
    // 옵션을 활성화 시키면 이 action을 modal close 되지 않습니다.
    // 다시 action을 눌렀을 때는 지정한 action을 수행하지 않고 바로 종료됩니다.
    // 사용자에게 결과를 확인 시킨 후 종료할 수 있는 기능입니다.
    isAwaitingConfirm?: boolean,
    component?: string | ModalComponent // 다른 component로 변경
    options?: {
      title?: ReactNode;
      subTitle?: ReactNode;
      content?: ReactNode;
      subContent?: ReactNode;
      confirmContent?: ReactNode;
      cancelContent?: ReactNode;
      customContent?: ReactNode;
    }
  });

});
```
