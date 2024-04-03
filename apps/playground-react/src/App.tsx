import logo from "./logo.svg";
import "./App.css";
import { ModalProvider, modalCtrl } from "./modal";
import { Modal } from "@junhee_h/react-modal";

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
                callback: async (confirm, { pending, success }) => {
                  pending();
                  await delay(1000);

                  success(() =>
                    modalCtrl.open(() => (
                      <div className="bg-white w-[200px] h-[300px]">새모달</div>
                    ))
                  );
                },
                duration: 300,
              }
            );
          }}
        >
          모달 열기
        </button>
        <button
          onClick={() => {
            modalCtrl.alert({
              payload: "타입 체킹 잘된다.",
              confirmContents: "후후후",
              backCoverOpacity: 0.5,
              backCoverColor: "#fff",
              closeDelay: 1000,
              stateResponsiveComponent: true,
              callback: async (confirm, { pending, success }) => {
                pending();
                await delay(1000);

                success(() =>
                  modalCtrl.open(() => (
                    <div className="bg-white w-[200px] h-[300px]">새모달</div>
                  ))
                );
              },
              duration: 300,
            });
          }}
        >
          알림
        </button>
      </header>
      <div className="w-full h-[500px]"></div>
      <ModalProvider
        modalMeta={[
          {
            name: "success",
            component: () => (
              <div className="bg-green-400 w-[200px] h-[300px]">
                <Modal.Contents>성공!!</Modal.Contents>
              </div>
            ),
          },
          {
            name: "pending",
            component: () => (
              <div className="bg-gray-400 w-[200px] h-[300px]">로딩</div>
            ),
          },
          {
            name: "test",
            component: () => (
              <div className="bg-cyan-400 w-[200px] h-[300px]">테스트</div>
            ),
          },
        ]}
        options={{ stateResponsiveComponent: true }}
      />
    </div>
  );
}

export default App;
