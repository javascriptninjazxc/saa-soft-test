export function useLocalStorage<T>() {
    function get(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch(err) {
            console.error(err);
            return null;
        }
    }

    function set(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(e);
        }
    }

    return {
        get,
        set
    }
}