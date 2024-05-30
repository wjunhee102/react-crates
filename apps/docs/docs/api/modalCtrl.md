---
sidebar_position: 3
---

# modalCtrl

- `modalCtrl`은 modal을 `open`하거나 `remove` 또는 원격으로 특정 modal의 `action`을 실행시키는 역할을 가진 객체입니다.
- modal을 등록하면 `modal의 name`을 가진 method가 추가되어 해당 `modal을 open`시킬 수 있습니다.

## modalCtrl methods

| method                  | Description                                   |
| :---------------------- | :-------------------------------------------- |
| open                    | modal를 open 시킵니다.                        |
| remove                  | open 되어 있는 modal을 제거합니다.            |
| action                  | open 되어 있는 modal의 action을 실행시킵니다. |
| ...registeredModalNames | 등록한 modal의 open 시킵니다.                 |

## modalCtrl.open 첫번째 인자

등록한 modal의 name을 인자로 주어 등록된 modal을 open하거나 동적으로 modal을 open할 수 있습니다.

### Props

| Property | Type                   | Default      | Description                                      |
| :------- | :--------------------- | :----------- | :----------------------------------------------- |
| name     | `string` \| `function` | - `required` | modal의 name 또는 `ModalFC<T = any, P = string>` |

### 예제

#### modal name

```tsx
modalCtrl.open("alert");
```

#### 동적 modal 생성

```tsx
modalCtrl.open(() => <div>alert</div>);
```

## modalCtrl.open의 두번째 인자

### props

| Property | Type                   | Default | Description                                     |
| :------- | :--------------------- | :------ | :---------------------------------------------- |
| options  | `function` \| `object` | -       | modal의 `action` 또는 `ModalDispatchOptions<T>` |

### 예제

#### modal action

```ts
modalCtrl.open("alert", (confirm?: boolean | string) => {
  ... // confirm에 따라 수행할 로직을 작성할 수 있습니다.
});
```

#### modal dispatch options

```ts
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

### ModalDispatchOptions `<T = any>`

modal의 기본 설정을 등록할 수 있습니다.

| Property                 | Type                            | Default | Description                                                                                                          |
| :----------------------- | :------------------------------ | :------ | :------------------------------------------------------------------------------------------------------------------- |
| payload                  | `T`                             | -       | modal과 통신이 필요할 때 사용할 수 있습니다.                                                                         |
| modalKey                 | `string`                        | -       | 동일한 modal이 동시에 실행되지 않게 할 수 있습니다.                                                                  |
| action                   | `function`                      | -       | `(confirm?: boolean \| string) => void \| Promise<void>` <br />modal의 action을 실행시켰을때 동작할 callback 입니다. |
| middleware               | `function`                      | -       | `ModalMiddleware` <br /> `action` 을 인터셉터하여 원하는 로직을 수행하게 할 수 있습니다.                             |
| backCoverConfirm         | `boolean` \| `string` \| `null` | -       | `null` 일 경우 동작하지 않습니다.                                                                                    |
| backCoverColor           | `string`                        | -       | `back cover`의 색상을 지정할 수 있습니다.                                                                            |
| backCoverOpacity         | `number`                        | -       | `back cover`의 투명도를 지정할 수 있습니다.                                                                          |
| escKeyActive             | `boolean`                       | -       | esc 버튼으로 cancel action을 실행시킬 수 있습니다.                                                                   |
| closeDelay               | `number`                        | -       | modal이 설정한 delay후 close 됩니다.                                                                                 |
| duration                 | `number`                        | -       | modal이 생성, 닫힐 때 실행되는 transition의 속도입니다.                                                              |
| transitionOptions        | `object`                        | -       | `ModalTransitionOptions` <br /> modal이 생성, 닫힐 때 실행되는 transition의 옵션입니다.                              |
| position                 | `string` \| `function`          | -       | `((breakPoint: number) => string)` <br /> modal의 위치를 설정할 수 있습니다.                                         |
| stateResponsiveComponent | `boolean`                       | -       | modalActionState에 따라 자동으로 Modal Componet가 변경됩니다.                                                        |
| onOpenAutoFocus          | `function`                      | -       | `React.FocusEventHandler<HTMLDivElement>` <br /> modal이 focus 될 때 동작하는 로직을 작성할 수 있습니다.             |
| label                    | `string`                        | -       | 접근성 관련 property입니다.                                                                                          |
| role                     | `string`                        | -       | 접근성 관련 property입니다.                                                                                          |
| title                    | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |
| subTitle                 | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |
| content                  | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |
| subContent               | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |
| confirmContent           | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |
| cancelContent            | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |
| customActionContent      | `React.ReactNode`               | -       | 동적으로 modal의 내용을 입력할 수 있습니다.                                                                          |

## modalCtrl.remove

- 등록한 modal의 name이나 open 되어 있는 modal의 id를 인자로 주어지면 해당하는 open되어 있는 modal을 제거합니다.
- `"clear"` 키워드를 입력하면 open 되어 있는 모든 modal을 제거합니다.

### Props

| Property     | Type                 | Default | Description                       |
| :----------- | :------------------- | :------ | :-------------------------------- |
| removeTarget | `string` \| `number` | -       | modal의 이름 또는 opened modal id |

## modalCtrl.action

- open 되어있는 modal의 action을 원격으로 실행 시킬 수 있습니다.
- `targetModalId`를 입력하지 않을 경우 가장 최근에 open된 modal의 action을 실행시킵니다.

### Prameters

| Prameter      | Type                  | Default | Description        |
| :------------ | :-------------------- | :------ | :----------------- |
| targetModalId | `number`              | -       | opened modal id    |
| confirm       | `string` \| `boolean` | -       | modal confirm type |

## modalCtrl.\[...registeredModalNames\]

- 등록된 modal의 이름으로 된 methods입니다.
- `modalCtrl.open 두번째 인자`와 동일합니다.

### Props

| Property | Type                   | Default | Description                                     |
| :------- | :--------------------- | :------ | :---------------------------------------------- |
| options  | `function` \| `object` | -       | modal의 `action` 또는 `ModalDispatchOptions<T>` |
