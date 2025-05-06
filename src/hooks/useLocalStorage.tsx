export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {
        try {
            window.localStorage.setItem(key, value); // ✅ stringify 제거
        } catch (error) {
            console.error(error);
        }
    }; 

    const getItem = () => {
        try {
            return window.localStorage.getItem(key); // ✅ parse 제거
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    return { setItem, getItem, removeItem };
};
