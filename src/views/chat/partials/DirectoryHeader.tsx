const DirectoryHeader = () => (
  <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] flex items-center justify-between">
    <h2 className="font-semibold text-[var(--text-primary)]">Thông tin hội thoại</h2>
    <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
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
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    </button>
  </div>
);

export default DirectoryHeader;
