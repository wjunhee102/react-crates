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

## Documentation

시작하려면 [설명서](https://wood-prince-6dc.notion.site/React-Modal-Documentation-c8a27e83a5aa4be9bc50e3adf4289ebd?pvs=4)를 확인해주세요.

## Demo

설명서에 나와있는 내용을 [데모](https://codesandbox.io/p/sandbox/junhee-h-react-modal-cd4j7m?file=%2Fsrc%2FApp.tsx)에서 확인해보세요.

## License

Licensed under MIT
