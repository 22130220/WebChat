interface Props {
  setShowCreateRoom: (show: boolean) => void;
  quantityUser?: number;
}
const SidebarHeader = ({ setShowCreateRoom, quantityUser }: Props) => {
  const userName = localStorage.getItem("USER_NAME") || "";
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-gray-900">{userName}</h2>
        <span className="text-sm text-gray-500">{quantityUser}</span>
      </div>
      <button
        onClick={() => setShowCreateRoom(true)}
        className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white"
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
  );
};

export default SidebarHeader;