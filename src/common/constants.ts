export const CLIPBOARD_EVENTS = {
  COPY_SUCCESS: "clipboard_copy_success",
  COPY_ERROR: "clipboard_copy_error",
  PASTE: "clipboard_paste",
  PASTE_ERROR: "clipboard_paste_error",
} as const;

export const CLIPBOARD_CONFIG = {
  maxItems: 10,
  maxFileSize: 10 * 1024 * 1024,
  maxTextLength: 50000,
  allowedImageTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp'
  ],

  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],

  thumbnailSize: {
    width: 80,
    height: 80,
  },
};


export const WSOCKET_EVENTS = {
  REGISTER: "REGISTER",
  LOGIN: "LOGIN",
  RE_LOGIN: "RE_LOGIN",
  GET_USER_LIST: "GET_USER_LIST",
  GET_PEOPLE_CHAT_MES: "GET_PEOPLE_CHAT_MES",
  GET_ROOM_CHAT_MES: "GET_ROOM_CHAT_MES",
  SEND_CHAT: "SEND_CHAT",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  CHECK_USER_EXIST: "CHECK_USER_EXIST",
  CHECK_USER_ONLINE: "CHECK_USER_ONLINE",
  AUTH: "AUTH",
}
