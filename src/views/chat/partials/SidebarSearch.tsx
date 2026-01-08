import React from 'react';
interface SidebarSearchProps {
  onSearch: (searchTerm: string) => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Tìm người hoặc nhóm..."
          className="w-full px-3 py-2 pl-8 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <svg 
          className="w-4 h-4 absolute left-2.5 top-2.5 text-[var(--text-muted)]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
    </div>
  );
};

export default SidebarSearch;