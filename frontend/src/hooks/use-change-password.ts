import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to manage password change functionality.
 */
export const useChangePassword = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const changePassword = async (currentPassword: string, newPassword: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to change password");
            }

            toast({ title: "Success", description: "Password changed successfully" });
            return true;
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to change password", variant: "destructive" });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { changePassword, isLoading };
};
