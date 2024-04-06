import { generateModal, Modal } from "@junhee_h/react-modal";

export const { modalCtrl, DynamicModal, ModalProvider } = generateModal(
  {
    alert: {
      component: ({ payload }) => (
        <div className="w-[200px] h-[200px] bg-white">
          안녕하세요 {payload}
          <div>
            <Modal.Action.Confirm>반가워요</Modal.Action.Confirm>
            <Modal.Action.Cancel>취소</Modal.Action.Cancel>
          </div>
        </div>
      ),
      defaultOptions: {
        payload: "잘된다!",
        position: "test-bottom-bottom",
        enterKeyActive: true,
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
        enterKeyActive: true,
      },
    },
    test: {
      component: () => (
        <div className="bg-cyan-400 w-[200px] h-[300px]">테스트</div>
      ),
      defaultOptions: {},
    },
  },
  {
    stateResponsiveComponent: true,
    position: {
      test: {
        open: {},
        active: {},
        close: {},
      },
    },
  }
);
