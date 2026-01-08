function EmptyChat() {
  return (
    <div
      className="flex-1 flex flex-col bg-[var(--bg-primary)] h-screen items-center justify-center"
    >
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Messages Yet</h2>
      <p className="text-[var(--text-muted)]">Your chat is empty. Start a conversation to see messages here.</p>
    </div>
  );
}

export default EmptyChat;
