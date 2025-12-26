function EmptyChat() {
  return (
    <div
      className="flex-1 flex flex-col bg-white h-screen"
      style={{ textAlign: "center", marginTop: "20px", color: "#888" }}
    >
      <h2>No Messages Yet</h2>
      <p>Your chat is empty. Start a conversation to see messages here.</p>
    </div>
  );
}

export default EmptyChat;
