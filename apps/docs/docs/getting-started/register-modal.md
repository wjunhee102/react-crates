---
sidebar_position: 4
---

# Modal 등록하기

- Modal Component를 만들었으면 Modal을 등록해야 합니다.
- Modal를 불러올 name과 defaultOptions을 설정하여 등록할 수 있습니다.

### generateModal을 이용한 modal 등록

- generateModal을 위한 파일을 생성해주세요.
- modal 개별 default options을 설정하거나 전체 modal에 적용될 options을 설정해주세요.
- 자세한 설명은 [`generateModal - API`](/docs/api/generateModal)을 참고해주세요.

```tsx title="modal.ts"
"use client" // CRA를 이용하여 개발하실 경우 제거하셔도 됩니다.

import { generateModal } from "@react-crates/modal";
import ExampleModal from "./ExampleModal";

export const {
  ModalProvider,
  modalCtrl,
  DynamicModal,
  useInOpenModal
} = generateModal({
  // 이름은 일부 예약어를 제외하고는 자유롭게 적으시면 됩니다.
  confirm: {
    component: ExampleModal,
    defaultOptions: {
      ...
    }
  }
}, {
	...defaultOptions
});

```

#### 예약어

해당 이름으로 모달을 만들경우 무시됩니다.

`clear` `unknown` `open` `close`
`edit` `remove` `action `

### ModalProvider를 배치하기

- ModalProvider를 application 트리에 배치에 해주세요.
- root component에 배치하는 것을 추천합니다.

#### CRA

```tsx title="./src/App.tsx"
import { ModalProvider } from "@/libs/modal/modal";

export default function App() {
  return (
    <div>
      <YourComponent />
      <ModalProvider />
    </div>
  );
}

// or

export default function App() {
  return (
    <div>
      <ModalProvider>
        <YourComponent />
      </ModalProvider>
    </div>
  );
}
```

#### Next.js

```tsx title="./app/layout.tsx"
...
import { ModalProvider } from "@/libs/modal/modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  ...
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ModalProvider />
      </body>
    </html>
  );
}

// or

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}

```
