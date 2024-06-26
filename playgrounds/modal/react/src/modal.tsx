import { generateModal, Modal, modalCollection } from "@react-crates/modal";

export const { modalCtrl, DynamicModal, ModalProvider } = generateModal(
  {
    alert: {
      component: ({ payload }) => {
        return (
          <div className="w-[200px] h-[200px] bg-white">
            안녕하세요 {payload}
            <Modal.Content />
            <div>
              <Modal.Action.Confirm>반가워요</Modal.Action.Confirm>
              <Modal.Action.Cancel>취소</Modal.Action.Cancel>
            </div>
          </div>
        );
      },
      defaultOptions: {
        payload: "잘된다!",
        position: "test-center",
        backCoverConfirm: "alert",
      },
    },
    success: {
      component: () => (
        <div className="bg-green-400 w-[200px] h-[300px]">
          <Modal.Content>성공!!</Modal.Content>
        </div>
      ),
    },
    pending: {
      component: () => (
        <div className="bg-gray-400 w-[200px] h-[300px]">로딩</div>
      ),
      defaultOptions: {
        escKeyActive: true,
      },
    },
    test: {
      component: () => (
        <div className="bg-cyan-400 w-[200px] h-[300px]">테스트</div>
      ),
      defaultOptions: {},
    },
    confirm: {
      component: modalCollection.confirm.component,
      defaultOptions: {
        ...modalCollection.confirm.defaultOptions,
        title: "테스트",
        content: "콘텐트",
        confirmContent: "확인",
        cancelContent: "취소",
      },
    },
    prompt: modalCollection.prompt,
  },
  {
    stateResponsiveComponent: true,
    position: {
      test: {
        open: {
          className: "open",
        },
        active: {
          className: "active",
        },
        close: {
          className: "close",
        },
      },
    },
  }
);
