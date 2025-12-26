import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.ts'
import settingReducer from './settingSlice.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
