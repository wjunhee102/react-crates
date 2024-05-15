---
sidebar_position: 2
---

# 설치

## 설치하기

**npm**

```cmd
npm install --save @react-crates/modal
```

**yarn**

```cmd
yarn add @react-crates/modal
```

**pnpm**

```cmd
pnpm add @react-crates/modal
```

## The gist

```tsx
import React from "react";

import { generateModal, modalCollection } from "@react-crates/modal";

const { modalCtrl, ModalProvider } = generateModal({
  ...modalCollection,
});

function App() {
  const alert = () => modalCtrl.alert("알림");

  return (
    <div>
      <button onClick={alert}>알림</button>
      <ModalProvider />
    </div>
  );
}
```
