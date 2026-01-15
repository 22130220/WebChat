import type { ITypingStatus } from "./ITypingStatus";

type MessageType = "TEXT" | "IMAGE" | "FORWARDED" | "VIDEO" | "AUDIO" | "FILE" | "DOCUMENT" | "PDF";

export interface IMessageDetail {
    type: string | MessageType,
    content: string,
    sender: string,
    to: string,
    timestamp: string,
    // Forward metadata (optional)
    originalSender?: string,
    originalTimestamp?: string,
    originalType?: "TEXT" | "IMAGE",
    forwardedBy?: string
}

export type RawMessageItem = IMessageDetail | ITypingStatus;
