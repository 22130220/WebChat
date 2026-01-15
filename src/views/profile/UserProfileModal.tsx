import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProfile, setLoading, setError, selectUserProfile, selectProfileLoading } from '../../stores/userProfileSlice';
import { getUserProfile, createDefaultProfile } from '../../services/firebaseProfileService';
import EditProfileModal from './EditProfileModal';

interface Props {
    username: string;
    onClose: () => void;
}

export default function UserProfileModal({ username, onClose }: Props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector(selectUserProfile);
    const loading = useSelector(selectProfileLoading);
    const currentUsername = localStorage.getItem("USER_NAME") || "";
    const [showEditModal, setShowEditModal] = useState(false);
    const isOwnProfile = username === currentUsername;

    useEffect(() => {
        loadProfile();
    }, [username]);

    const loadProfile = async () => {
        if (!username) return;

        try {
            dispatch(setLoading(true));
            let userProfile = await getUserProfile(username);

            // Nếu chưa có profile, tạo profile mặc định
            if (!userProfile) {
                userProfile = await createDefaultProfile(username);
            }

            dispatch(setProfile(userProfile));
        } catch (error) {
            console.error("Error loading profile:", error);
            dispatch(setError("Không thể tải thông tin hồ sơ"));
        }
    };

    const handleSendMessage = () => {
        onClose(); // Close modal first
        navigate(`/chat/${username}/type/0`); // Navigate to chat with user (type=0 for individual)
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[var(--bg-primary)] rounded-lg p-8">
                    <div className="text-[var(--text-primary)]">Đang tải...</div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[var(--bg-primary)] rounded-lg p-8">
                    <div className="text-[var(--text-primary)]">Không tìm thấy hồ sơ</div>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg">
                        Đóng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Backdrop - Blur only without black overlay */}
            <div 
                className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" 
                onClick={onClose}
                style={{
                    animation: 'fadeIn 0.2s ease-out'
                }}
            >
                {/* Modal Content - Centered Popup with slide animation */}
                <div 
                    className="bg-[var(--bg-primary)] rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-slideUp" 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        animation: 'slideUp 0.3s ease-out'
                    }}
                >
                    {/* Header với nút close */}
                    <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-lg">
                        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Thông tin tài khoản</h1>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Cover Photo - Empty by default */}
                        <div className="relative h-32 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden mb-4">
                            {profile.coverPhoto && (
                                <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center mb-4 -mt-20">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] border-4 border-[var(--bg-primary)] overflow-hidden flex items-center justify-center">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">👤</span>
                                    )}
                                </div>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => setShowEditModal(true)}
                                        className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] rounded-full flex items-center justify-center text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">{profile.username}</h2>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-3 mb-6">
                            <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-2">Thông tin cá nhân</h3>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-[var(--text-muted)]">Giới tính</label>
                                    <p className="text-sm text-[var(--text-primary)]">{profile.gender}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)]">Ngày sinh</label>
                                    <p className="text-sm text-[var(--text-primary)]">{profile.dateOfBirth || "Chưa cập nhật"}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-[var(--text-muted)]">Điện thoại</label>
                                <p className="text-sm text-[var(--text-primary)]">{profile.phoneNumber || "Chưa cập nhật"}</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        {isOwnProfile ? (
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="w-full py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Cập nhật
                            </button>
                        ) : (
                            <button
                                onClick={handleSendMessage}
                                className="w-full py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Nhắn tin
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={loadProfile}
                />
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
