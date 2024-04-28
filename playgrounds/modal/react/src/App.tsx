import logo from "./logo.svg";
import "./App.css";
import { DynamicModal, ModalProvider, modalCtrl } from "./modal";
import { useState } from "react";
import { Modal } from "@react-crates/modal";

export function delay(duration: number = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, Math.max(duration, 0));
  });
}

function App() {
  return (
    <div className="App">
      <ModalProvider>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button
            onKeyDown={(event) => {
              console.log(event);
            }}
            onClick={() => {
              modalCtrl.open(
                () => (
                  <div className="bg-white w-[200px] h-[300px]">
                    "안녕하세요.1"
                  </div>
                ),
                {
                  backCoverOpacity: 0.5,
                  backCoverColor: "#fff",
                  closeDelay: 1000,
                  stateResponsiveComponent: true,
                  action: async (confirm, { pending, success }) => {
                    pending();
                    await delay(1000);

                    success(() =>
                      modalCtrl.open(() => (
                        <div className="bg-white w-[200px] h-[300px]">
                          새모달
                        </div>
                      ))
                    );
                  },
                  duration: 1500,
                  position: "bottom-bottom",
                }
              );

              modalCtrl.pending({
                position: "bottom-bottom-center",
              });

              modalCtrl.alert({
                payload: "",
              });
            }}
          >
            모달 열기
          </button>
          <button
            onClick={() => {
              modalCtrl.alert(async (confirm, { pending, success }) => {
                pending();
                await delay(1000);

                success(() => {
                  modalCtrl.open(
                    () => (
                      <div className="bg-white w-[200px] h-[300px]">
                        <Modal.Content />
                      </div>
                    ),
                    "새모달 1"
                  );
                  modalCtrl.open(
                    () => (
                      <div className="bg-white w-[200px] h-[300px]">
                        <Modal.Content />
                      </div>
                    ),
                    "새모달 2"
                  );
                  modalCtrl.open(
                    () => (
                      <div className="bg-white w-[200px] h-[300px]">
                        <Modal.Content />
                      </div>
                    ),
                    "새모달 3"
                  );
                  modalCtrl.open(
                    () => (
                      <div className="bg-white w-[200px] h-[300px]">
                        <Modal.Content />
                      </div>
                    ),
                    "새모달 4"
                  );
                });
              });
            }}
          >
            알림
          </button>

          <button
            onClick={() => {
              modalCtrl.alert("잘되나?후...");
            }}
          >
            알림2
          </button>
          <DynamicModal options={{ duration: 1500, position: "center" }}>
            <DynamicModal.Trigger>다이나믹 모달</DynamicModal.Trigger>
            <DynamicModal.Element>
              <div className="bg-white w-[200px] h-[300px]">
                <DynamicModal.Action>실행</DynamicModal.Action>
              </div>
            </DynamicModal.Element>
          </DynamicModal>
          <TestDynamicModal />
          <button
            onClick={() => {
              modalCtrl.confirm({
                subTitle: "confirm",
                content:
                  "modal-collection-action-rm modal-collection-confirm-rm modal-collection-action-rm modal-collection-confirm-rmmodal-collection-action-rm modal-collection-confirm-rmmodal-collection-action-rm modal-collection-confirm-rm",
                subContent: "asdasd",
                action: (confirm) => {
                  console.log(confirm);
                },
              });
            }}
          >
            confirm
          </button>

          <button
            onClick={() => {
              modalCtrl.prompt({
                content: "입력",
                action: (confirm) => {
                  console.log(confirm);
                },
              });
            }}
          >
            confirm2
          </button>
        </header>
        <div className="w-full h-[500px]"></div>
      </ModalProvider>
    </div>
  );
}

function TestDynamicModal() {
  const [count, setCount] = useState(1);

  return (
    <DynamicModal
      options={{
        duration: 250,
        position: "leftBottom-center-bottom",
        stateResponsiveComponent: true,
        action: async (confirm, { pending, end }) => {
          pending();
          await delay(1000);
          end();
        },
        closeDelay: 2000,
      }}
    >
      <DynamicModal.Trigger onClick={() => setCount((state) => state + 1)}>
        다이나믹 모달 {count}
      </DynamicModal.Trigger>
      <DynamicModal.Element>
        <div className="bg-white w-[200px] h-[300px]">
          <p className="block font-bold">{count}</p>
          <DynamicModal.Action
            onClick={() => {
              console.log("sadasd");
              setCount((state) => state + 1);
            }}
          >
            실행
          </DynamicModal.Action>
        </div>
      </DynamicModal.Element>
    </DynamicModal>
  );
}

export default App;
