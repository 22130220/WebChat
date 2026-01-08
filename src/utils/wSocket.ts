import { setConnect, setIsRelogin } from "../stores/settingSlice";
import { store } from "../stores/store";
import pubSub from "./eventBus";
import { GLOBAL_EVENT } from "./globalEvents";

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
  store.dispatch(setIsRelogin(false));

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
            store.dispatch(setIsRelogin(true));
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
            try {
              /**
               * raw is get mes from JSON string
               * parsed is parsed JSON object or array
               * typing items are items with type "TYPING_STATUS"
               * other items are normal message items(TEXT, IMAGE, etc)
               * if there are typing items, publish them to "typing_status" channel
               * if there are other items, publish them as normal receive_chat event
               *  81,82 (cloned.data.mes) clone data and replace mes with only other items
               * 
               *    in case else fallback to original behavior
               *  publish to receive_chat with full data
               */
              const raw = data.data?.mes;
              let parsed = null;
              if (raw) {
                parsed = JSON.parse(raw);
              }

              if (Array.isArray(parsed)) {
                const typingItems = parsed.filter((p: any) => p?.type === "TYPING_STATUS");
                const otherItems = parsed.filter((p: any) => p?.type !== "TYPING_STATUS");

                if (typingItems.length > 0) {
                  typingItems.forEach((t: any) => pubSub.publish("typing_status", { data: t }));
                }

                if (otherItems.length > 0) {
                  const cloned = JSON.parse(JSON.stringify(data));
                  cloned.data.mes = JSON.stringify(otherItems);
                  if (cloned.data.type === 1) {
                    pubSub.publish(`receive_chat:${cloned.data.to}`, cloned);
                  } else if (cloned.data.type === 0) {
                    pubSub.publish(`receive_chat:${cloned.data.name}`, cloned);
                  }
                }
              } else {
                if (data.data.type === 1) {
                  pubSub.publish(`receive_chat:${data.data.to}`, data);
                } else if (data.data.type === 0) {
                  pubSub.publish(`receive_chat:${data.data.name}`, data);
                }
              }
            } catch (e) {
              console.warn("Failed to parse SEND_CHAT message", e);
              if (data.data.type === 1) {
                pubSub.publish(`receive_chat:${data.data.to}`, data);
              } else if (data.data.type === 0) {
                pubSub.publish(`receive_chat:${data.data.name}`, data);
              }
            }
            break;
          }
          case "CREATE_ROOM": {
            pubSub.publish("create_room_success", data)
            break;
          }
          case "JOIN_ROOM": {
            pubSub.publish("join_room_success", data)
            break;
          }
          case "CHECK_USER_EXIST": {
            pubSub.publish("check_user_exist_success", data)
            break;
          }
          case "CHECK_USER_ONLINE": {
            pubSub.publish("check_user_online_success", data)
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
            store.dispatch(setIsRelogin(false));
            window.localStorage.removeItem("RE_LOGIN_CODE");
            window.localStorage.removeItem("USER_NAME");
            window.location.href = "/login";
            break;
          }
          case "CREATE_ROOM": {
            pubSub.publish("create_room_error", data)
            break;
          }
          case "AUTH": {
            // Xử lý lỗi xác thực (ví dụ: User not Login)
            pubSub.publish("auth_error", data)
            break;
          }
          case "JOIN_ROOM": {
            pubSub.publish("join_room_error", data)
            break;
          }
          case "CHECK_USER_EXIST": {
            pubSub.publish("check_user_exist_error", data)
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

function subscribeGlobalEvent() {
  const globalEvent = GLOBAL_EVENT;
  Object.entries(globalEvent).forEach(([key, value]) => {
    pubSub.subscribe(key, value);
  })
}

function initializeWebSocket() {
  pubSub.subscribe("wsClose", reconect)
  subscribeGlobalEvent()
  createSocket(defaultWsPath);
}


const wSocket = {
  send, close, readyState, initializeWebSocket
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
