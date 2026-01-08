import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../stores/store'
import { setEffectiveTheme } from '../stores/themeSlice'

/**
 * Custom hook để quản lý theme
 * - Apply theme class vào HTML element
 * - Lắng nghe thay đổi system theme khi ở auto mode
 * - Sync với localStorage
 */
export const useTheme = () => {
    const dispatch = useDispatch()
    const { theme, effectiveTheme } = useSelector((state: RootState) => state.theme)

    // Apply theme class vào HTML element
    useEffect(() => {
        const root = document.documentElement

        // Remove cả 2 class trước
        root.classList.remove('light', 'dark')

        // Add class tương ứng
        root.classList.add(effectiveTheme)

        // Set attribute cho CSS selector
        root.setAttribute('data-theme', effectiveTheme)
    }, [effectiveTheme])

    // Lắng nghe thay đổi system theme khi ở auto mode
    useEffect(() => {
        if (theme !== 'auto') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light'
            dispatch(setEffectiveTheme(newTheme))
        }

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
        // Fallback for older browsers
        else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange)
            return () => mediaQuery.removeListener(handleChange)
        }
    }, [theme, dispatch])

    return { theme, effectiveTheme }
}
