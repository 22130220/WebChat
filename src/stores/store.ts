import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.ts'
import settingReducer from './settingSlice.ts'
import themeReducer from './themeSlice.ts'
import onlineStatusReducer from './onlineStatusSlice.ts'
import recipientsReducer from './recipientsSlice.ts'
import notificationReducer from './notificationSlice.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingReducer,
    theme: themeReducer,
    onlineStatus: onlineStatusReducer,
    recipients: recipientsReducer,
    notification: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
