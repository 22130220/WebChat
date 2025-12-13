import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

