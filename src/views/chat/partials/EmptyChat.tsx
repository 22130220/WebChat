function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)] h-screen items-center justify-center">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        Chào mừng đến với ứng dụng chat
      </h2>
      <p className="text-[var(--text-muted)]">
        Chọn một người để bắt đầu trò chuyện nào
      </p>
    </div>
  );
}

export default EmptyChat;
