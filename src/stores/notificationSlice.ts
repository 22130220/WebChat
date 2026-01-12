import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { INotification, NotificationType } from "../types/interfaces/INotification";

interface NotificationState {
  notifications: INotification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<INotification, "id">>
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      state.notifications.push({
        id,
        duration: 3000,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearAllNotifications } =
  notificationSlice.actions;

// Helper action creators
function createNotification(type: NotificationType, message: string, duration?: number) {
  return addNotification({ type, message, duration });
}

export const showSuccess = (message: string, duration?: number) =>
  createNotification("success", message, duration);

export const showError = (message: string, duration?: number) =>
  createNotification("error", message, duration);

export const showWarning = (message: string, duration?: number) =>
  createNotification("warning", message, duration);

export const showInfo = (message: string, duration?: number) =>
  createNotification("info", message, duration);

export default notificationSlice.reducer;
