# 목표

1. modal service 분리 역할 분명히
2. modal state service 역할 분명히
3. modal component 역할 분명히

### 2023년 7월 1일 토요일

set 함수를 이용하고 modal 이란 함수로 modal open 함수로 만들기.
key 값으로 open 만들면 될 것 같음.
export로 기본 modal로도 사용할 수 있게 할 것.
그러면 modal open 문제도 해결.
callback에 넘겨줄 인자를 타입으로 따로 만들면 modal state manager에서 분리 가능할 것 같다.
callback에서는 modal component 바꿀 수 있고 modal state를 바꿀 수 있음.
바꿀 수 있는 것을 리스트업 할 것.

### 2024년 3월 30일 토요일

일단 기존 코드를 정리하고 해석해가면서 수정할 것.
Modal 컴포넌트를 ModalComponent로 변경하면서 ModalFiber를 Modal로 변경. 그러면서 기존에 ModalFiber와 혼재된 것을 정리함
Modal: Modal의 상태를 관리
ModalSeed: Modal 객체를 생성하기 위한 seed 데이터

### 2024년 3월 31일 일요일

modal action state에 따라 component를 변경하는 기능을 만듬.
그러나 modal이 정리되지 않고 중복되는 method들이 있어 한번 리팩토링을 해야할 것 같음.
그리고 내일은 테스트 코드를 작성할 것.
테스트 케이스는 상태별 잘 컴포넌트가 변경되는지 파악을 해보면 될 것 같음.
이제 이걸 데모 사이트를 만들고 구동을 해봐야 할 것 같음.

### 2024년 4월 1일 월요일

modal과 modalManager가 순환 참조하고 있기 때문에 modal에서 필요한 메소드들만 interface화해서 전달하게 함.
그리고 이 interface를 기준으로 서로 추상화된 메소드들이 필요한 것을 기준으로 type을 정리해야할 것 같음.

### 2024년 4월 2일 화요일

modalManager를 인터페이스화 시킬 예정이다.
타입을 분리하고 service의 메소드들을 기능에 따라 분류함.

### modal manager

1. modal default options 저장

- modal component
- modal

### modal dispatcher

### modal component

모달 action 상태는

- initial
- pending
- success
- error
- final

지금 목표로 하는 기능은 각 상태마다 기존의 등록된 모달 컴포넌트의 형태를 하거나 아니면 사용자가 원하는 모달을 주입해서 해당 모달의 형태가 되길 원함.

그래서 현재 하는 것은 componentProps를 살펴보는 것.
componentProps가 아니라 component가 바뀌어야 함.

## Modal manager

모달 생성 모달 생성 options? seed 저장 및 관리
모달 생성
모달 제거
모달 수정

## Modal state manager

- 모달 상태 관리
- 모달 현재 옵션 관리
- 상태
- modal component table 관리?
- get Modal Component 함수 전달

  1. 모달 생애
  1. 모달 진행 상태
  1. 현재 모달의 컴포넌트

## 2023년 8월 25일 Modal Component Fiber 문제

### Case 1

1. Modal Component Fiber의 property의 값은 항상 존재할 것.
1. 처음에 세팅할 때 값이 없으면 initial의 값을 넣어줄 것.

### Case 2

1. Modal Component Fiber의 property의 값은 없을 수 도 있음.
1. 만약 값이 없으면 modal state에서 변경할 것.

### Case 3

1. Modal Component Fiber의 property의 값은 항상 존재할 것.
1. 처음에 세팅할 때 값이 없으면 default의 값을 넣어줄 것.

### Case 3로 채택

- 이유는 만약 initial만 사용할 거면 action state를 initial에서 변경하지 않으면 되기 때문.
- action state를 변경할때 빈 값이면 해당 modal component의 값을 불러오고 string을 받으면 존재하는 modal map에서 불러오고
- Component를 넣으면 해당 Component를 불러올 것.
