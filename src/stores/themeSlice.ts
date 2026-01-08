/*
  Slice này dùng để quản lý theme (Dark/Light/Auto Mode)
    + theme: 'light' | 'dark' | 'auto'
    + effectiveTheme: theme thực tế đang áp dụng ('light' | 'dark')
*/

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type EffectiveTheme = 'light' | 'dark'

interface ThemeState {
    theme: ThemeMode
    effectiveTheme: EffectiveTheme
}

// Load theme từ localStorage hoặc mặc định là 'auto'
const loadThemeFromStorage = (): ThemeMode => {
    try {
        const saved = localStorage.getItem('theme')
        if (saved === 'light' || saved === 'dark' || saved === 'auto') {
            return saved
        }
    } catch (error) {
        console.error('Error loading theme from localStorage:', error)
    }
    return 'auto'
}

// Detect system theme preference
const getSystemTheme = (): EffectiveTheme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
}

const initialTheme = loadThemeFromStorage()
const initialEffectiveTheme = initialTheme === 'auto' ? getSystemTheme() : initialTheme

const initialState: ThemeState = {
    theme: initialTheme,
    effectiveTheme: initialEffectiveTheme
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<ThemeMode>) {
            state.theme = action.payload

            // Tính toán effectiveTheme
            if (action.payload === 'auto') {
                state.effectiveTheme = getSystemTheme()
            } else {
                state.effectiveTheme = action.payload
            }

            // Lưu vào localStorage
            try {
                localStorage.setItem('theme', action.payload)
            } catch (error) {
                console.error('Error saving theme to localStorage:', error)
            }
        },

        setEffectiveTheme(state, action: PayloadAction<EffectiveTheme>) {
            // Chỉ update effectiveTheme khi đang ở auto mode
            if (state.theme === 'auto') {
                state.effectiveTheme = action.payload
            }
        },

        toggleTheme(state) {
            // Cycle: light -> dark -> auto -> light
            const cycle: ThemeMode[] = ['light', 'dark', 'auto']
            const currentIndex = cycle.indexOf(state.theme)
            const nextTheme = cycle[(currentIndex + 1) % cycle.length]

            state.theme = nextTheme

            if (nextTheme === 'auto') {
                state.effectiveTheme = getSystemTheme()
            } else {
                state.effectiveTheme = nextTheme
            }

            try {
                localStorage.setItem('theme', nextTheme)
            } catch (error) {
                console.error('Error saving theme to localStorage:', error)
            }
        }
    },
})

export const { setTheme, setEffectiveTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
