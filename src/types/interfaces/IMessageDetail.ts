type MessageType = "TEXT" | "IMAGE"

export interface IMessageDetail {
    type: MessageType,
    content: string,
    sender: string, 
    to: string,
    timestamp: string
}