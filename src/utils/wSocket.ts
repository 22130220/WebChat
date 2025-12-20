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

  ws.onopen = () => {
    pubSub.publish("wsOpen", `Connected to ${path}`)
    const loginPayload = {
    action: "onchat",
    data: {
    event: "LOGIN",
    data: {
      user: "nguyen",
      pass: "12345"
    }
  }
}
 wSocket.send(JSON.stringify(loginPayload));
  }

  ws.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    pubSub.publish("wsMessage", event.data)


    switch (data.status) {
      case "success": {
        switch (data.event) {
          case "LOGIN": {
            pubSub.publish("login_success", data);
            pubSub.publish("getUserList", data);
            break;
          }
          case "RE_LOGIN": {
            pubSub.publish("relogin_success", data)
            break;
          }
          case "GET_USER_LIST": {
            pubSub.publish("user_list_success", data)
            
            break;
          }

        }
        break;
      }
    }

  }

  ws.onerror = (event: Event) => {
    pubSub.publish("wsError", event)
  }

  ws.onclose = (event: CloseEvent) => {
    pubSub.publish("wsClose", event)
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

export default wSocket;

