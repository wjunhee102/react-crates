# @react-libs/modal

## ModalManager

### 기능

1. 모달 시트 데이터 저장
1. 모달 default options 저장
1. 모달 시드 add
1. 모달 시드 remove
1. 모달 시드 불러오기
1. 모달 생성
1. 모달 transaction
1. 모달 push 후 modal id 전달.
1. 모달 pop
1. component에 modal stack을 전달.

## Modal

1. 모달 상태 관리
1. component에 모달 state 전달

## modal

1. 모달 key값에 따라 만들어짐

```javascript
modal;

modal("alert");
modal.alert();
modal.warn();
modal.call();
```

call은 pending 상태와 success, error 상태의 컴포넌트를 입력받게 할 것.
