import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import type {
  INotification,
  NotificationType,
} from "../types/interfaces/INotification";

interface Props {
  notification: INotification;
  onClose: () => void;
}

const typeStyles: Record<
  NotificationType,
  { bg: string; icon: React.ReactNode }
> = {
  success: {
    bg: "bg-green-500",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  error: {
    bg: "bg-red-500",
    icon: <XCircle className="w-5 h-5" />,
  },
  warning: {
    bg: "bg-yellow-500",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  info: {
    bg: "bg-blue-500",
    icon: <Info className="w-5 h-5" />,
  },
};

export default function Toast({ notification, onClose }: Props) {
  const { type, message } = notification;
  const style = typeStyles[type];

  return (
    <div
      className={`${style.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-70 max-w-100 animate-slide-in`}
    >
      {style.icon}
      <span className="flex-1 font-medium text-sm">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
