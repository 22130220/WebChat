/*
  Slice này dùng để quản lý setting chung
    + connected: trạng thái kết nối WebSocket
*/

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  connected: boolean
  isRelogin: boolean
}

const initialState: SettingsState = {
  connected: false,
  isRelogin: false
}

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setConnect(state, action: PayloadAction<boolean>) {
      state.connected = action.payload
    },
    setIsRelogin(state, action: PayloadAction<boolean>) {
      state.isRelogin = action.payload
    }
  },
})

export const { setConnect, setIsRelogin } = settingSlice.actions
export default settingSlice.reducer

