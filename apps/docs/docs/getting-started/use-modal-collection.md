---
sidebar_position: 5
---

# Modal Collection 이용

- Modal Collection은 style이 적용 되어있는 preset Modal Component입니다.
- Modal Collection을 이용하면 별도의 Modal Component 개발 없이도 바로 사용할 수 있습니다.
- defaultOptions을 통해 제목, 내용, 버튼 등의 콘텐츠를 개별적으로 설정할 수 있습니다.

```tsx title="modal.ts"
import { generateModal, modalCollection } from "@react-crates/modal";

const { confirm, alert, prompt } = modalCollection;

export const { modalCtrl } = generateModal({
  confirm,
  prompt,
  alert: {
    component: alert.component,
    defaultOptions: {
      ...alert.defaultOptions,
      title: "알림",
      content: "알림",
      confirmContent: "확인",
    },
  },
});
```

### Modal Collection Confirm의 구성

```tsx
<ModalTemplate>
  <ModalTemplate.Header>
    <Modal.Title className="modal-collection-title-rm">Confirm</Modal.Title>
    <Modal.Title.Sub className="modal-collection-sub-title-rm" />
  </ModalTemplate.Header>

  <ModalTemplate.Main>
    <Modal.Content className="modal-collection-content-rm" />
    <Modal.Content.Sub className="modal-collection-sub-content-rm" />
  </ModalTemplate.Main>

  <ModalTemplate.Footer>
    <Modal.Action.Cancel className="modal-collection-action-rm modal-collection-cancel-rm">
      Cancel
    </Modal.Action.Cancel>
    <Modal.Action.Confirm className="modal-collection-action-rm modal-collection-confirm-rm">
      Confirm
    </Modal.Action.Confirm>
  </ModalTemplate.Footer>
</ModalTemplate>
```

### Modal Collection 목록

```tsx
{
  confirm: {
    component: Confirm,
    defaultOptions: {
      backCoverConfirm: false,
      escKeyActive: true,
      role: "dialog",
      label: "confirm",
    },
  },
  alert: {
    component: Alert,
    defaultOptions: {
      backCoverConfirm: true,
      escKeyActive: true,
      role: "alertdialog",
      label: "alert",
    },
  },
  prompt: {
    component: Prompt,
    defaultOptions: {
      backCoverConfirm: undefined,
      escKeyActive: true,
      role: "dialog",
      label: "prompt",
    },
  },
};
```
