import { setConnect } from "../stores/settingSlice";
import { store } from "../stores/store";
import pubSub from "./eventBus";

const defaultWsPath = "wss://chat.longapp.site/chat/chat"
let ws: WebSocket | null = null;
function createSocket(path: string) {
  console.log(
    `%cWS:%c Creating WebSocket connection to ${path}`,
    "color: #43a047; font-weight: bold;",
    "color: #9e9e9e;"
  );
  ws = new WebSocket(path)

  // Khi nay mới bắt đầu kết nối
  store.dispatch(setConnect(false));

  ws.onopen = () => {
    store.dispatch(setConnect(true));
    pubSub.publish("wsOpen", `Connected to ${path}`)
    checkUserCode();
  }

  ws.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("Received WebSocket message:", data);
    pubSub.publish("wsMessage", event.data)

    switch (data.status) {
      case "success": {
        switch (data.event) {
          case "REGISTER": {
            pubSub.publish("register_success", data);
            break;
          }
          case "LOGIN": {
            pubSub.publish("login_success", data);
            break;
          }
          case "RE_LOGIN": {
            pubSub.publish("relogin_success", data)
            pubSub.publish("getUserList", data);
            break;
          }
          case "GET_USER_LIST": {
            pubSub.publish("user_list_success", data)
            break;
          }
          case "GET_PEOPLE_CHAT_MES": {
            pubSub.publish("get_people_chat_messages_success", data)
            break;
          }
          case "SEND_CHAT": {
            pubSub.publish(`receive_chat:${data.data.name}`, data)
            break;
          }
        }
        break;
      }
      case "error": {
        // TODO: Không chắc là mất kêt nối ở đây có đúng không
        // store.dispatch(setConnect(false));
        switch (data.event) {
          case "RE_LOGIN": {
            // window.localStorage.removeItem("RE_LOGIN_CODE");
            // window.localStorage.removeItem("USER_NAME");
            // window.location.href = "/login";
            break;
          }
        }
        break;
      }
    }

  }

  ws.onerror = (event: Event) => {
    // TODO: Thầy chưa có sự kiện vào onerror này nên chưa rõ cách xử lý
    store.dispatch(setConnect(false));
    pubSub.publish("wsError", event)
  }

  ws.onclose = (event: CloseEvent) => {
    pubSub.publish("wsClose", event)
    store.dispatch(setConnect(false));
  }

}

function send(msg: string) {
  if (ws?.readyState == WebSocket.CONNECTING || ws?.readyState == WebSocket.CLOSED) {
    let errorType: string = "WebSocket::null"
    switch (ws.readyState) {
      case WebSocket.CLOSED:
        errorType = "WebSocket::CLOSED";
        break;
      case WebSocket.CONNECTING:
        errorType = "WebSocket::CONNECTING";
        break;
    }
    console.log(
      `%cERROR:%c ${errorType} still cannot be sending data`,
      "color: #e53935; font-weight: bold;",
      "color: #9e9e9e;"
    );

    return;
  }
  ws?.send(msg)
}

function readyState() {
  return ws?.readyState;
}

function close() {
  ws?.close()
}

function reconect() {
  createSocket(defaultWsPath);
}

pubSub.subscribe("wsClose", reconect)

createSocket(defaultWsPath);

const wSocket = {
  send, close, readyState
}

/*
* Tai
*/
function checkUserCode() {
  const RE_LOGIN_CODE = localStorage.getItem("RE_LOGIN_CODE");
  const USER_NAME = localStorage.getItem("USER_NAME");

  if (RE_LOGIN_CODE && USER_NAME) {
    const reLoginPayload = {
      action: "onchat",
      data: {
        event: "RE_LOGIN",
        data: {
          user: USER_NAME,
          code: RE_LOGIN_CODE
        }
      }
    };
    wSocket.send(JSON.stringify(reLoginPayload));
  }
}

export default wSocket;

