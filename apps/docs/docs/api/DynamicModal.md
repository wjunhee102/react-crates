---
sidebar_position: 4
---

# DynamicModal

- `DynamicModal`은 `React 컴포넌트`의 `자연스러운 흐름에 따라 구현`할 수 있는 모달입니다.
- 기존의 모달 개발 방식을 활용하여 직관적으로 모달을 구성하고 관리할 수 있습니다.
- `props`를 통해 기존 modal처럼 설정할 수 있습니다.

### DynamicModal Props

| Property                 | Type                        | Default | Description                                                                             |
| :----------------------- | :-------------------------- | :------ | :-------------------------------------------------------------------------------------- |
| backCoverConfirm         | `boolean \| string \| null` | -       | `null` 일 경우 동작하지 않습니다.                                                       |
| backCoverColor           | `string`                    | -       | `back cover`의 색상을 지정할 수 있습니다.                                               |
| backCoverOpacity         | `number`                    | -       | `back cover`의 투명도를 지정할 수 있습니다.                                             |
| escKeyActive             | `boolean`                   | -       | esc 버튼으로 cancel action을 실행시킬 수 있습니다.                                      |
| closeDelay               | `number`                    | -       | modal이 설정한 delay후 close 됩니다.                                                    |
| duration                 | `number`                    | -       | modal이 생성, 닫힐 때 실행되는 transition의 속도입니다.                                 |
| transitionOptions        | `object`                    | -       | `ModalTransitionOptions` <br /> modal이 생성, 닫힐 때 실행되는 transition의 옵션입니다. |
| position                 | `string \| function`        | -       | `((breakPoint: number) => string)` <br /> modal의 위치를 설정할 수 있습니다.            |
| stateResponsiveComponent | `boolean`                   | -       | modalActionState에 따라 자동으로 Modal Componet가 변경됩니다.                           |
