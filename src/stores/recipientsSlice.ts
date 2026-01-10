import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IMessage } from '../types/interfaces/IMessage';

interface RecipientsState {
    recipients: IMessage[];
}

const initialState: RecipientsState = {
    recipients: [],
};

const recipientsSlice = createSlice({
    name: 'recipients',
    initialState,
    reducers: {
        setRecipients: (state, action: PayloadAction<IMessage[]>) => {
            state.recipients = action.payload;
        },
        addRecipient: (state, action: PayloadAction<IMessage>) => {
            const exists = state.recipients.some(
                (r) => r.name === action.payload.name && r.type === action.payload.type
            );
            if (!exists) {
                state.recipients.push(action.payload);
            }
        },
        clearRecipients: (state) => {
            state.recipients = [];
        },
    },
});

export const { setRecipients, addRecipient, clearRecipients } = recipientsSlice.actions;
export default recipientsSlice.reducer;
