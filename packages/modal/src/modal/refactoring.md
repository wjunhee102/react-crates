# 목표
1. modal service 분리 역할 분명히
2. modal state service 역할 분명히
3. modal component 역할 분명히

2023년 7월 1일 토요일
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
2. 

### modal dispatcher

### modal component

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

