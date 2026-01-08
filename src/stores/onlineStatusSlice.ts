import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface OnlineStatusState {
    isOnline: boolean;
}

const initialState: OnlineStatusState = {
    isOnline: false,
};

const onlineStatusSlice = createSlice({
    name: "onlineStatus",
    initialState,
    reducers: {
        setUserOnlineStatus: (
            state,
            action: PayloadAction<{ isOnline: boolean }>
        ) => {
            state.isOnline = action.payload.isOnline;
        },
    },
});

export const { setUserOnlineStatus } = onlineStatusSlice.actions;

// Selector
export const selectIsOnline = (state: RootState) => state.onlineStatus.isOnline;

export default onlineStatusSlice.reducer;
