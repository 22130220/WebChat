/*
  Slice này dùng để quản lý setting chung
    + connected: trạng thái kết nối WebSocket
*/

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  connected: boolean
}

const initialState: SettingsState = {
  connected: false,
}

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setConnect(state, action: PayloadAction<boolean>) {
      state.connected = action.payload
    }
  },
})

export const { setConnect } = settingSlice.actions
export default settingSlice.reducer

