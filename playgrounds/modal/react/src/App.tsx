import logo from "./logo.svg";
import "./App.css";
import { DynamicModal, ModalProvider, modalCtrl } from "./modal";
import { useEffect, useRef, useState } from "react";
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
            aria-hidden="false"
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
                  position: "bottom-center",
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
            aria-hidden="false"
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
                    {
                      content: "새모달 4",
                      backCoverConfirm: "test",
                    }
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
          <DynamicModal duration={1000} position="bottom">
            <DynamicModal.Trigger>다이나믹 모달</DynamicModal.Trigger>
            <DynamicModal.Element>
              <div className="bg-white w-[200px] h-[300px]">
                <DynamicModal.Action>실행</DynamicModal.Action>
              </div>
            </DynamicModal.Element>
          </DynamicModal>
          <TestDynamicModal />
          <button
            aria-hidden="true"
            onClick={() => {
              modalCtrl.confirm({
                subTitle: "confirm",
                content:
                  "modal-collection-action-rm modal-collection-confirm-rm modal-collection-action-rm modal-collection-confirm-rmmodal-collection-action-rm modal-collection-confirm-rmmodal-collection-action-rm modal-collection-confirm-rm",
                subContent: "asdasd",
                action: (confirm) => {
                  console.log(confirm);
                },
                position(breakPoint) {
                  return breakPoint > 480 ? "center" : "bottom";
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

          <button
            onClick={() => {
              modalCtrl.pending({
                action(_, { success }) {
                  success({ isAwaitingConfirm: true });
                },
              });
            }}
          >
            로딩
          </button>
        </header>
        <div className="w-full h-[500px]"></div>
      </ModalProvider>
    </div>
  );
}

function TestDynamicModal() {
  const [count, setCount] = useState(1);
  const targetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    targetRef.current && targetRef.current.focus();
  }, []);

  return (
    <DynamicModal
      duration={250}
      position="leftBottom"
      stateResponsiveComponent={true}
      action={async (confirm, { pending, end }) => {
        pending();
        await delay(1000);
        end();
      }}
      closeDelay={2000}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        console.log("sadasdasds");
        targetRef.current && targetRef.current.focus();
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
          <button
            className="focus:bg-pink-300"
            ref={targetRef}
            onClick={() => {
              setCount(count + 1);
            }}
            onFocus={() => {
              console.log("focus");
            }}
          >
            안녕.
          </button>
          <button
            className="focus:bg-pink-300"
            ref={targetRef}
            onClick={() => {
              setCount(count + 1);
            }}
            onFocus={() => {
              console.log("focus");
            }}
          >
            안녕.
          </button>
        </div>
      </DynamicModal.Element>
    </DynamicModal>
  );
}

export default App;
