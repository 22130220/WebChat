import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/store";
import { removeNotification } from "../stores/notificationSlice";
import Toast from "./Toast";

export default function ToastContainer() {
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) => {
      const duration = notification.duration ?? 3000;
      return setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, duration);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col-reverse gap-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => dispatch(removeNotification(notification.id))}
        />
      ))}
    </div>
  );
}
