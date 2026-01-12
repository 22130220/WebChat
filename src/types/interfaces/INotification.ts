export type NotificationType = "success" | "error" | "warning" | "info";

export interface INotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // ms, default 3000
}
