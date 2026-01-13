import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../stores/userProfileSlice';
import { updateUserProfile } from '../../services/firebaseProfileService';
import type { IUserProfile } from '../../types/interfaces/IUserProfile';

interface Props {
    profile: IUserProfile;
    onClose: () => void;
    onUpdate: () => void;
}

export default function EditProfileModal({ profile, onClose, onUpdate }: Props) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        phoneNumber: profile.phoneNumber,
    });
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(profile.coverPhoto);
    const [loading, setLoading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverPhotoInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Hàm nén ảnh
    const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Tính toán kích thước mới
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Nén ảnh với quality
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Nén ảnh avatar: 400x400, quality 0.7
                const compressed = await compressImage(file, 400, 400, 0.7);
                setAvatarPreview(compressed);
            } catch (error) {
                console.error('Error compressing avatar:', error);
                alert('Có lỗi khi xử lý ảnh');
            }
        }
    };

    const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Nén ảnh cover: 1200x400, quality 0.7
                const compressed = await compressImage(file, 1200, 400, 0.7);
                setCoverPhotoPreview(compressed);
            } catch (error) {
                console.error('Error compressing cover photo:', error);
                alert('Có lỗi khi xử lý ảnh');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updates: Partial<IUserProfile> = {
                ...formData,
            };

            // Lưu avatar dưới dạng base64 nếu có
            if (avatarPreview && avatarPreview !== profile.avatar) {
                updates.avatar = avatarPreview;
            }

            // Lưu cover photo dưới dạng base64 nếu có
            if (coverPhotoPreview && coverPhotoPreview !== profile.coverPhoto) {
                updates.coverPhoto = coverPhotoPreview;
            }

            // Cập nhật Firestore
            await updateUserProfile(profile.username, updates);

            // Cập nhật Redux state
            dispatch(updateProfile(updates));

            // Reload profile
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Có lỗi xảy ra khi cập nhật hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop - Blur only with animation */}
            <div 
                className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                style={{
                    animation: 'fadeIn 0.2s ease-out'
                }}
            >
                <div 
                    className="bg-[var(--bg-primary)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        animation: 'slideUp 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-6 py-4 flex items-center justify-between rounded-t-lg">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Chỉnh sửa hồ sơ</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Cover Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Ảnh bìa
                            </label>
                            <div className="relative h-40 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden group cursor-pointer"
                                onClick={() => coverPhotoInputRef.current?.click()}>
                                {coverPhotoPreview ? (
                                    <img src={coverPhotoPreview} alt="Cover preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-5xl">🖼️</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <input
                                ref={coverPhotoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverPhotoChange}
                                className="hidden"
                            />
                        </div>

                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Ảnh đại diện
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 rounded-full bg-[var(--bg-tertiary)] overflow-hidden group cursor-pointer"
                                    onClick={() => avatarInputRef.current?.click()}>
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl">👤</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-sm text-[var(--text-muted)]">
                                    Click để tải ảnh lên
                                </div>
                            </div>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Giới tính
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Ngày sinh
                            </label>
                            <input
                                type="text"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                placeholder="DD/MM/YYYY"
                                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+84 xxx xxx xxx"
                                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
