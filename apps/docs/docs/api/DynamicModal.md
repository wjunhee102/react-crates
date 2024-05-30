---
sidebar_position: 4
---

# DynamicModal

- `DynamicModal`은 `React 컴포넌트`의 `자연스러운 흐름에 따라 구현`할 수 있는 모달입니다.
- [`DynamicModal 사용법`](/docs/usage/use-dynamic-modal)

## DynamicModal의 구성

```tsx
<DynamicModal>
  <DynamicModal.Trigger />
  <DynamicModal.Element>
    <DynamicModal.Action />
    <DynamicModal.Action.Cancel />
    <DynamicModal.Action.Confirm />
    <DynamicModal.Action.Custom />
  </DynamicModal.Element>
</DynamicModal>
```

### DynamicModal

- DynamicModal를 선언하는 component입니다.

### DynamicModal.Trigger

- DynamicModal를 open 시키기 위한 component입니다.

### DynamicModal.Element

- Modal이 open됐을 때 나타나는 component입니다.

### DynamicModal.Action

```tsx
<DynamicModal.Action />
<DynamicModal.Action.Cancel />
<DynamicModal.Action.Confirm />
<DynamicModal.Action.Custom />
```

- Modal.Action과 동일한 Component입니다. [`Modal.Action API Reference`](/docs/api/Modal)

## DynamicModalProps

```ts
interface DynamicModalProps {
  action?: ModalCallback;
  backCoverConfirm?: string | boolean | null;
  backCoverColor?: string;
  backCoverOpacity?: number;
  escKeyActive?: boolean;
  enterKeyActive?: boolean;
  closeDelay?: number;
  duration?: number;
  transitionOptions?: {
    transitionProperty: string;
    transitionTimingFunction: string;
    transitionDelay: string;
  };
  position?: string;
  stateResponsiveComponent?: boolean;
  onOpenAutoFocus?: FocusEventHandler<HTMLDivElement>;
}
```

### DynamicModalProps

| Property                 | Type                        | Default | Description                                                                                                          |
| :----------------------- | :-------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------- |
| action                   | `function`                  | -       | `(confirm?: boolean \| string) => void \| Promise<void>` <br />modal의 action을 실행시켰을때 동작할 callback 입니다. |
| backCoverConfirm         | `boolean \| string \| null` | -       | `null` 일 경우 동작하지 않습니다.                                                                                    |
| backCoverColor           | `string`                    | -       | `back cover`의 색상을 지정할 수 있습니다.                                                                            |
| backCoverOpacity         | `number`                    | -       | `back cover`의 투명도를 지정할 수 있습니다.                                                                          |
| escKeyActive             | `boolean`                   | -       | esc 버튼으로 cancel action을 실행시킬 수 있습니다.                                                                   |
| closeDelay               | `number`                    | -       | modal이 설정한 delay후 close 됩니다.                                                                                 |
| duration                 | `number`                    | -       | modal이 생성, 닫힐 때 실행되는 transition의 속도입니다.                                                              |
| transitionOptions        | `object`                    | -       | `ModalTransitionOptions` <br /> modal이 생성, 닫힐 때 실행되는 transition의 옵션입니다.                              |
| position                 | `string \| function`        | -       | `((breakPoint: number) => string)` <br /> modal의 위치를 설정할 수 있습니다.                                         |
| stateResponsiveComponent | `boolean`                   | -       | modalActionState에 따라 자동으로 Modal Componet가 변경됩니다.                                                        |
| onOpenAutoFocus          | `function`                  | -       | `FocusEventHandler<HTMLDivElement>`                                                                                  |

### ModalTransitionOptions

| Property                 | Type     | Default | Description |
| :----------------------- | :------- | :------ | :---------- |
| transitionProperty       | `string` | -       | -           |
| transitionTimingFunction | `string` | -       | -           |
| transitionDelay          | `string` | -       | -           |
