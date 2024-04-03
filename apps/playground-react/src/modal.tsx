import { generateModalSuite, Modal } from "@junhee_h/react-modal";

export const { modalCtrl, ModalProvider } = generateModalSuite({
  alert: {
    component: ({ payload }) => (
      <div className="w-[200px] h-[200px] bg-white">
        안녕하세요 {payload}
        <div>
          <Modal.ConfirmButton>반가워요</Modal.ConfirmButton>
        </div>
      </div>
    ),
    defaultOptions: {
      payload: "test",
    },
  },
});
