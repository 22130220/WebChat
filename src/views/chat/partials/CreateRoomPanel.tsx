import React, { useState } from 'react';

interface CreateRoomPanelProps {
  onClose: () => void;
}

const CreateRoomPanel: React.FC<CreateRoomPanelProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [isRoom, setisRoom] = useState(false);

  const handleCreateRoom = () => {
    if (isRoom) {
      console.log('Tạo phòng:', { roomName, isRoom });
      handleClose();
    }
  };

  const handleClose = () => {
    setRoomName('');
    setisRoom(false);
    onClose();
  };

  return (
    <>
      {/* Overlay to close on outside click */}
      <div 
        className="fixed inset-0 z-40"
        onClick={handleClose}
      />
      
      <div className="absolute left-full top-0 w-64 h-1/2 bg-white border border-gray-200 rounded-r-lg shadow-xl z-50">
        <div className="p-4 h-full flex flex-col">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tạo phòng mới</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Room Name Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tên phòng hoặc người dùng"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Private Room Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRoom}
                onChange={(e) => setisRoom(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Phòng</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            {isRoom && (
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoomPanel;