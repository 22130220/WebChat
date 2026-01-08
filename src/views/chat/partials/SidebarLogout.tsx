const SidebarLogout = () => (
  <div className="p-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
    <button
      onClick={() => handleLogout()}
      className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors border border-red-500/20"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Đăng xuất
    </button>
  </div>
);

function handleLogout(): void {
  localStorage.removeItem("RE_LOGIN_CODE");
  localStorage.removeItem("USER_NAME");
  window.location.href = "/login";
}
export default SidebarLogout;

