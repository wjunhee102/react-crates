import { ModalProvider, openModal } from "@react-libs/modal";
import logo from "./logo.svg";
import "./App.css";

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
          onClick={() =>
            openModal(
              () => (
                <div className="bg-white w-[200px] h-[300px]">
                  "안녕하세요."
                </div>
              ),
              {
                backCoverOpacity: 0.5,
                backCoverColor: "#fff",
                callback: () => {
                  openModal("default");
                },
                duration: 300,
              }
            )
          }
        >
          모달 열기
        </button>
      </header>
      <div className="w-full h-[500px]"></div>
      <ModalProvider />
    </div>
  );
}

export default App;
