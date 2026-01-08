export interface ITypingStatus {
    type: "TYPING_STATUS";
    sender: string;
    receiver: string;
    isTyping: boolean;
}