interface IBasePayload {
  action: "onchat";
}

export interface ILoginPayload extends IBasePayload {
  data: {
    event: "LOGIN",
    data: {
      user: string,
      pass: string
    }
  }
}

export interface IReLoginPayload extends IBasePayload {
  data: {
    event: "RE_LOGIN",
    data: {
      user: string,
      code: string
    }
  }
}


export interface IRegisterPayload extends IBasePayload {
  data: {
    event: "REGISTER",
    data: {
      user: string,
      pass: string
    }
  }
}


export interface ILogoutPayload extends IBasePayload {
  data: {
    event: "LOGOUT"
  }
}


export interface ICreateRoomPayload extends IBasePayload {
  data: {
    event: "CREATE_ROOM",
    data: {
      name: string
    }
  }
}


export interface IJoinRoomPayload extends IBasePayload {
  data: {
    event: "JOIN_ROOM",
    data: {
      name: string
    }
  }
}


export interface IGetChatMesPayload extends IBasePayload {
  data: {
    event: "GET_ROOM_CHAT_MES" | "GET_PEOPLE_CHAT_MES",
    data: {
      name: string,
      page: number
    }
  }
}


export interface ISendChatPayload extends IBasePayload {
  data: {
    event: "SEND_CHAT",
    data: {
      type: "room" | "people",
      to: string,
      mes: string
    }
  }
}

export interface ICheckUserOnlinePayload extends IBasePayload {
  data: {
    "event": "CHECK_USER_ONLINE",
    data: {
      user: string
    }
  }
}


export interface ICheckUserExistPayload extends IBasePayload {
  data: {
    event: "CHECK_USER_EXIST",
    data: {
      user: string
    }
  }
}

export interface IGetUserListPayload extends IBasePayload {
  data: {
    event: "GET_USER_LIST"
  }
}
