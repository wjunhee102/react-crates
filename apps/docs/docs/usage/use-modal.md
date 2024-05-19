---
sidebar_position: 1
---

# Modal 사용하기

```tsx
import { modalCtrl } from "./modal";

function Example() {
  const confirm = () => {

    // 등록한 모달의 이름을 입력합니다.
    modalCtrl.open("confirm");

    // modal을 등록하면 controller 메소드로 형성됩니다.
    modalCtrl.confirm();

    // modal의 버튼을 클릭했을 시 실행될 함수를 입력할 수 있습니다.
    modalCtrl.confirm((confirm?: boolean | string) => {
      if (confirm === true) {
        ... // 확인 버튼을 클릭했을 때
      } else if (confirm === false {
        ... // 취소, back cover를 클릭했을 때
      } else if (confirm === string /* 사용자 정의 */) {
        ... // 확인 취소 이외에 action이 필요할 경우
      }
    });

    // modal의 action에서 비동기 함수를 실행 시킬 수 있습니다.
    modalCtrl.confirm(async (confirm?: boolean | string) => {
      if (confirm === true) {
        const result = await someAsyncCallback();

        console.log(result);
      } else {
        console.log("취소");
      }
    }
  }

  return (
    <div>
      <button onClick={alert}>alert</button>
    </div>
  );
}
```

- `Modal의 콘텐츠`를 동적으로 설정할 수 있습니다.

```tsx
export default function Example() {
  const confirm = () => {
    modalCtrl.open({
      title: "확인해주세요.",
      content: "확인하시겠습니까?",
      cancelContent: "취소 버튼",
      confirmContent: "확인 버튼",
    });
  };

  return (
    <div>
      <button onClick={alert}>alert</button>
    </div>
  );
}

/*
  <div>
    <h2>알림 제목</h2> <- Modal.Title
    <p>알림입니다.</p> <- Modal.Content
    <button>취소 버튼</button> <- Modal.Action.Cancel
    <button>확인 버튼</button> <- Modal.Action.Confirm
  </div>
*/
```
