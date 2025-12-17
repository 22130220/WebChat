export interface IChatMessage {
  id: number;
  text: string;
  sender: "user" | "other";
  time?: string;
}
