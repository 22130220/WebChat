import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface GroupMember {
    id: number;
    name: string;
}

interface GroupMembersState {
    members: GroupMember[];
    roomName: string | null;
}

const initialState: GroupMembersState = {
    members: [],
    roomName: null,
};

const groupMembersSlice = createSlice({
    name: 'groupMembers',
    initialState,
    reducers: {
        setGroupMembers: (state, action: PayloadAction<{ members: GroupMember[]; roomName: string }>) => {
            state.members = action.payload.members;
            state.roomName = action.payload.roomName;
        },
        clearGroupMembers: (state) => {
            state.members = [];
            state.roomName = null;
        },
    },
});

export const { setGroupMembers, clearGroupMembers } = groupMembersSlice.actions;

export const selectGroupMembers = (state: RootState) => state.groupMembers.members;
export const selectRoomName = (state: RootState) => state.groupMembers.roomName;

export default groupMembersSlice.reducer;
