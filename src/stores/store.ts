import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.ts'
import settingReducer from './settingSlice.ts'
import themeReducer from './themeSlice.ts'
import onlineStatusReducer from './onlineStatusSlice.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingReducer,
    theme: themeReducer,
    onlineStatus: onlineStatusReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
