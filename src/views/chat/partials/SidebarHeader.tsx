import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../stores/themeSlice';
import type { RootState } from '../../../stores/store';

interface Props {
  setShowCreateRoom: (show: boolean) => void;
  quantityUser?: number;
}

const SidebarHeader = ({ setShowCreateRoom, quantityUser }: Props) => {
  const userName = localStorage.getItem("USER_NAME") || "";
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Icon cho từng theme mode
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '☀️';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Light';
    }
  };

  return (
    <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-[var(--text-primary)]">{userName}</h2>
        <span className="text-sm text-[var(--text-muted)]">{quantityUser}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={handleToggleTheme}
          className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors"
          title={`Theme: ${getThemeLabel()}`}
        >
          <span className="text-lg">{getThemeIcon()}</span>
        </button>

        {/* Create Room Button */}
        <button
          onClick={() => setShowCreateRoom(true)}
          className="w-8 h-8 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] flex items-center justify-center text-white transition-colors"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;