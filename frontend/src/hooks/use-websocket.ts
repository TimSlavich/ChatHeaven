import { useState, useEffect } from "react";

/**
 * Custom WebSocket hook for real-time chat functionality.
 * Handles user messages, WebSocket connection, and bot responses.
 */
export const useWebSocket = (selectedChatId: string | null) => {
  const [chatMessages, setChatMessages] = useState<Record<string, { id: string; content: string; isUser: boolean; timestamp: string }[]>>({});
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedChatId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}/chat-ws/ws/${selectedChatId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const newMessage = {
        id: Date.now().toString(),
        content: event.data,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
      }));
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
      setChatMessages((prev) => ({
        ...prev,
        [selectedChatId]: [], 
      }));
    };
  }, [selectedChatId]);

  const handleSendMessage = (message: string) => {
    if (!selectedChatId || !socket) return;

    setIsLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), userMessage],
    }));

    socket.send(message);
    setIsLoading(false);
  };

  return { chatMessages, handleSendMessage, isLoading };
};
