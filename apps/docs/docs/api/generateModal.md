---
sidebar_position: 1
---

# generateModal

```tsx
import { generateModal } from "@react-crates/modal";

const {
  modalCtrl,
  ModalProvider,
  DynamicModal,
  useInOpenModal,
  modalManager
} = generateModal({
  [Name: string]: {
    component: ModalFC<T = any, string = string>;
    defaultOptions?: {
      payload?: T;
      modalKey?: string;
      action?: (confirm?: boolean | string) => void | Promise<void>;
      middleware?: ModalMiddleware;
      backCoverConfirm?: boolean | string | null
      backCoverColor?: string;
      backCoverOpacity?: number;
      escKeyActive?: boolean;
      closeDelay?: number;
      duration?: number;
      transitionOptions?: {
        transitionProperty?: string;
        transitionTimingFunction?: string;
        transitionDelay?: string;
      };
      position?: string | ((breakPoint: number) => string);
      stateResponsiveComponent?: boolean;
      onOpenAutoFocus?: FocusEventHandler<HTMLDivElement>;
      label?: string;
      role?: string;
      title?: React.ReactNode;
      subTitle?: React.ReactNode;
      content?: React.ReactNode;
      subContent?: React.ReactNode;
      confirmContent?: React.ReactNode;
      cancelContent?: React.ReactNode;
      customActionContent?: React.ReactNode;
      required?: boolean;
    }
  }
},
{
  stateResponsiveComponent?: boolean;
  backCoverColor?: string;
  backCoverOpacity?: number;
  duration?: number;
  transition?: {
    transitionProperty?: string;
    transitionTimingFunction?: string;
    transitionDelay?: string;
  };
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
        className?: string;
      }
    }
  };
});
```

## Return

### ModalProvider

modal component가 렌더되는 곳입니다. [링크](/docs/api/ModalProvider)

### modalCtrl

modal을 실행시키기 위한 ctrl입니다. [링크](/docs/api/modalCtrl)

### DynamicModal

React Component내에 사용가능한 Modal입니다. [링크](/docs/api/DynamicModal)

### useInOpenModal

modal이 open 유무를 확인할 수 있는 hook입니다. [링크](/docs/api/useInOpenModal)

## API Reference

### generateModal

| Property                | Type     | Default | Description                              |
| :---------------------- | :------- | :------ | :--------------------------------------- |
| modalComponentSeedTable | `object` | -       | `{ [Name: string]: ModalComponentSeed }` |
| options                 | `object` | -       | `ModalManagerOptionsProps`               |

### ModalComponentSeed

| Property       | Type       | Default      | Description                    |
| :------------- | :--------- | :----------- | :----------------------------- |
| component      | `function` | - `required` | `ModalFC<T = any, P = string>` |
| defaultOptions | `object`   | -            | `ModalDefaultOptions<T>`       |

### ModalDefaultOptions `<T = any>`

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
| required                 | `boolean`                       | -       | 등록된 modal이 덮혀씌워지지 않거나 지워지지 않습니다.                                                                |

### ModalManagerOptionsProps

등록한 모달 전체의 default 값을 설정할 수 있습니다.

| Property                 | Type      | Default              | Description                                                                             |
| :----------------------- | :-------- | :------------------- | :-------------------------------------------------------------------------------------- |
| stateResponsiveComponent | `boolean` | `false`              | modal이 actionState에 따라 자동으로 변경됩니다.                                         |
| backCoverColor           | `string`  | `"rgb(0, 0, 0)"`     | `back cover`의 색상을 지정할 수 있습니다.                                               |
| backCoverOpacity         | `number`  | `0.5`                | `back cover`의 투명도를 지정할 수 있습니다.                                             |
| duration                 | `number`  | `200`                | modal이 생성, 닫힐 때 실행되는 transition의 속도입니다.                                 |
| transitionOptions        | `object`  | `DEFAULT_TRANSITION` | `ModalTransitionOptions` <br /> modal이 생성, 닫힐 때 실행되는 transition의 옵션입니다. |
| position                 | `object`  | `DEFAULT_POSITION`   | `[Name: string]: ModalPositionTable`                                                    |

### ModalTransitionOptions

| Property                 | Type     | Default | Description |
| :----------------------- | :------- | :------ | :---------- |
| transitionProperty       | `string` | -       | -           |
| transitionTimingFunction | `string` | -       | -           |
| transitionDelay          | `string` | -       | -           |

### ModalPositionTable

| Property | Type     | Default      | Description                                                          |
| :------- | :------- | :----------- | :------------------------------------------------------------------- |
| open     | `object` | - `required` | `ModalPositionStyle` <br /> modal이 최초 생성될 때 position입니다.   |
| active   | `object` | - `required` | `ModalPositionStyle` <br /> modal이 active 상태일 때 position입니다. |
| close    | `object` | - `required` | `ModalPositionStyle` <br /> modal이 close 될 때 position입니다.      |

### ModalPositionStyle

| Property   | Type     | Default | Description |
| :--------- | :------- | :------ | :---------- |
| left       | `string` | -       | -           |
| right      | `string` | -       | -           |
| top        | `string` | -       | -           |
| bottom     | `string` | -       | -           |
| transform  | `string` | -       | -           |
| opacity    | `number` | -       | -           |
| background | `string` | -       | -           |
| className  | `string` | -       | -           |

## Default

### DEFAULT_TRANSITION

```ts
{
  transitionProperty:
    "opacity, transform, left, top, bottom, right, background, background-color",
  transitionDelay: "0ms",
  transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
}
```

### DEFAULT_POSITION

```ts
{
  default: {
    open: {
      opacity: 0,
    },
    active: {
      opacity: 1,
    },
    close: {
      opacity: 0,
    },
  },
  center: {
    open: {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) scale(0.95)",
    },
    active: {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) scale(1)",
    },
    close: {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) scale(0.95)",
    },
  },
  bottom: {
    open: {
      left: "50%",
      top: "100%",
      transform: "translate(-50%, 0)",
    },
    active: {
      left: "50%",
      top: "100%",
      transform: "translate(-50%, -100%)",
    },
    close: {
      left: "50%",
      top: "100%",
      transform: "translate(-50%, 0)",
    },
  },
  top: {
    open: {
      left: "50%",
      top: "0",
      transform: "translate(-50%, -100%)",
    },
    active: {
      left: "50%",
      top: "0",
      transform: "translate(-50%, 0)",
    },
    close: {
      left: "50%",
      top: "0",
      transform: "translate(-50%, -100%)",
    },
  },
  left: {
    open: {
      left: "0",
      top: "50%",
      transform: "translate(-100%, -50%)",
    },
    active: {
      left: "0",
      top: "50%",
      transform: "translate(0, -50%)",
    },
    close: {
      left: "0",
      top: "50%",
      transform: "translate(-100%, -50%)",
    },
  },
  right: {
    open: {
      left: "100%",
      top: "50%",
      transform: "translate(0, -50%)",
    },
    active: {
      left: "100%",
      top: "50%",
      transform: "translate(-100%, -50%)",
    },
    close: {
      left: "100%",
      top: "50%",
      transform: "translate(0, -50%)",
    },
  },
  leftTop: {
    open: {
      left: "0",
      top: "0",
      transform: "translate(-100%, -100%) scale(0)",
    },
    active: {
      left: "0",
      top: "0",
      transform: "translate(0, 0) scale(1)",
    },
    close: {
      left: "0",
      top: "0",
      transform: "translate(-100%, -100%) scale(0)",
    },
  },
  leftBottom: {
    open: {
      left: "0",
      top: "100%",
      transform: "translate(-100%, 0) scale(0)",
    },
    active: {
      left: "0",
      top: "100%",
      transform: "translate(0, -100%) scale(1)",
    },
    close: {
      left: "0",
      top: "100%",
      transform: "translate(-100%, 0) scale(0)",
    },
  },
  rightTop: {
    open: {
      left: "100%",
      top: "0",
      transform: "translate(0, -100%) scale(0)",
    },
    active: {
      left: "100%",
      top: "0",
      transform: "translate(-100%, 0) scale(1)",
    },
    close: {
      left: "100%",
      top: "0",
      transform: "translate(0, -100%) scale(0)",
    },
  },
  rightBottom: {
    open: {
      left: "100%",
      top: "100%",
      transform: "translate(0, 0) scale(0)",
    },
    active: {
      left: "100%",
      top: "100%",
      transform: "translate(-100%, -100%) scale(1)",
    },
    close: {
      left: "100%",
      top: "100%",
      transform: "translate(0, 0) scale(0)",
    },
  },
  backCover: {
    open: {
      top: "0",
      left: "0",
      background: "rgb(0, 0, 0)",
      opacity: 0,
    },
    active: {
      top: "0",
      left: "0",
      background: "rgb(0, 0, 0)",
      opacity: 0.5,
    },
    close: {
      top: "0",
      left: "0",
      background: "rgb(0, 0, 0)",
      opacity: 0,
    },
  },
};
```
