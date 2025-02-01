import { useState, useEffect } from "react";

/**
 * Custom hook to manage WebSocket communication.
 */
export const useWebSocket = (selectedChatId: string | null) => {
  const [chatMessages, setChatMessages] = useState<Record<string, { id: string; content: string; isUser: boolean; timestamp: string }[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedChatId) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}/chat-ws/ws/${selectedChatId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setSocket(ws);
    ws.onclose = () => setSocket(null);

    return () => ws.close();
  }, [selectedChatId]);

  const handleSendMessage = (message: string) => {
    if (!selectedChatId || !socket) return;

    setIsLoading(true);
    socket.send(message);
    setIsLoading(false);
  };

  return { chatMessages, handleSendMessage, isLoading };
};
