import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import wSocket from "../../../utils/wSocket";
import { selectIsOnline } from "../../../stores/onlineStatusSlice";

export default function ChatMainHeader() {
  const { name, type } = useParams();
  const isOnline = useSelector(selectIsOnline);
  const isPerson = Number(type) === 0;

  useEffect(() => {
    // Chỉ check online status khi mở chat với người (type === 0)
    if (name && isPerson) {
      const checkOnlinePayload = {
        action: "onchat",
        data: {
          event: "CHECK_USER_ONLINE",
          data: {
            user: name
          }
        }
      };
      wSocket.send(JSON.stringify(checkOnlinePayload));
    }
  }, [name, isPerson]);

  return (
    <>
      <div className="px-6 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xl">
            👨‍💻
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              {name} {Number(type) === 1 ? ` - Nhóm` : ``}
            </h2>
            {/* Chỉ hiển thị trạng thái online cho người (type === 0) */}
            {isPerson && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-[var(--text-muted)]">
                  {isOnline ? 'Trực tuyến' : 'Không hoạt động'}
                </span>
              </div>
            )}
          </div>
        </div>
        <button className="px-4 py-2 text-[var(--accent-primary)] hover:bg-[var(--accent-light)] rounded-md flex items-center gap-2 font-medium transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Gọi điện
        </button>
      </div>
    </>
  );
}
