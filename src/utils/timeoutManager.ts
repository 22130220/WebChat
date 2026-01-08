/*
  Utility để quản lý timeout cho WebSocket requests
  - Tạo và lưu timeout ID
  - Clear timeout khi nhận được response
  - Tự động cleanup
*/

type TimeoutKey = 'createRoom' | 'joinRoom' | 'checkUser';

class TimeoutManager {
    private timeouts: Map<TimeoutKey, ReturnType<typeof setTimeout>> = new Map();

    /**
     * Tạo một timeout mới và lưu vào manager
     * @param key - Key để identify timeout
     * @param callback - Function sẽ được gọi khi timeout
     * @param delay - Thời gian delay (ms)
     */
    set(key: TimeoutKey, callback: () => void, delay: number): void {
        // Clear timeout cũ nếu có
        this.clear(key);

        const timeoutId = setTimeout(() => {
            callback();
            this.timeouts.delete(key);
        }, delay);

        this.timeouts.set(key, timeoutId);
    }

    /**
     * Clear một timeout cụ thể
     * @param key - Key của timeout cần clear
     */
    clear(key: TimeoutKey): void {
        const timeoutId = this.timeouts.get(key);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.timeouts.delete(key);
        }
    }

    /**
     * Clear tất cả timeouts
     */
    clearAll(): void {
        this.timeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this.timeouts.clear();
    }

    /**
     * Kiểm tra xem có timeout nào đang active không
     * @param key - Key của timeout cần kiểm tra
     */
    has(key: TimeoutKey): boolean {
        return this.timeouts.has(key);
    }
}

// Export singleton instance
export const timeoutManager = new TimeoutManager();
