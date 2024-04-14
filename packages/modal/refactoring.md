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

## 2024년 3월 30일 토요일

- 일단 기존 코드를 정리하고 해석해가면서 수정할 것.
- Modal 컴포넌트를 ModalComponent로 변경하면서 ModalFiber를 Modal로 변경. 그러면서 기존에 ModalFiber와 혼재된 것을 정리함
- Modal: Modal의 상태를 관리
- ModalSeed: Modal 객체를 생성하기 위한 seed 데이터

## 2024년 3월 31일 일요일

- modal action state에 따라 component를 변경하는 기능을 만듬.
- 그러나 modal이 정리되지 않고 중복되는 method들이 있어 한번 리팩토링을 해야할 것 같음.
- 그리고 내일은 테스트 코드를 작성할 것.
- 테스트 케이스는 상태별 잘 컴포넌트가 변경되는지 파악을 해보면 될 것 같음.
- 이제 이걸 데모 사이트를 만들고 구동을 해봐야 할 것 같음.

## 2024년 4월 1일 월요일

- modal과 modalManager가 순환 참조하고 있기 때문에 modal에서 필요한 메소드들만 interface화해서 전달하게 함.
- 그리고 이 interface를 기준으로 서로 추상화된 메소드들이 필요한 것을 기준으로 type을 정리해야할 것 같음.

## 2024년 4월 2일 화요일

- modalManager를 인터페이스화 시킬 예정이다.
- 타입을 분리하고 service의 메소드들을 기능에 따라 분류함.

## 2024년 4월 3일 수요일

- services의 어색한 프로퍼티와 메소드명을 변경
- contextAPI로 변경할 예정
- infer를 이용하여 modalDispatchOptions의 payload를 추론하게 하니 타입스크립트 체킹이 느려졌음.
- 원래 복잡한 연산을 하면 느려진다고 함.
- 지금 느린 이유는 Controller 타입과 그 밑에 로직으로 설정한 타입이 달라서 추론이 길어진 것이였음. 동일하게 타입을 설정하니 반응이 빨라짐.
- Modal에 요소와 Provider를 분리 시킴. 그리고 modalManager 의존성 주입을 위해 generateModalSuite를 만들었음.
- 이름이 멋있음.
- @react-libs로 배포를 하려고 했는데 조직이 필요하다고 함. 그래서 조직을 만드려고 했는데 이미 있는 조직이라고 해서 일단은 @junhee_h/react-modal로 배포함.
- 코어라는 명칭을 쓰지 않고 그냥 template을 따로 만들어서 template을 사용하고 싶은 사람에게 따로 받게 하는 식으로 하려고 함.
- 내일은 문서를 작성해서 일단 사용법을 먼저 작성하고 그 다음 그 사용법을 토대로 테스트 코드를 작성하려고 함.

## 2024년 4월 4일 목요일

- stanbyTransaction이 있는 이유를 모르겠어서 파악함.
- modal의 제거중일때와 구분하고 싶어서 idle-stanby-active로 구분한 것 같음.
- 지우기는 애매해서 일단 냅두고 나중에 수정할 것.
- DynamicModal을 만들었고 DynamicModal에서 action을 수행했을때 성공했는지 아닌지 파악을 하기 위해 action에서 결과값을 boolean으로 반환하기로 함.
- 그래서 그 작업 때문에 middleware, manager.action, getCloseModal, modal.action, modal.close 등등이 Promise<boolean>으로 리턴 값이 바뀜.
- modal transaction 동안 modal의 커서가 pointer로 활성화가 되서 그것을 수정하기 위해 modalStyle과 modalBackCoverStyle에 transaction이 idle 상태가 아닐때 default로 커서의 모양을 고정함. 이것을 나중에 not-allowed로 바꿀지 고민중임. 그리고 style을 설정하는 로직이 좀 복잡해서 나중에 한번 리팩토링을 진행해야할 것 같음.
- 그리고 추가로 modal.init에서 transaction이 끝나고 다시 한번 modal의 상태를 업데이트 하는 로직을 넣었음.
- ModalContents를 ModalContent로 바꿈. 이유는 radix-ui에서 content를 단수형으로 쓰기 때문에 통일하고 싶어서 그렇게 넣음.
- ModalAction은 button 고정인데 왜냐면 이건 스타일 컴포넌트가 아니기 때문.
- 내일은 리드미를 작성해야할 것 같음. 추가로 키보드 옵션도 넣어야 할 것 같음.
- position을 따로 등록하지 않으면 추론되지 않는 문제가 있었음.

## 2024년 4월 5일 금요일

- 배포한 패키지에서 예상한 위치에 소스가 없다는 에러메세지가 발생했음.
- WARNING in ./node_modules/@junhee_h/react-modal/dist/esm/index.js
  Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
  Failed to parse source map from '/Users/junhee/react-library/react-modal/node_modules/@junhee_h/react-modal/src/services/modal.ts' file: Error: ENOENT: no such file or directory, open '/Users/junhee/react-library/react-modal/node_modules/@junhee_h/react-modal/src/services/modal.ts'
- 이 문제는 package.json files에 "src"를 포함하면서 해결함.
- react를 16부터 지원하려고 했지만, hook은 16.8부터 제대로 지원하고 17에서는 hoc와 같은 방법으로 setComponent 같은 방법이 지원이 안되서 일단 18버전 부터 하기로 진행함.
- React v17부터 호환되는 것을 확인함.
- 그런데 또 position 타입이 동작하지 않는 것을 확인함.
- modalManagerOptios가 기본값이면 발생하는 문제였음.
- positon 문제는 기본값 설정으로 해결함.
- ModalMeta를 사용하면 component의 payload는 동시에 추론이 되지만 ctrl에서는 추론이 안되서 일단 빼버림.
- readme는 오늘도 작성못함. 아마 내일 해야할 것 같음.
- 키보드 기능도 추가해야 하는데 readme를 작성하고 해야할 것 같음.

## 2024년 4월 6일 토요일

- keyboad 옵션을 추가함.
- focus를 div에 걸기 위해 tabIndex=-1이라는 property를 설정했음. 왜냐면 div에는 그냥 focus가 되지 않기 때문
- 그리고 동시에 여러 모달이 켜져서 다른 모달이 아직 열리고 있는 상태면 키보드를 눌러도 열리지 않을때가 있음.
- modal component를 등록할 때 action 같은 기본 키워드를 제외하는 타입을 만드려고 했는데 string에서는 제외를 해도 string이기 때문에 되지 않음.
- package에 src도 포함하니 src에 있는 모든 소스 코드까지 포함해서 전달함. 이것을 수정해야할 것 같음.
- src를 포함하지 않고는 당장 "Failed to parse source map" 문제를 해결하기는 어려운 것 같음. 일단 완성되지 않는 패키지니 소스맵이 필요해서 src를 포함하는 방향으로 작업을 해야할 것 같음.

## 2024년 4월 12일 금요일

- nextjs에서 document가 없는데 사용한다는 에러가 발생함.
- ✓ Compiled in 265ms (755 modules)
  ⨯ node_modules/.pnpm/@junhee_h+react-modal@0.3.3_react-dom@18.0.0_react@18.0.0/node_modules/@junhee_h/react-modal/dist/esm/index.js (1:6647) @ eval
  ⨯ Internal error: ReferenceError: document is not defined
- 그래서 해당 문제를 해결하기 위해 "use client"를 입력해봤지만 rollup에서는 지시어가 다 사라짐.
- 이걸 해결하기 위해 rollup plugin "rollup-plugin-preserve-directives"을 설치해봤는데 제대로 동작하지 않았고 이것이 문제가 아니였음
- 문제는 useMemo에 작성한 disableBodyScroll인데 이 로직이 useMemo에서 작동하는 것이 문제였음. 왜냐면 useMemo는 서버사이드에서도 동작하기 때문에 document가 정의 자체가 안되어있는 상태에서는 오류가 나기 때문.
- 그래서 해당 문제는 무식하지만 외부 변수를 두고 해당 문제를 해결함. 일단 잘 작동하는 것을 확인함.

## 2024년 4월 14일 일요일

- modal 등록할때 타입을 정리하기가 어려움. 제일 좋은건 ModalMeta를 만들어서 사용하는 건데 이걸 어떻게 유효하게 해야할지 모르겠음.
- 데모 사이트를 만들어서 사람들에게 홍보도 할 수 있게 해야 함.
- 테스트도 작성해야 함.
- DynamicModal이 오픈된 후 상태가 바뀌지 않는 문제를 해결함.
- Modal edit 기능으로 element가 계속 바뀌면 modal도 업데이트 되도록 수정함.
- 성능에 어느정도 영향을 미칠지는 확인을 해봐야할 것 같음.
- Modal의 position에 사용자가 애니메이션을 활용하고 싶으면 활용할 수 있게 className을 추가 함.

### TODO

- [ ] 테스트 코드 작성
- [ ] 데모사이트 만들기
- [ ] 문서 계속 작성
