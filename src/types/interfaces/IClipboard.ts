export interface IClipboardPayload {
  type: 'add' | 'remove' | 'clear';
  message?: string;
}

export interface ICLipboardProcess {
  files: FileList;
  types: readonly string[];
  fileProcessing: File[];
}

type ContentType = 'image' | 'text' | 'html' | 'file';

interface IClipboardItemBase {
  id: string;
  type: ContentType;
  createdAt: number;
}

export interface FileClipboardItem extends IClipboardItemBase {
  type: 'file';
  file: File;
  fileName: string;
  fileSize: number;
  mimeType: string;
  extension: string;
}

export interface ImageClipboardItem extends IClipboardItemBase {
  type: 'image';
  file: File;
  previewUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface TextClipboardItem extends IClipboardItemBase {
  type: 'text';
  content: string;
  charCount: number;
}

export interface HtmlClipboardItem extends IClipboardItemBase {
  type: 'html';
  htmlContent: string;
  plainText: string;
}

export type IClipboardItem = ImageClipboardItem | FileClipboardItem | TextClipboardItem | HtmlClipboardItem;
