# React-Modal

React-Modal을 이용하면 모달을 쉽게 관리하고 사용할 수 있습니다.

## Installation

```
$ npm install --save @junhee_h/react-modal
$ yarn add @junhee_h/react-modal
$ pnpm add @junhee_h/react-modal
```

## Features

- 모달을 쉽게 개발하고 재사용할 수 있습니다.
- 모달을 사용하는 쪽에서 실행 결과를 결정합니다.
- 원하는 애니메이션을 쉽게 관리하고 사용할 수 있습니다.
- 화면사이즈에 따라 포지션을 바꿀 수 있습니다.
- React Component 외부에서 실행할 수 있습니다.

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

준비중입니다!

## License

Licensed under MIT
