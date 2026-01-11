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

  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',

    // Images
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp'
  ],

  thumbnailSize: {
    width: 80,
    height: 80,
  },
};
