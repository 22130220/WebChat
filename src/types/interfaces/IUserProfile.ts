export interface IUserProfile {
    username: string;
    avatar: string;
    coverPhoto: string;
    dateOfBirth: string; // Format: DD/MM/YYYY
    phoneNumber: string;
    gender: 'Nam' | 'Nữ';
    updatedAt?: string;
}
