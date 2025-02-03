import { useState, useEffect } from "react";


/**
 * Custom hook for authentication management.
 * Fetches user data and provides logout functionality.
 */
export const useAuth = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user");

                const data = await response.json();
                setUser(data);

                const savedTheme = localStorage.getItem("darkMode");
                document.documentElement.classList.toggle("dark", savedTheme === "dark");
            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    /**
     * Logs out the user by removing authentication data from local storage.
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("darkMode");
        document.documentElement.classList.remove("dark");

        setUser(null);
        window.location.href = "/login";
    };

    return { user, loading, logout };
};
