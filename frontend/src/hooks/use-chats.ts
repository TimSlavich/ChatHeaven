import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for managing chat functionality.
 */
export const useChats = () => {
    const { toast } = useToast();
    const [chats, setChats] = useState<{ id: string; title: string; preview: string; timestamp: string }[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<{
        [chatId: string]: {
            messages: { id: string; content: string; isUser: boolean; timestamp: string }[];
            timestamp: string;
        }
    }>({});


    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        updateChatList();
    }, [chatHistory]);

    /**
     * Загружает список чатов и обновляет превью последнего сообщения
     */
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
                preview: "Loading...",
                timestamp: "Loading...",
            })));

            // Загружаем историю для всех чатов
            data.chats.forEach((chat: any) => {
                fetchChatHistory(chat.id, true);
            });
        } catch (error) {
            console.error("❌ Chat fetch error:", error);
        }
    };

    /**
     * Загружает историю сообщений для выбранного чата
     * @param chatId - ID чата
     * @param silent - Не перезаписывать selectedChatId (для массовой загрузки)
     */
    const fetchChatHistory = async (chatId: string, silent = false) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found in localStorage");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatId}/history`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Error fetching chats: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            const chatMessages = data.history;

            if (!Array.isArray(chatMessages)) {
                throw new Error("Invalid chat history format received from server");
            }

            setChatHistory(prevState => {
                const updatedState = {
                    ...prevState,
                    [chatId]: {
                        messages: chatMessages.map((chat: any) => ({
                            id: chat.id,
                            content: chat.content,
                            isUser: chat.isUser,
                            timestamp: new Date(chat.timestamp).toLocaleString(),
                        })),
                        timestamp: new Date(chatMessages[chatMessages.length - 1]?.timestamp || Date.now()).toLocaleString(),
                    }
                };

                updateChatList(updatedState);
                return updatedState;
            });

        } catch (error) {
            console.error("❌ Chat fetch error:", error);
        }
    };

    /**
     * Обновляет список чатов после загрузки истории
     */
    const updateChatList = (newChatHistory = chatHistory) => {
        setChats(prevChats => prevChats.map(chat => {
            const chatHistoryData = newChatHistory[chat.id]?.messages || [];
            const lastUserMessage = [...chatHistoryData].reverse().find(msg => msg.isUser)?.content || "Nothing yet";
            const lastTimestamp = newChatHistory[chat.id]?.timestamp ? formatDate(newChatHistory[chat.id]?.timestamp) : "No date";

            return {
                ...chat,
                preview: lastUserMessage,
                timestamp: lastTimestamp
            };
        }));
    };

    useEffect(() => {
        if (selectedChatId && chatHistory[selectedChatId] === undefined) {
            fetchChatHistory(selectedChatId);
        }
    }, [selectedChatId]);

    

    const handleNewUserMessage = (chatId: string, message: any) => {
        setChatHistory(prevState => {
            const updatedState = {
                ...prevState,
                [chatId]: {
                    messages: [...(prevState[chatId]?.messages || []), message],
                    timestamp: new Date().toLocaleString(),
                }
            };
            updateChatList(updatedState);
            return updatedState;
        });
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
    
            setChats((prevChats) => {
                const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
    
                if (selectedChatId === chatId) {
                    setSelectedChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
                }
    
                return updatedChats;
            });
    
            toast({ title: "Chat deleted", description: "The chat has been removed" });
        } catch (error) {
            console.error("❌ Chat deletion error:", error);
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return { chats, selectedChatId, setSelectedChatId, fetchChats, handleNewChat, handleDeleteChat, handleRenameChat, fetchChatHistory, chatHistory, handleNewUserMessage };
};
