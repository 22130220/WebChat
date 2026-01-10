import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./stores/store.ts";
import { Provider } from "react-redux";
import wSocket from "./utils/wSocket.ts";

wSocket.initializeWebSocket();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
