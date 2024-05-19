---
sidebar_position: 2
---

# Modal Action 활용

- Modal Action은 @react-crates/modal의 가장 핵심적인 기능입니다.
- Modal Action 함수는 모달을 조작하는 사용자가 상태 변경과 실행 결과를 지정할 수 있게 `confirm`과 `stateController` 인자를 제공합니다.

## Modal Action Confirm

- Modal Action의 첫번째 인수 `confirm`은 유저와 상호작용을 위한 값입니다.
- Modal Component에 `Modal.Action`을 배치하여 유저와 상호작용할 수 있습니다.

```tsx
import { Modal } from "@react-crates/modal";

export default function ExampleModal() {
  return (
    <div>
      ...
      {/* confirm=false */}
      <Modal.Action.Cancel>Cancel</Modal.Action.Cancel>
      {/* confirm=true */}
      <Modal.Action.Confirm>Confirm</Modal.Action.Confirm>
      {/* confirm="custom" */}
      <Modal.Action.Custom confirmType="test">Custom</Modal.Action.Custom>
      {/* confirm="action" */}
      <Modal.Action confirmType="action">Action</Modal.Action>
    </div>
  );
}

...

modalCtrl.confirm((confirm?: boolean | string) => {
  if (confirm === true) {
    ... // Modal.Action.Confirm을 클릭했을 때
  } else if (confirm === false {
    ... // Modal.Action.Cancel을 클릭했을 때
  } else if (confirm === "custom") {
    ... // Modal.Action.Custom을 클릭했을 때
  } else if (confirm === "action") {
    ... // Modal.Action을 클릭했을 때
  } else if (confirm === undefined) {
    ... // backCover을 클릭했을 때
  }
});
```

:::info

`Modal.Action`과 `Modal.Action.Custom`은 `content`에 차이가 있습니다.
`Modal.Action.Custom`은 `customActionContent`에 따라 content를 표현하지만, `Modal.Action`은 <br /> `cancelContent` - `confirmContent` - `customActionContent`순으로 content를 표현합니다.

:::

### Modal BackCover Confirm

- Modal의 backCover에 `confirm type`을 설정할 수 있습니다.
- `null`을 설정하여 backCover의 action이 실행되지 않게 할 수 있습니다.
- `backCoverCofirm`의 기본값은 `undefined`입니다.

```tsx title="modal.ts"
import ExampleModal from "./component/ExampleModal";

...

export const { modalCtrl } = generateModal({
  ...
  confirm: {
    component: ExampleModal,
    defaultOptions: {
      backCoverConfirm: false | "test" | null
    }
  }
});
```

## Modal Action State Controller

### Modal Action State 활용

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

### AfterCloseCallback

- `modal이 close`되고 나서 실행되는 함수입니다.
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

## 응용

### Modal Collection Prompt 사용자 입력값 가져오기

```tsx
import { modalCtrl } from "./modal";

function Example() {
  const prompt = () => {
    modalCtrl.prompt();

    modalCtrl.prompt((confirm) => {
      console.log(confirm /* 사용자 입력값 확인 가능 */);
    });
  };

  return (
    <div>
      <button onClick={prompt}>prompt</button>
    </div>
  );
}
```

- Modal Collection Prompt Component는 다음과 같이 구성되어 있습니다.

```tsx title="./Prompt.tsx"
import { useState, useMemo, KeyboardEvent } from "react";
import { Modal } from "@react-crates/modal";

const Prompt = () => {
  const [state, setState] = useState("");
  const { action } = useModalComponentProps();

  const { actionToKeyUp, onChange } = useMemo(
    () => ({
      actionToKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key !== "Enter") {
          return;
        }

        event.preventDefault();
        action(state);
      },
      onChange(event: ChangeEvent<HTMLInputElement>) {
        setState(event.target.value);
      },
    }),
    []
  );

  return (
    <ModalTemplate className="modal-template-bg-rm">
      <ModalTemplate.Header>
        <Modal.Title className="modal-collection-title-rm">Prompt</Modal.Title>
        <Modal.Title.Sub className="modal-collection-sub-title-rm" />
      </ModalTemplate.Header>

      <ModalTemplate.Main>
        <Modal.Content className="modal-collection-content-rm" />
        <Modal.Content.Sub className="modal-collection-sub-content-rm" />
        <div className="modal-collection-prompt-rm">
          <input
            onChange={onChange}
            onKeyUp={actionToKeyUp}
            className="modal-collection-prompt-input-rm"
          />
        </div>
      </ModalTemplate.Main>

      <ModalTemplate.Footer>
        <Modal.Action.Cancel className="modal-collection-action-rm modal-collection-cancel-rm">
          Cancel
        </Modal.Action.Cancel>
        <Modal.Action.Custom
          className="modal-collection-action-rm modal-collection-confirm-rm"
          confirmType={state}
        >
          Confirm
        </Modal.Action.Custom>
      </ModalTemplate.Footer>
    </ModalTemplate>
  );
};
```
