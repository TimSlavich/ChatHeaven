import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to manage user chats.
 */
export const useChats = () => {
    const { toast } = useToast();
    const [chats, setChats] = useState<{ id: string; title: string; preview: string; timestamp: string }[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/chats`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error(`Error fetching chats: ${response.status}`);

            const data = await response.json();
            setChats(data.chats.map((chat: any) => ({
                id: chat.id,
                title: chat.name,
                preview: "",
                timestamp: "Recently",
            })));
        } catch (error) {
            console.error("❌ Chat fetch error:", error);
        }
    };

    const handleNewChat = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        if (!token || !userId) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: parseInt(userId) }),
            });

            if (!response.ok) throw new Error("Failed to create chat");

            const data = await response.json();
            setChats((prev) => [{ id: data.chat_id, title: "New Chat", preview: "", timestamp: "Just now" }, ...prev]);
            setSelectedChatId(data.chat_id);
        } catch (error) {
            console.error("❌ Chat creation error:", error);
        }
    };

    const handleRenameChat = async (chatId: string, newTitle: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatId}?new_name=${encodeURIComponent(newTitle)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to rename chat");

            setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat)));
            toast({ title: "Chat renamed", description: `Renamed to "${newTitle}"` });
        } catch (error) {
            console.error("❌ Chat rename error:", error);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete chat");

            setChats((prev) => prev.filter((chat) => chat.id !== chatId));
            setSelectedChatId(null);
            toast({ title: "Chat deleted", description: "The chat has been removed" });
        } catch (error) {
            console.error("❌ Chat deletion error:", error);
        }
    };


    return { chats, selectedChatId, setSelectedChatId, fetchChats, handleNewChat, handleRenameChat, handleDeleteChat };
};