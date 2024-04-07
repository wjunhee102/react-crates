# React-Modal

React-Modal을 이용하면 모달을 쉽게 관리하고 사용할 수 있습니다.

## Installation

```
$ npm install --save @junhee_h/react-modal
$ yarn add @junhee_h/react-modal
$ pnpm add @junhee_h/react-modal
```

## Features

- 이 모달 라이브러리는 개발 효율성을 높이기 위해 모달의 쉬운 생성 및 재사용을 가능하게 합니다.
- React 프로젝트에 `window.alert`, `window.confirm`을 효과적으로 대체할 수 있습니다.
- 실행 결과의 사용자 정의 가능성을 제공하며, 원하는 애니메이션을 쉽게 통합하고 화면 크기에 따라 위치를 조정할 수 있습니다.
- React Component 외부에서 실행할 수 있습니다.
- 제로 의존성(zero dependencies) 라이브러리입니다.

## The gist

```javascript
import React from "react";

import { generateModal, Modal } from "@junhee_h/react-modal";

const { modalCtrl, ModalProvider } = generateModal({
  alert: {
    component: () => (
      <div>
        <Modal.Content />
        <Modal.Action>확인</Modal.Action>
      </div>
    ),
    defaultOptions: {
      position: (breakPoint) => (breakPoint > 480 ? "center" : "bottom"),
    },
  },
});

function App() {
  const alert = () => modalCtrl.alert({ content: "알림" });

  return (
    <div>
      <button onClick={alert}>알림</button>
      <ModalProvider />
    </div>
  );
}
```

## Demo

설명서에 나와있는 내용을 [데모](https://codesandbox.io/p/sandbox/junhee-h-react-modal-cd4j7m?file=%2Fsrc%2FApp.tsx)에서 확인해보세요.

## API

### generateModal

```tsx
// modal.ts
import { generateModal } from "@junhee_h/react-modal";

const {
  modalCtrl, // modal을 실행시키기 위한 ctrl입니다.
  ModalProvider, // modal component가 렌더되는 곳입니다.
  DynamicModal, // React Component내에 사용가능한 Modal입니다.
  useInOpenModal // modal이 open 유무를 확인할 수 있는 hook입니다.
} = generateModal({
  [Name: string]: {
    component: ModalFC<T = any, string = string>;
    // modal의 기본 설정을 등록할 수 있습니다.
    defaultOptions?: {
      payload?: T; // modal과 통신이 필요할 때 사용할 수 있습니다.
      modalKey?: string; // 동일한 modal이 동시에 실행되지 않게 할 수 있습니다.
      // modal의 action을 실행시켰을때 동작할 callback 입니다.
      action?: (confirm?: boolean | string) => void | Promise<void>;
      // action callback을 인터셉터하여 원하는 로직을 수행하게 할 수 있습니다.
      middleware?: ModalMiddleware;
      backCoverConfirm?: boolean | string | null //null 일 경우 동작하지 않습니다.
      backCoverColor?: string;
      backCoverOpacity?: number;
      escKeyActive?: boolean; // esc 버튼으로 cancel action을 실행시킬 수 있습니다.
      enterKeyActive?: boolean; // enter 버튼으로 enter action을 실행시킬 수 있습니다.
      closeDelay?: number; // modal이 설정한 delay후 close 됩니다.
      duration?: number; // modal이 생성, 닫힐 때 실행되는 애니메이션 속도입니다.
      transitionOptions?: {
        transitionProperty?: string;
        transitionTimingFunction?: string;
        transitionDelay?: string;
      };
      // modal의 위치를 설정할 수 있습니다.
      position?: string | ((breakPoint: number) => string);
      // modalActionState에 따라 자동으로 Modal Componet가 변경됩니다.
      stateResponsiveComponent?: boolean;
      // 등록된 modal이 덮혀씌워지지 않거나 지워지지 않습니다.
      required?: boolean;
      // 동적으로 modal의 내용을 입력할 수 있습니다.
      title?: React.ReactNode;
      subTitle?: React.ReactNode;
      content?: React.ReactNode;
      subContent?: React.ReactNode;
      confirmContent?: React.ReactNode;
      cancelContent?: React.ReactNode;
      customActionContent?: React.ReactNode;
    }
  }
},
// 등록한 모달 전체의 default 값을 설정할 수 있습니다.
{
  stateResponsiveComponent?: boolean; // modal이 actionState에 따라 자동으로 변경
  backCoverColor?: string;
  backCoverOpacity?: number;
  duration?: number;
  transition?: {
    transitionProperty?: string;
    transitionTimingFunction?: string;
    transitionDelay?: string;
  };
  // modal의 position을 등록할 수 있습니다.
  position?: {
    [Name: string]: {
      [open | active | close]: {
        left?: string;
        right?: string;
        top?: string;
        bottom?: string;
        transform?: string;
        opacity?: number;
        background?: string;
      }
    }
  };
});
```

### modalCtrl

```tsx
import { modalCtrl } from "./modal.ts";

/*
  modalCtrl.open의 첫번째 인자
*/

// modal name
modalCtrl.open("alert");

// 동적 modal 생성
modalCtrl.open(() => <div>alert</div>);

/*
  modalCtrl.open의 두번째 인자
*/

// modal action
modalCtrl.open("alert", (confirm?: boolean | string) => {
  ... // confirm에 따라 수행할 로직을 작성하시면 됩니다.
});

// modal dispatch options
modalCtrl.open("alert", {
  payload?: T; // modal과 통신이 필요할 때 사용할 수 있습니다.
  modalKey?: string; // 동일한 modal이 동시에 실행되지 않게 할 수 있습니다.
  // modal의 action을 실행시켰을때 동작할 callback 입니다.
  action?: (confirm?: boolean | string) => void | Promise<void>;
  // action callback을 인터셉터하여 원하는 로직을 수행하게 할 수 있습니다.
  backCoverConfirm?: boolean | string | null //null 일 경우 동작하지 않습니다.
  backCoverColor?: string;
  backCoverOpacity?: number;
  escKeyActive?: boolean; // esc 버튼으로 cancel action을 실행시킬 수 있습니다.
  enterKeyActive?: boolean; // enter 버튼으로 enter action을 실행시킬 수 있습니다.
  closeDelay?: number; // modal이 설정한 delay후 close 됩니다.
  duration?: number; // modal이 생성, 닫힐 때 실행되는 애니메이션 속도입니다.
  transitionOptions?: {
    transitionProperty?: string;
    transitionTimingFunction?: string;
    transitionDelay?: string;
  };
  // modal의 위치를 설정할 수 있습니다.
  position?: string | ((breakPoint: number) => string);
  // modalActionState에 따라 자동으로 Modal Componet가 변경됩니다.
  stateResponsiveComponent?: boolean;
  // 동적으로 modal의 내용을 입력할 수 있습니다.
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  subContent?: React.ReactNode;
  confirmContent?: React.ReactNode;
  cancelContent?: React.ReactNode;
  customActionContent?: React.ReactNode;
});

```

## Documentation

### 설치

```markdown
$ npm install --save @junhee_h/react-modal
$ yarn add @junhee_h/react-modal
$ pnpm add @junhee_h/react-modal
```

### 초기 설정

- modal.ts 파일에 `generateModal`에 `modal을 등록하고 초기 option값을 설정`합니다.

```tsx
// modal.ts
import { generateModal } from "@junhee_h/react-modal";

export const { modalCtrl, ModalProvider, DynamicModal, useInOpenModal } =
  generateModal(...modalComponents, ...defaultOptions);

// App.tsx
import { ModalProvider } from "./modal";

function App() {
  return (
    <div>
      ...
      <ModalProvider />
    </div>
  );
}
```

### Modal Component 만들기

```tsx
// ExampleModal.tsx
import { ModalFC } from "@junhee_h/react-modal";

const ExampleModal: ModalFC = ({
	title,
	content,
	confirmContent,
	cancelContent,
	action
}) => {
  return (
    <div>
      <h2>{title || "타이틀"}</h2>
      <p>{content || "내용"}</p>
      <button onClick={() => action(false)}>
        {confirmContent || "취소"}
      </button>
      <button onClick={() => action(true)}>
        {cancelContent || "확인"}
      </button>
    </div>
  );
}

// ModalComponentProps은 아래와 같이 구성되어 있습니다.

interface ModalComponentProps<T> {
  title?: ReactNode;
  subTitle?: ReactNode;
  content?: ReactNode;
  subContent?: ReactNode;
  confirmContent?: ReactNode;
  cancelContent?: ReactNode;
  customActionContent?: ReactNode;
  // modal의 action 상태
  actionState: "initial" | "pending" | "success" | "error";
  action: (confirm?: string | boolean) => void; // modal 실행
  payload?: T; // modal 통신이 필요하면 해당 프로퍼티를 활용해보세요.
}

--
// Modal을 이용한 ModalComponent 만들기

import { Modal } from "@junhee_h/react-modal";

const ExampleModal = () => {
  return (
    <div>
      {/* modal을 open할 때 children으로 입력한 값을 대치합니다. */}
      <Modal.Title>타이틀</Modal.Title>
      <Modal.Content>내용</Modal.Content>
      <Modal.Action.Cancel>취소</Modal.Action.Cancel>
      <Modal.Action.Confirm>확인</Modal.Action.Confirm>
    </div>
  );
}

// Modal Util Component 목록

<Modal.Title />
<Modal.SubTitle />
<Modal.Content />
<Modal.SubContent />
<Modal.Action />
<Modal.Action.Confirm />
<Modal.Action.Cancel />
<Modal.Action.Custom />

// modal.ts
import { generateModal } from "@junhee_h/react-modal";
import ExampleModal from "./ExampleModal";

export const { modalCtrl } = generateModal({
	// 이름은 일부 예약어를 제외하고는 자유롭게 적으시면 됩니다.
  confirm: {
    component: ExampleModal,
    defaultOptions: {
      ...
    }
  }
}, {
	...
});

// reserved modal name
// 해당 이름으로 모달을 만들경우 무시됩니다.
type ReservedModalName =
  | "clear"
  | "unknown"
  | "open"
  | "close"
  | "edit"
  | "remove"
  | "action"
  ;
```

### Modal 사용

```tsx
import { modalCtrl } from "./modal";

function Example() {
  const confirm = () => {

    // 등록한 모달의 이름을 입력합니다.
    modalCtrl.open("confirm");

    // modal을 등록하면 controller 메소드로 형성됩니다.
    modalCtrl.confirm();

    // modal의 버튼을 클릭했을 시 실행될 함수를 입력할 수 있습니다.
    modalCtrl.confirm((confirm?: boolean | string) => {
      if (confirm === true) {
        ... // 확인 버튼을 클릭했을 때
      } else if (confirm === false {
        ... // 취소, back cover를 클릭했을 때
      } else if (confirm === string /* 사용자 정의 */) {
        ... // 확인 취소 이외에 action이 필요할 경우
      }
    });

    // modal의 action에서 비동기 함수를 실행 시킬 수 있습니다.
    modalCtrl.confirm(async (confirm?: boolean | string) => {
      if (confirm === true) {
        const result = await someAsyncCallback();

        console.log(result);
      } else {
        console.log("취소");
      }
    }
  }

  return (
    <div>
      <button onClick={alert}>alert</button>
    </div>
  );
}
```

- `Modal의 콘텐츠`를 동적으로 설정할 수 있습니다.

```tsx
function Example() {
  const confirm = () => {
    modalCtrl.open({
      title: "확인해주세요.",
      content: "확인하시겠습니까?",
      cancelContent: "취소 버튼",
      confirmContent: "확인 버튼",
    });
  };

  return (
    <div>
      <button onClick={alert}>alert</button>
    </div>
  );
}

/*
  <div>
    <h2>알림 제목</h2> <- Modal.Title
    <p>알림입니다.</p> <- Modal.Content
    <button>취소 버튼</button> <- Modal.Action.Cancel
    <button>확인 버튼</button> <- Modal.Action.Confirm
  </div>
*/
```

### Modal 동적 생성

- `Modal을 동적`으로 생성할 수 있습니다.

```tsx
import { modalCtrl } from "./modal";

function Example() {
  const confirm = () => {
    modalCtrl.open(() => (
      <div>
        <Modal.Title>타이틀</Modal.Title>
        <Modal.Content>내용</Modal.Content>
        <Modal.Action.Cancel>취소</Modal.Action.Cancel>
        <Modal.Action.Confirm>확인</Modal.Action.Confirm>
      </div>
    ));
  };

  return (
    <div>
      <button onClick={confirm}>alert</button>
    </div>
  );
}
```

### Modal Positioning

- `position`을 원하는 위치에 따라 불러올 수 있습니다.
- `position`을 조합하여 사용할 수 있습니다.
- `breakPoint(width)`에 따라 `position`을 다르게 위치시킬 수 있습니다.

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
import { generateModal } from "@junhee_h/react-modal";

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

### Modal Active State

- `Modal action` 실행 중에 상태를 변경하여 `Modal의 Component`를 변경할 수 있습니다.
- `비동기 action`을 위해 만들졌습니다.
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

### Modal Action State 활용

```tsx
// modal.ts
import { generateModal } from "@junhee_h/react-modal";

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
import { ModalFC } from "@junhee_h/react-modal";

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
- `AfterCloseCallback`은 `“success”, “error”, “end”` 메소드만 등록할 수 있습니다.

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

### DynamicModal

- `React Component 내부에 code에 흐름`따라 작성하여 사용할 수 있는 Modal입니다.
- 일반적인 Modal의 개발 방식대로 사용할 수 있습니다.

```tsx
import { generateModal } from "@junhee_h/react-modal";

export const { DynamicModal } = generateModal();

function Example() {
  return (
    <div>
      <DynamicModal>
        {/* trigger는 모달을 open하는 버튼입니다. */}
        <DynamicModal.Trigger>confirm</DynamicModal.Trigger>

        {/* element 내부의 component가 modal로 출력됩니다. */}
        <DynamicModal.Element>
          <div>
            <h2>타이틀</h2>
            <p>내용</p>
            <DynamicModal.Action.Confirm>취소</DynamicModal.Action.Confirm>
            <DynamicModal.Action.Confirm>확인</DynamicModal.Action.Confirm>
          </div>
        </DynamicModal.Element>
      </DynamicModal>
    </div>
  );
}
```

## License

Licensed under MIT
