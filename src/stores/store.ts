import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.ts'
import settingReducer from './settingSlice.ts'
import themeReducer from './themeSlice.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingReducer,
    theme: themeReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
