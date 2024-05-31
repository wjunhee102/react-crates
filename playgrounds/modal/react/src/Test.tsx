import { generateModal, modalCollection } from "@react-crates/modal";

const { modalCtrl, ModalProvider } = generateModal(modalCollection);

export default function Test() {
  return (
    <div className="w-screen h-screen">
      <div className="relative flex items-center justify-center w-screen h-screen">
        <button
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors border rounded-md shadow-sm h-9 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            modalCtrl.alert({
              title: "알림",
              content: "@react-crates/modal 입니다!",
            });
            modalCtrl.alert({
              title: "알림",
              content: "@react-crates/modal 입니다!",
              position: "bottom-bottom-top",
              backCoverOpacity: 0,
            });
            modalCtrl.alert({
              title: "알림",
              content: "@react-crates/modal 입니다!",
              position: "top-top-bottom",
              backCoverOpacity: 0,
            });
            modalCtrl.alert({
              title: "알림",
              content: "@react-crates/modal 입니다!",
              position: "left-left-right",
              backCoverOpacity: 0,
            });
            modalCtrl.alert({
              title: "알림",
              content: "@react-crates/modal 입니다!",
              position: "right-right-left",
              backCoverOpacity: 0,
            });
          }}
        >
          Open
        </button>
      </div>
      <ModalProvider />
    </div>
  );
}
