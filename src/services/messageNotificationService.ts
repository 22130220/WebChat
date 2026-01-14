export interface MessageNotificationOptions {
  icon?: string;
  autoCloseMs?: number;
  onClick?: () => void;
  silent?: boolean;
  navigateTo?: string;
}

export async function initMessageNotification(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn("Browser không hỗ trợ Notification API");
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function hasNotificationPermission(): boolean {
  return 'Notification' in window && Notification.permission === "granted";
}

export function showMessageNotification(
  title: string,
  body: string,
  tag: string,
  options: MessageNotificationOptions = {}
): Notification | null {
  if (!hasNotificationPermission()) {
    return null;
  }

  const {
    icon,
    autoCloseMs = 5000,
    onClick,
    silent = false,
    navigateTo
  } = options;

  const notification = new Notification(title, {
    body,
    icon,
    tag,
    silent,
    dir: "ltr",
    lang: "vi"
  });

  notification.onclick = (e) => {
    e.preventDefault();

    window.focus();

    if (navigateTo) {
      window.location.href = navigateTo;
    }

    onClick?.();

    notification.close();
  };

  // Tự động đóng sau khoảng thời gian
  if (autoCloseMs > 0) {
    setTimeout(() => notification.close(), autoCloseMs);
  }

  return notification;
}

