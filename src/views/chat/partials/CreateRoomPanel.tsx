import React, { useState, useCallback } from 'react';
import wSocket from '../../../utils/wSocket';
import { useEvent } from '../../../hooks/useEvent';

interface CreateRoomPanelProps {
  onClose: () => void;
  onRoomCreated?: () => void; // Callback khi tạo phòng thành công
}

const CreateRoomPanel: React.FC<CreateRoomPanelProps> = ({ onClose, onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [isRoom, setIsRoom] = useState(false);
  const [error, setError] = useState(''); // State để hiển thị lỗi
  const [isLoading, setIsLoading] = useState(false); // State loading
  const [showSuccessToast, setShowSuccessToast] = useState(false); // Toast thành công

  const handleClose = useCallback(() => {
    setRoomName('');
    setIsRoom(false);
    setError('');
    setIsLoading(false);
    onClose();
  }, [onClose]);

  //  Handler khi tạo phòng thành công
  const handleCreateRoomSuccess = useCallback((data: any) => {
    console.log('Room created successfully:', data);
    // Clear timeout nếu có
    // @ts-ignore
    if (window.__createRoomTimeout) {
      // @ts-ignore
      clearTimeout(window.__createRoomTimeout);
    }
    setIsLoading(false);
    
    // Hiển thị toast thành công
    setShowSuccessToast(true);
    
    // Refresh user list
    if (onRoomCreated) {
      onRoomCreated();
    }
    
    // Đóng toast và panel sau 2 giây
    setTimeout(() => {
      setShowSuccessToast(false);
      handleClose();
    }, 2000);
   
  }, [onRoomCreated, handleClose]);

  //  Handler khi tạo phòng bị lỗi
  const handleCreateRoomError = useCallback((data: any) => {
    console.log('Room creation error:', data);
    // Clear timeout nếu có
    // @ts-ignore
    if (window.__createRoomTimeout) {
      // @ts-ignore
      clearTimeout(window.__createRoomTimeout);
    }
    setIsLoading(false);
    if (data.mes === 'Room Exist') {
      setError('Phòng đã tồn tại');
    } else {
      setError(data.mes || 'Có lỗi xảy ra');
    }
  }, []);

  useEvent('create_room_success', handleCreateRoomSuccess);
  useEvent('create_room_error', handleCreateRoomError);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      setError('Vui lòng nhập tên phòng');
      return;
    }

    if (!isRoom) {
      setError('Vui lòng tick chọn "Phòng"');
      return;
    }

    setError('');
    setIsLoading(true);

    const createRoomPayload = {
      action: "onchat",
      data: {
        event: "CREATE_ROOM",
        data: {
          name: roomName.trim()
        }
      }
    };

    console.log('Sending create room request:', createRoomPayload);
    wSocket.send(JSON.stringify(createRoomPayload));

    // Nếu sau 2 giây không nhận được response,
    // tự động refresh user list và đóng panel
    // (Trường hợp server tạo phòng thành công nhưng không gửi response về)
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Timeout waiting for CREATE_ROOM response, auto-refreshing user list');
      setIsLoading(false);
      
      // Hiển thị toast thành công
      setShowSuccessToast(true);
      
      if (onRoomCreated) {
        onRoomCreated();
      }
      
      // Đóng toast và panel sau 2 giây
      setTimeout(() => {
        setShowSuccessToast(false);
        handleClose();
      }, 2000);
    }, 2000);

    // Lưu timeout ID để có thể clear nếu nhận được response
    // @ts-ignore
    window.__createRoomTimeout = timeoutId;
  };

  return (
    <>
      {/* Overlay to close on outside click */}
      <div 
        className="fixed inset-0 z-40"
        onClick={handleClose}
      />
      
      <div className="absolute left-full top-0 w-64 bg-white border border-gray-200 rounded-r-lg shadow-xl z-50">
        <div className="p-4 flex flex-col">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tạo phòng mới</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading} //  Disable khi đang loading
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
              onChange={(e) => {
                setRoomName(e.target.value);
                setError(''); // Clear error when typing
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              disabled={isLoading} //  Disable khi đang loading
            />
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Private Room Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRoom}
                onChange={(e) => {
                  setIsRoom(e.target.checked);
                  setError(''); // Clear error when toggling
                }}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={isLoading} //  Disable khi đang loading
              />
              <span className="text-sm text-gray-700">Phòng</span>
            </label>
          </div>

          {/* Action Buttons */}
          {/* Chỉ hiển thị nút + khi isRoom = true */}
          <div className="flex gap-2">
            {isRoom && (
              <button
                onClick={handleCreateRoom}
                disabled={isLoading} // Chỉ disable khi đang loading
                className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {isLoading ? (
                  //  Loading spinner
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={handleClose}
              disabled={isLoading} //  Disable khi đang loading
              className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-[60] animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Tạo phòng thành công!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRoomPanel;