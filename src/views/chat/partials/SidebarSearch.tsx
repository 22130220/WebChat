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
    <div className="p-3 border-b border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Tìm người hoặc nhóm..."
          className="w-full px-3 py-2 pl-8 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <svg 
          className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" 
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