import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { IUserProfile } from '../types/interfaces/IUserProfile';

interface UserProfileState {
    currentProfile: IUserProfile | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserProfileState = {
    currentProfile: null,
    loading: false,
    error: null,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<IUserProfile | null>) => {
            state.currentProfile = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateProfile: (state, action: PayloadAction<Partial<IUserProfile>>) => {
            if (state.currentProfile) {
                state.currentProfile = {
                    ...state.currentProfile,
                    ...action.payload,
                };
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearProfile: (state) => {
            state.currentProfile = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setProfile,
    updateProfile,
    setLoading,
    setError,
    clearProfile,
} = userProfileSlice.actions;

// Selectors
export const selectUserProfile = (state: RootState) => state.userProfile.currentProfile;
export const selectProfileLoading = (state: RootState) => state.userProfile.loading;
export const selectProfileError = (state: RootState) => state.userProfile.error;

export default userProfileSlice.reducer;
